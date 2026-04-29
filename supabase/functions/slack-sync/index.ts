import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SLACK_TOKEN = Deno.env.get("SLACK_BOT_TOKEN") ?? "";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "can",
  "her",
  "was",
  "one",
  "our",
  "out",
  "day",
  "get",
  "has",
  "him",
  "his",
  "how",
  "its",
  "now",
  "did",
  "let",
  "put",
  "say",
  "she",
  "too",
  "use",
  "will",
  "with",
  "from",
  "have",
  "this",
  "that",
  "they",
  "been",
  "when",
  "were",
  "your",
  "what",
  "there",
  "their",
  "than",
  "then",
  "some",
  "also",
  "into",
  "just",
  "like",
  "more",
  "over",
  "such",
  "time",
  "very",
  "even",
  "most",
  "each",
  "much",
  "call",
  "come",
  "back",
  "down",
  "here",
  "made",
  "make",
  "only",
  "same",
  "take",
  "than",
  "well",
  "went",
]);

const FUTURE_RE =
  /\b(will|gonna|going to|need to|needs to|should|would|planning|plan to|hope to|trying|waiting)\b/i;
const QUESTION_RE = /\?/;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w));
}

function scoreMatch(itemTokens: string[], msgText: string): number {
  const msgLower = msgText.toLowerCase();
  let hits = 0;
  for (const t of itemTokens) {
    if (msgLower.includes(t)) hits++;
  }
  return hits;
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
): Promise<Array<{ text: string; author: string; ts: string }>> {
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
    }>
  )
    .filter((m) => m.text && !m.bot_id)
    .map((m) => ({
      text: m.text,
      author: m.user || m.username || "unknown",
      ts: m.ts,
    }));
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
  }> = [];
  const errors: string[] = [];

  for (const { hIdx, house, channel, items } of body.houses) {
    try {
      const channelId = await findChannelId(channel);
      if (!channelId) {
        errors.push(`${house}: channel #${channel} not found`);
        continue;
      }

      const messages = await getMessages(channelId, 50);
      if (messages.length === 0) continue;

      for (const msg of messages) {
        if (FUTURE_RE.test(msg.text) || QUESTION_RE.test(msg.text)) continue;
        let bestItem: (typeof items)[0] | null = null;
        let bestScore = 0;
        for (const item of items) {
          const tokens = tokenize(item.text);
          if (tokens.length === 0) continue;
          const score = scoreMatch(tokens, msg.text);
          const threshold = Math.max(2, Math.ceil(tokens.length * 0.4));
          if (score >= threshold && score > bestScore) {
            bestScore = score;
            bestItem = item;
          }
        }
        if (bestItem) {
          results.push({
            hIdx,
            sIdx: bestItem.sIdx,
            iIdx: bestItem.iIdx,
            channel,
            text: msg.text,
            author: msg.author,
            ts: msg.ts,
          });
        }
      }
    } catch (e) {
      errors.push(`${house}: ${(e as Error).message}`);
    }
  }

  return new Response(JSON.stringify({ results, errors }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
