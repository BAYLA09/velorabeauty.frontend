import { listAllowedInternalPaths, REDIRECT_PUBLIC_PREFIX } from "@/lib/redirectkiller/constants";

export type DestinationValidation =
  | { ok: true; path: string }
  | { ok: false; reason: string };

function parsePathOnly(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return null;
  if (trimmed.startsWith("//")) return null;
  if (trimmed.includes("\\")) return null;
  if (!trimmed.startsWith("/")) return null;

  let pathPart = trimmed;
  let query = "";
  const qIndex = trimmed.indexOf("?");
  if (qIndex >= 0) {
    pathPart = trimmed.slice(0, qIndex);
    query = trimmed.slice(qIndex);
  }
  const hashIndex = pathPart.indexOf("#");
  if (hashIndex >= 0) {
    pathPart = pathPart.slice(0, hashIndex);
  }

  if (!pathPart || pathPart.length > 500) return null;
  try {
    pathPart = decodeURIComponent(pathPart);
  } catch {
    return null;
  }
  if (!pathPart.startsWith("/")) return null;
  return query ? `${pathPart}${query}` : pathPart;
}

export function validateInternalDestination(raw: string): DestinationValidation {
  const parsed = parsePathOnly(raw);
  if (!parsed) {
    return { ok: false, reason: "invalid_path" };
  }

  const pathOnly = parsed.split("?")[0] ?? parsed;
  if (pathOnly.startsWith(`${REDIRECT_PUBLIC_PREFIX}/`) || pathOnly === REDIRECT_PUBLIC_PREFIX) {
    return { ok: false, reason: "ads_loop" };
  }

  const allowed = new Set(listAllowedInternalPaths());
  if (!allowed.has(pathOnly)) {
    return { ok: false, reason: "not_allowed" };
  }

  return { ok: true, path: parsed.startsWith("/") ? parsed : `/${parsed}` };
}

export function wouldRedirectLoop(destinationPath: string, slug: string): boolean {
  const pathOnly = destinationPath.split("?")[0] ?? destinationPath;
  const normalizedSlug = slug.trim().toLowerCase();
  return pathOnly === `${REDIRECT_PUBLIC_PREFIX}/${normalizedSlug}`;
}
