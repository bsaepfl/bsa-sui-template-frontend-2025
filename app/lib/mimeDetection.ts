/**
 * Detect MIME type from raw bytes using magic byte signatures.
 * Falls back to UTF-8 text detection, then application/octet-stream.
 */
export function detectMimeType(data: Uint8Array): string {
  if (data.length < 4) {
    return "application/octet-stream";
  }

  // PNG: 89 50 4E 47
  if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47) {
    return "image/png";
  }

  // JPEG: FF D8 FF
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return "image/jpeg";
  }

  // GIF: 47 49 46
  if (data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46) {
    return "image/gif";
  }

  // PDF: 25 50 44 46
  if (data[0] === 0x25 && data[1] === 0x50 && data[2] === 0x44 && data[3] === 0x46) {
    return "application/pdf";
  }

  // WebP: 52 49 46 46 ... 57 45 42 50
  if (
    data.length >= 12 &&
    data[0] === 0x52 &&
    data[1] === 0x49 &&
    data[2] === 0x46 &&
    data[3] === 0x46 &&
    data[8] === 0x57 &&
    data[9] === 0x45 &&
    data[10] === 0x42 &&
    data[11] === 0x50
  ) {
    return "image/webp";
  }

  // ZIP: 50 4B
  if (data[0] === 0x50 && data[1] === 0x4b) {
    return "application/zip";
  }

  // WASM: 00 61 73 6D
  if (data[0] === 0x00 && data[1] === 0x61 && data[2] === 0x73 && data[3] === 0x6d) {
    return "application/wasm";
  }

  // SVG / XML: check for text starting with < (after optional BOM)
  const startOffset = data[0] === 0xef && data[1] === 0xbb && data[2] === 0xbf ? 3 : 0;
  if (data[startOffset] === 0x3c) {
    try {
      const header = new TextDecoder("utf-8", { fatal: true }).decode(data.slice(0, 512));
      if (header.includes("<svg")) return "image/svg+xml";
      if (header.includes("<?xml") || header.includes("<!DOCTYPE")) return "application/xml";
      return "text/html";
    } catch {
      // Not valid UTF-8, fall through
    }
  }

  // Try UTF-8 text detection on the first 1024 bytes
  try {
    const sample = new TextDecoder("utf-8", { fatal: true }).decode(
      data.slice(0, Math.min(1024, data.length)),
    );
    if (sample.trim().startsWith("{") || sample.trim().startsWith("[")) {
      return "application/json";
    }
    return "text/plain";
  } catch {
    return "application/octet-stream";
  }
}

/** Check if a MIME type represents an image that can be previewed inline. */
export function isPreviewableImage(mimeType: string): boolean {
  const PREVIEWABLE_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ]);
  return PREVIEWABLE_TYPES.has(mimeType);
}

/** Check if a MIME type represents text content. */
export function isTextContent(mimeType: string): boolean {
  return (
    mimeType.startsWith("text/") ||
    mimeType === "application/json" ||
    mimeType === "application/xml"
  );
}

/** Format byte count to human-readable string. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
