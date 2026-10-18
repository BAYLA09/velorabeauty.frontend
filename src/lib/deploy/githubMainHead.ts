const GITHUB_MAIN =
  "https://api.github.com/repos/BAYLA09/velorabeauty.frontend/commits/main";

let cachedPrefix: { value: string; atMs: number } | null = null;
const CACHE_MS = 60_000;

function githubAuthHeader(): string | undefined {
  const token =
    process.env.GITHUB_HEALTH_TOKEN?.trim() ||
    process.env.GITHUB_TOKEN?.trim();
  return token ? `Bearer ${token}` : undefined;
}

/** Public repo — optional GITHUB_HEALTH_TOKEN if VPS egress is rate-limited. */
export async function fetchGithubMainShaPrefix(): Promise<string | null> {
  const now = Date.now();
  if (cachedPrefix && now - cachedPrefix.atMs < CACHE_MS) {
    return cachedPrefix.value;
  }
  const auth = githubAuthHeader();
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(GITHUB_MAIN, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "velorabeauty-frontend-health",
          ...(auth ? { Authorization: auth } : {}),
        },
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
      });
      if (!res.ok) {
        if (attempt < 2) await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        continue;
      }
      const data = (await res.json()) as { sha?: string };
      const sha = data.sha?.trim();
      if (!sha || sha.length < 7) return null;
      const prefix = sha.slice(0, 7);
      cachedPrefix = { value: prefix, atMs: now };
      return prefix;
    } catch {
      if (attempt < 2) await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  return null;
}

export function buildShaPrefix(buildSha: string): string {
  const trimmed = buildSha.trim();
  if (!trimmed || trimmed === "local") return trimmed;
  return trimmed.length >= 7 ? trimmed.slice(0, 7) : trimmed;
}
