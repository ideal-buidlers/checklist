import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SLACK_TOKEN = Deno.env.get("SLACK_BOT_TOKEN") ?? "";
const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY") ?? "";

interface ClaudeMatch {
  item: string;
  message: string;
  confidence: number;
  status: "done" | "ordered" | "called";
  reasoning?: string;
}

async function analyzeWithClaude(
  items: Array<{ sIdx: number; iIdx: number; text: string }>,
  messages: Array<{ text: string; author: string; ts: string }>,
): Promise<ClaudeMatch[]> {
  const itemsList = items
    .map((item, idx) => `${idx + 1}. ${item.text}`)
    .join("\n");
  const messagesList = messages
    .map((msg, idx) => `[${idx + 1}] ${msg.author}: ${msg.text}`)
    .join("\n");

  const prompt = `You are analyzing Slack messages from a construction project to identify task progress.

UNCHECKED ITEMS:
${itemsList}

RECENT MESSAGES:
${messagesList}

Identify which items have progress updates and determine the appropriate status:

STATUS DEFINITIONS:
- "done": Task is completed/finished (e.g., "done", "finished", "completed", "installed", "approved")
- "ordered": Task has been scheduled/ordered (e.g., "scheduled for Monday", "ordered", "booked", "appointment set")
- "called": Task is in planning/coordination phase (e.g., "called them", "reached out", "waiting for quote", "in discussion")

IGNORE:
- Future plans without action ("will do", "planning to", "need to")
- Questions without answers
- Negative statements ("not done", "waiting on", "haven't called")

Return ONLY a JSON array of matches with this exact format:
[
  {
    "item": "exact item text from list",
    "message": "the message text that indicates progress",
    "status": "done",
    "confidence": 0.95
  }
]

Confidence scoring:
- 0.9-1.0: Explicit statement
- 0.75-0.89: Strong implicit indication
- 0.6-0.74: Likely but ambiguous
- Below 0.6: Don't include

Return empty array [] if no matches found.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  // Extract JSON from response (handle markdown code blocks)
  let jsonText = content.trim();
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/```json?\n?/g, "").replace(/```\n?$/g, "");
  }

  try {
    const matches = JSON.parse(jsonText);
    return Array.isArray(matches) ? matches : [];
  } catch (e) {
    console.error("Failed to parse Claude response:", content);
    return [];
  }
}

async function slackGet(path: string, params: Record<string, string> = {}) {
  const url = new URL(`https://slack.com/api/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`Slack ${path} error: ${json.error}`);
  return json;
}

