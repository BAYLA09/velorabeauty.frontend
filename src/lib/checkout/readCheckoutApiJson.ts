/** Avoid bare `res.json()` throws (HTML/502) masking the real API error in checkout UI. */
export async function readCheckoutApiJson<T>(
  res: Response,
): Promise<{ ok: true; data: T } | { ok: false; data: T | null; nonJson: boolean }> {
  const text = await res.text();
  if (!text.trim()) {
    return { ok: false, data: null, nonJson: true };
  }
  try {
    return { ok: true, data: JSON.parse(text) as T };
  } catch {
    return { ok: false, data: null, nonJson: true };
  }
}
