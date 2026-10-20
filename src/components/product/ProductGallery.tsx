"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductPageImage } from "./ProductPageImage";

type Props = {
  mainSrc?: string;
  /** Up to 4 PDP images — hero carousel */
  gallerySrcs?: string[];
  productName: string;
  placeholder: string;
  laraFrame?: boolean;
  /** Nama-style: full width on mobile */
  fullWidthMobile?: boolean;
};

function EmptyImageSlot({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex min-h-[16rem] min-w-[16rem] items-center justify-center rounded-[1.25rem] border border-dashed border-velora-burgundy/15 bg-velora-cream-dark/50 ${className}`}
      aria-hidden
    />
  );
}

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      {direction === "prev" ? (
        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function ProductGallery({
  mainSrc,
  gallerySrcs,
  productName,
  placeholder,
  laraFrame = false,
  fullWidthMobile = false,
}: Props) {
  const images = useMemo(() => {
    const fromGallery = (gallerySrcs ?? [])
      .map((s) => s?.trim())
      .filter(Boolean) as string[];
    if (fromGallery.length > 0) return fromGallery;
    const single = mainSrc?.trim();
    return single ? [single] : [];
  }, [gallerySrcs, mainSrc]);

  const imageKey = images.join("\0");

  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActive(0);
    setFailed({});
  }, [imageKey]);

  const count = images.length;
  const activeSrc = images[active];
  const hasImages = count > 0;
  const showControls = count > 1;

  const goPrev = useCallback(() => {
    setActive((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setActive((i) => (i + 1) % count);
  }, [count]);

  const frameOuterClass = laraFrame
    ? `relative rounded-[2rem] border-8 border-white bg-white p-0 shadow-2xl ${
        fullWidthMobile
          ? "mx-auto w-full max-w-full lg:mx-0 lg:w-fit"
          : "mx-auto w-fit max-w-full lg:mx-0"
      }`
    : "relative mx-auto w-fit max-w-full rounded-[2rem] border border-velora-burgundy/10 bg-white shadow-lg";

  function onTouchStart(ev: React.TouchEvent) {
    touchStartX.current = ev.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(ev: React.TouchEvent) {
    if (touchStartX.current === null || count < 2) return;
    const endX = ev.changedTouches[0]?.clientX;
    if (endX === undefined) return;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) goNext();
    else goPrev();
  }

  return (
    <div className="w-full min-w-0">
      <div
        className={frameOuterClass}
        onTouchStart={showControls ? onTouchStart : undefined}
        onTouchEnd={showControls ? onTouchEnd : undefined}
      >
        {!hasImages || !activeSrc || failed[active] ? (
          failed[active] && activeSrc ? (
            <div className="flex min-h-[16rem] min-w-[16rem] items-center justify-center rounded-[1.25rem] bg-velora-cream-dark p-6 text-center text-sm text-velora-burgundy/60">
              {placeholder}
            </div>
          ) : (
            <EmptyImageSlot />
          )
        ) : (
          <ProductPageImage
            src={activeSrc}
            alt={`${productName} — صورة ${active + 1}`}
            priority={active === 0}
            className="rounded-[1.15rem]"
            onError={() => setFailed((prev) => ({ ...prev, [active]: true }))}
          />
        )}

        {showControls ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-velora-burgundy/10 bg-white/95 text-velora-burgundy shadow-sm transition hover:bg-white"
              aria-label="الصورة السابقة"
            >
              <ChevronIcon direction="prev" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-velora-burgundy/10 bg-white/95 text-velora-burgundy shadow-sm transition hover:bg-white"
              aria-label="الصورة التالية"
            >
              <ChevronIcon direction="next" />
            </button>
          </>
        ) : null}
      </div>

      {showControls ? (
        <div
          className="mt-3 flex justify-center gap-2 sm:mt-4"
          role="tablist"
          aria-label="معرض صور المنتج"
        >
          {images.map((src, index) => {
            const isActive = index === active;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`صورة ${index + 1} من ${count}`}
                onClick={() => setActive(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  isActive ? "bg-velora-burgundy" : "bg-velora-burgundy/25 hover:bg-velora-burgundy/45"
                }`}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
