/** يحمّل الصور في الخلفية قبل ما تحتاجها الواجهة */
export function preloadImageUrls(urls: (string | undefined)[]): void {
  if (typeof window === "undefined") return;
  const seen = new Set<string>();
  for (const url of urls) {
    if (!url?.trim() || seen.has(url)) continue;
    seen.add(url);
    const img = new window.Image();
    img.decoding = "async";
    img.src = url;
  }
}
