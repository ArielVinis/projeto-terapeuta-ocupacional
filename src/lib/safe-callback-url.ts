import { PATHS } from "@/src/constants/paths";

/**
 * Only allow same-origin relative paths (blocks open redirects).
 */
export function safeCallbackUrl(
  raw: string | null | undefined,
  fallback: string = PATHS.meusEbooks,
): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return fallback;
  }
  try {
    const url = new URL(raw, "http://local.invalid");
    if (url.origin !== "http://local.invalid") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
