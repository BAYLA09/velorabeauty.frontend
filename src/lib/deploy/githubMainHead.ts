const GITHUB_MAIN =
  "https://api.github.com/repos/BAYLA09/velorabeauty.frontend/commits/main";

let cachedPrefix: { value: string; atMs: number } | null = null;
const CACHE_MS = 60_000;

/** Public repo — no token. Used by /api/health to show if production is stale. */
export async function fetchGithubMainShaPrefix(): Promise<string | null> {
  const now = Date.now();
  if (cachedPrefix && now - cachedPrefix.atMs < CACHE_MS) {
    return cachedPrefix.value;
  }
  try {
    const res = await fetch(GITHUB_MAIN, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "velorabeauty-frontend-health",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { sha?: string };
    const sha = data.sha?.trim();
    if (!sha || sha.length < 7) return null;
    const prefix = sha.slice(0, 7);
    cachedPrefix = { value: prefix, atMs: now };
    return prefix;
  } catch {
    return null;
  }
}

export function buildShaPrefix(buildSha: string): string {
  const trimmed = buildSha.trim();
  if (!trimmed || trimmed === "local") return trimmed;
  return trimmed.length >= 7 ? trimmed.slice(0, 7) : trimmed;
}
