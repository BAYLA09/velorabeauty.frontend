/** Parse COD sheet OrderDate (Asia/Dubai local) to UTC ISO. */
export function parseCodSheetOrderDateToIso(orderDate: string): string | null {
  const trimmed = orderDate.trim();
  if (!trimmed) return null;

  const match = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (!match) {
    const fallback = Date.parse(trimmed);
    return Number.isFinite(fallback) ? new Date(fallback).toISOString() : null;
  }

  const [, y, mo, d, h = "00", mi = "00", s = "00"] = match;
  const dubaiIso = `${y}-${mo}-${d}T${h}:${mi}:${s}+04:00`;
  const ms = Date.parse(dubaiIso);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}
