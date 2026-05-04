/**
 * Helper functions for Google Drive integration
 */

const EDGE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/manage-drive-folders`;

async function callDriveFunction(action, params = {}) {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ action, ...params }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Drive operation failed");
  }

  return await response.json();
}

export async function initializeChecklistFolder() {
  return await callDriveFunction("initialize");
}

export async function createHouseFolder(houseName, houseId) {
  return await callDriveFunction("create-house-folder", {
    houseName,
    houseId,
  });
}

export async function listFilesInFolder(folderId) {
  return await callDriveFunction("list-files", { folderId });
}

export async function uploadFileToFolder(folderId, fileName, fileData, mimeType) {
  return await callDriveFunction("upload-file", {
    folderId,
    fileName,
    fileData,
    mimeType,
  });
}

export async function deleteHouseFolder(folderId, houseId) {
  return await callDriveFunction("delete-house-folder", {
    folderId,
    houseId,
  });
}

// Helper to convert File object to base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1]; // Remove data:...;base64, prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper to format file size
export function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

// Helper to format date
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
