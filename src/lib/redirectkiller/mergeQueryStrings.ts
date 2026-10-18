/**
 * Merge incoming ad query params onto a destination path.
 * Destination query keys are kept; incoming adds only missing keys.
 */
export function buildRedirectLocation(
  destinationPath: string,
  incomingSearchParams: URLSearchParams,
): string {
  const qIndex = destinationPath.indexOf("?");
  const pathOnly = qIndex >= 0 ? destinationPath.slice(0, qIndex) : destinationPath;
  const destQuery =
    qIndex >= 0 ? new URLSearchParams(destinationPath.slice(qIndex + 1)) : new URLSearchParams();

  const merged = new URLSearchParams();
  destQuery.forEach((value, key) => {
    merged.append(key, value);
  });

  incomingSearchParams.forEach((value, key) => {
    if (!merged.has(key)) {
      merged.append(key, value);
    }
  });

  const qs = merged.toString();
  return qs ? `${pathOnly}?${qs}` : pathOnly;
}
