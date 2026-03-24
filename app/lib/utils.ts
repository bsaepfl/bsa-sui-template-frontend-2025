import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random UUID v4 string.
 * Uses crypto.randomUUID() if available, otherwise falls back to crypto.getRandomValues().
 */
export function generateUUID(): string {
  // Try to use crypto.randomUUID() if available (modern browsers and Node.js 14.17+)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback: generate UUID v4 using crypto.getRandomValues()
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Set version (4) and variant bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

    // Convert to hex string
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join("-");
  }

  // Last resort: simple random string (not a real UUID, but works for nonces)
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2)
  );
}
