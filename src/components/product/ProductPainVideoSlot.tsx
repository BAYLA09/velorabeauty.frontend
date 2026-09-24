"use client";

/**
 * مربع فيديو واحد تحت «مشاكل تعرفينها» — يظهر دائماً (خاوي حتى تضيفي الفيديو).
 * عبّي `painSectionVideoSrc` في `src/config/images.ts` → productPage.{hair|skin|eye}
 */
export function ProductPainVideoSlot({
  videoSrc,
  posterSrc,
  productName,
}: {
  videoSrc?: string;
  posterSrc?: string;
  productName: string;
}) {
  const hasVideo = Boolean(videoSrc?.trim());

  return (
    <section className="bg-velora-cream pb-10 pt-2 sm:pb-14">
      <div className="mx-auto max-w-lg px-4 sm:max-w-md sm:px-6">
        <div className="overflow-hidden rounded-[1.75rem] border border-velora-burgundy/12 bg-white shadow-[0_8px_32px_rgba(58,24,32,0.08)]">
          <div className="relative aspect-square w-full bg-gradient-to-br from-velora-cream-dark via-white to-velora-cream-dark">
            {hasVideo ? (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={videoSrc}
                poster={posterSrc}
                controls
                playsInline
                preload="metadata"
                aria-label={`فيديو — ${productName}`}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-velora-burgundy/15 bg-velora-cream text-velora-burgundy/50"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <p className="text-xs font-semibold text-velora-burgundy/40">مساحة الفيديو</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