async function findChannelId(name: string): Promise<string | null> {
  const clean = name.replace(/^#/, "").toLowerCase();
  let cursor: string | undefined;
  for (let i = 0; i < 5; i++) {
    const params: Record<string, string> = {
      limit: "200",
      exclude_archived: "true",
      types: "public_channel,private_channel",
    };
    if (cursor) params.cursor = cursor;
    const data = await slackGet("conversations.list", params);
    const found = (data.channels as Array<{ id: string; name: string }>).find(
      (c) => c.name.toLowerCase() === clean,
    );
    if (found) return found.id;
    cursor = data.response_metadata?.next_cursor;
    if (!cursor) break;
  }
  return null;
}

async function getMessages(
  channelId: string,
  limit = 50,
): Promise<
  Array<{
    text: string;
    author: string;
    ts: string;
    files?: Array<{
      id: string;
      name: string;
      mimetype: string;
      url_private_download: string;
      size: number;
    }>;
  }>
> {
  const data = await slackGet("conversations.history", {
    channel: channelId,
    limit: String(limit),
  });
  return (
    data.messages as Array<{
      text: string;
      user?: string;
      username?: string;
      bot_id?: string;
      ts: string;
      files?: Array<{
        id: string;
        name: string;
        mimetype: string;
        url_private_download: string;
        size: number;
      }>;
    }>
  )
    .filter((m) => m.text && !m.bot_id)
    .map((m) => ({
      text: m.text,
      author: m.user || m.username || "unknown",
      ts: m.ts,
      files: m.files ? m.files.filter((f) => f.size <= 10485760) : undefined,
    }));
}

async function downloadSlackFile(
  fileUrl: string,
  slackToken: string,
): Promise<string> {
  const response = await fetch(fileUrl, {
    headers: { Authorization: `Bearer ${slackToken}` },
  });
  if (!response.ok) {
    throw new Error(`Failed to download Slack file: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function uploadFileToGoogleDrive(
  accessToken: string,
  folderId: string,
  fileName: string,
  fileData: string,
  mimeType: string,
): Promise<string> {
  const binaryData = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0));
  const metadata = {
    name: fileName,
    parents: [folderId],
  };

  const boundary = "-------314159265358979323846";
  const delimiter = "\r\n--" + boundary + "\r\n";
  const closeDelim = "\r\n--" + boundary + "--";

  const metadataPart =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata);

  const dataPart =
    delimiter +
    `Content-Type: ${mimeType}\r\n` +
    "Content-Transfer-Encoding: base64\r\n\r\n" +
    fileData;

  const multipartRequestBody = metadataPart + dataPart + closeDelim;

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Drive upload failed: ${response.status} ${error}`);
  }

  const result = await response.json();
  return result.id;
}

async function checkFileAlreadyUploaded(
  supabaseUrl: string,
  supabaseServiceKey: string,
  slackFileId: string,
): Promise<boolean> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/slack_file_uploads?slack_file_id=eq.${encodeURIComponent(slackFileId)}&select=id`,
      {
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
          apikey: supabaseServiceKey,
        },
      },
    );
    const data = await res.json();
    return data && data.length > 0;
  } catch (e) {
    console.error("Error checking file upload:", e);
    return false;
  }
}

async function recordFileUpload(
  supabaseUrl: string,
  supabaseServiceKey: string,
  slackFileId: string,
  slackChannel: string,
  driveFileId: string,
  fileName: string,
): Promise<void> {
  try {
    await fetch(`${supabaseUrl}/rest/v1/slack_file_uploads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        apikey: supabaseServiceKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slack_file_id: slackFileId,
        slack_channel: slackChannel,
        drive_file_id: driveFileId,
        file_name: fileName,
      }),
    });
  } catch (e) {
    console.error("Error recording file upload:", e);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  if (!SLACK_TOKEN) {
    return new Response(
      JSON.stringify({ error: "SLACK_BOT_TOKEN not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: {
    houses: Array<{
      hIdx: number;
      house: string;
      channel: string;
      items: Array<{ sIdx: number; iIdx: number; text: string }>;
    }>;
  };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const results: Array<{
    hIdx: number;
    sIdx: number;
    iIdx: number;
    channel: string;
    text: string;
    author: string;
    ts: string;
    confidence: number;
    status: string;
  }> = [];
  const errors: string[] = [];
  let filesUploaded = 0;
  let filesSkipped = 0;

  for (const { hIdx, house, channel, items } of body.houses) {
    try {
      const channelId = await findChannelId(channel);
      if (!channelId) {
        errors.push(`${house}: channel #${channel} not found`);
        continue;
      }

      const messages = await getMessages(channelId, 50);
      if (messages.length === 0) continue;

      // Use Claude to analyze all messages for this house at once
      const matches = await analyzeWithClaude(items, messages);

      // Process Claude's matches
      for (const match of matches) {
        // Find the item that matches
        const item = items.find((i) => i.text === match.item);
        if (!item) {
          console.warn(`Claude matched unknown item: ${match.item}`);
          continue;
        }

        // Find the message that triggered the match
        const message = messages.find((m) => m.text === match.message);
        if (!message) {
          console.warn(`Claude referenced unknown message: ${match.message}`);
          continue;
        }

        // Only include matches with confidence >= 0.75
        if (match.confidence >= 0.75) {
          results.push({
            hIdx,
            sIdx: item.sIdx,
            iIdx: item.iIdx,
            channel,
            text: message.text,
            author: message.author,
            ts: message.ts,
            confidence: match.confidence,
            status: match.status,
          });
        }
      }

      // Process file attachments from all messages
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        const googleTokens = await (async () => {
          const res = await fetch(
            `${supabaseUrl}/rest/v1/google_tokens?select=access_token`,
            {
              headers: {
                Authorization: `Bearer ${supabaseServiceKey}`,
                apikey: supabaseServiceKey,
              },
            },
          );
          const data = await res.json();
          return data[0];
        })();

        if (!googleTokens?.access_token) {
          console.log(`Skipping file upload for ${house}: no Google tokens`);
        } else {
          for (const message of messages) {
            if (!message.files || message.files.length === 0) continue;

            for (const file of message.files) {
              try {
                const alreadyUploaded = await checkFileAlreadyUploaded(
                  supabaseUrl,
                  supabaseServiceKey,
                  file.id,
                );
                if (alreadyUploaded) {
                  filesSkipped++;
                  continue;
                }

                const houseFolderRes = await fetch(
                  `${supabaseUrl}/rest/v1/house_drive_folders?select=drive_folder_id`,
                  {
                    headers: {
                      Authorization: `Bearer ${supabaseServiceKey}`,
                      apikey: supabaseServiceKey,
                    },
                  },
                );
                const houseFolders = await houseFolderRes.json();
                const houseFolderData = houseFolders[0];

                if (!houseFolderData?.drive_folder_id) {
                  console.log(
                    `Skipping file upload for ${house}: no Drive folder`,
                  );
                  continue;
                }

                const fileData = await downloadSlackFile(
                  file.url_private_download,
                  SLACK_TOKEN,
                );
                const driveFileId = await uploadFileToGoogleDrive(
                  googleTokens.access_token,
                  houseFolderData.drive_folder_id,
                  file.name,
                  fileData,
                  file.mimetype,
                );

                await recordFileUpload(
                  supabaseUrl,
                  supabaseServiceKey,
                  file.id,
                  channel,
                  driveFileId,
                  file.name,
                );

                filesUploaded++;
              } catch (fileError) {
                console.error(
                  `Failed to upload file ${file.name}: ${(fileError as Error).message}`,
                );
              }
            }
          }
        }
      } catch (fileProcessError) {
        console.error(
          `File processing error for ${house}: ${(fileProcessError as Error).message}`,
        );
      }
    } catch (e) {
      errors.push(`${house}: ${(e as Error).message}`);
    }
  }

  return new Response(
    JSON.stringify({ results, errors, filesUploaded, filesSkipped }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
});
