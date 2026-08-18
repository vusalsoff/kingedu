export function formatImageUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // If it's a relative path (already local) or data URI, return as is
  if (trimmed.startsWith("/") || trimmed.startsWith("data:")) return trimmed;

  // If it's already our image proxy, return as is
  if (trimmed.includes("/api/image")) return trimmed;

  // Check if it's a Google Drive link
  if (trimmed.includes("drive.google.com") || trimmed.includes("googleusercontent.com")) {
    let fileId = null;

    // Match ?id=FILE_ID or &id=FILE_ID
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    // Match /d/FILE_ID or /file/d/FILE_ID
    const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

    if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    } else if (dMatch && dMatch[1]) {
      fileId = dMatch[1];
    }

    if (fileId) {
      return `/api/image?id=${fileId}`;
    }
  }

  // Otherwise, use our image proxy
  return `/api/image?url=${encodeURIComponent(trimmed)}`;
}

export function cleanSheetImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (trimmed.includes("drive.google.com") || trimmed.includes("googleusercontent.com")) {
    let fileId = null;
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    } else if (dMatch && dMatch[1]) {
      fileId = dMatch[1];
    }
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
  }
  return trimmed;
}
