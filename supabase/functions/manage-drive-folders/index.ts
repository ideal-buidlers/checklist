import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GoogleTokens {
  refresh_token: string;
  access_token: string;
  expires_at: string;
}

async function getAccessToken(supabase: any): Promise<string> {
  const { data, error } = await supabase
    .from("google_tokens")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) {
    throw new Error("No Google tokens found");
  }

  const tokens = data as GoogleTokens;
  const expiresAt = new Date(tokens.expires_at);

  // If token is still valid, return it
  if (expiresAt > new Date()) {
    return tokens.access_token;
  }

  // Refresh the token
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: Deno.env.get("GOOGLE_CLIENT_ID")!,
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
      refresh_token: tokens.refresh_token,
      grant_type: "refresh_token",
    }).toString(),
  });

  const newTokens = await response.json();

  // Update tokens in database
  await supabase
    .from("google_tokens")
    .update({
      access_token: newTokens.access_token,
      expires_at: new Date(
        Date.now() + newTokens.expires_in * 1000,
      ).toISOString(),
    })
    .eq("id", 1);

  return newTokens.access_token;
}

async function findFolderByName(
  accessToken: string,
  folderName: string,
  parentId?: string,
): Promise<string | null> {
  let query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();
  return data.files && data.files.length > 0 ? data.files[0].id : null;
}

async function createFolder(
  accessToken: string,
  folderName: string,
  parentId?: string,
): Promise<string> {
  const metadata: any = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  };

  if (parentId) {
    metadata.parents = [parentId];
  }

  const response = await fetch(
    "https://www.googleapis.com/drive/v3/files?fields=id",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    },
  );

  const data = await response.json();
  return data.id;
}

async function initializeChecklistFolder(accessToken: string): Promise<string> {
  // Check if Checklist folder exists
  let folderId = await findFolderByName(accessToken, "Checklist");

  // Create if doesn't exist
  if (!folderId) {
    folderId = await createFolder(accessToken, "Checklist");
  }

  return folderId;
}

async function createHouseFolder(
  accessToken: string,
  houseName: string,
  checklistFolderId: string,
): Promise<string> {
  // Check if house folder already exists
  let folderId = await findFolderByName(
    accessToken,
    houseName,
    checklistFolderId,
  );

  // Create if doesn't exist
  if (!folderId) {
    folderId = await createFolder(accessToken, houseName, checklistFolderId);
  }

  return folderId;
}

async function listFilesInFolder(
  accessToken: string,
  folderId: string,
): Promise<any[]> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and trashed=false&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,thumbnailLink)&orderBy=modifiedTime desc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();
  return data.files || [];
}

async function uploadFile(
  accessToken: string,
  folderId: string,
  fileName: string,
  fileData: string,
  mimeType: string,
): Promise<any> {
  // Decode base64 file data
  const binaryData = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0));

  // Create metadata
  const metadata = {
    name: fileName,
    parents: [folderId],
  };

  // Create multipart upload
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
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    },
  );

  return await response.json();
}

async function deleteFolder(
  accessToken: string,
  folderId: string,
): Promise<void> {
  await fetch(`https://www.googleapis.com/drive/v3/files/${folderId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Use service role key for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const accessToken = await getAccessToken(supabase);
    const {
      action,
      houseName,
      houseId,
      folderId,
      fileName,
      fileData,
      mimeType,
    } = await req.json();

    let result;

    switch (action) {
      case "initialize":
        const checklistFolderId = await initializeChecklistFolder(accessToken);
        result = { checklistFolderId };
        break;

      case "create-house-folder":
        if (!houseName) {
          throw new Error("houseName is required");
        }
        const rootFolderId = await initializeChecklistFolder(accessToken);
        const houseFolderId = await createHouseFolder(
          accessToken,
          houseName,
          rootFolderId,
        );

        // Store in database
        if (houseId) {
          // First try to insert
          const { error: insertError } = await supabase
            .from("house_drive_folders")
            .insert({
              house_id: houseId,
              drive_folder_id: houseFolderId,
            });

          // If it already exists, update it
          if (insertError && insertError.code === "23505") {
            const { error: updateError } = await supabase
              .from("house_drive_folders")
              .update({ drive_folder_id: houseFolderId })
              .eq("house_id", houseId);
            if (updateError) {
              console.error("Update error:", updateError);
              throw new Error(
                `Failed to update folder ID: ${updateError.message}`,
              );
            }
          } else if (insertError) {
            console.error("Insert error:", insertError);
            throw new Error(
              `Failed to store folder ID: ${insertError.message}`,
            );
          }
        }

        result = { houseFolderId };
        break;

      case "list-files":
        if (!folderId) {
          throw new Error("folderId is required");
        }
        const files = await listFilesInFolder(accessToken, folderId);
        result = { files };
        break;

      case "upload-file":
        if (!folderId || !fileName || !fileData || !mimeType) {
          throw new Error(
            "folderId, fileName, fileData, and mimeType are required",
          );
        }
        const uploadedFile = await uploadFile(
          accessToken,
          folderId,
          fileName,
          fileData,
          mimeType,
        );
        result = { file: uploadedFile };
        break;

      case "delete-house-folder":
        if (!folderId) {
          throw new Error("folderId is required");
        }
        await deleteFolder(accessToken, folderId);

        // Remove from database
        if (houseId) {
          await supabase
            .from("house_drive_folders")
            .delete()
            .eq("house_id", houseId);
        }

        result = { success: true };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
