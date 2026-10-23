"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { ProductPageImage } from "./ProductPageImage";

type Props = {
  mainSrc?: string;
  /** Carousel images (typically 3) below optional fixed before/after hero */
  gallerySrcs?: string[];
  /** Fixed full-width before/after hero — not part of the carousel */
  fixedBeforeAfterSrc?: string;
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
  fixedBeforeAfterSrc,
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

  const fixedHero = fixedBeforeAfterSrc?.trim() || "";
  const imageKey = `${fixedHero}\0${images.join("\0")}`;

  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [fixedFailed, setFixedFailed] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActive(0);
    setFailed({});
    setFixedFailed(false);
  }, [imageKey]);

  const count = images.length;
  const activeSrc = images[active];
  const hasCarouselImages = count > 0;
  const showControls = count > 1;

  const failKey = (src: string) => src;

  const goPrev = useCallback(() => {
    setActive((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setActive((i) => (i + 1) % count);
  }, [count]);

  const frameWidthClass = fullWidthMobile
    ? "mx-auto w-full max-w-full lg:mx-0 lg:w-fit"
    : "mx-auto w-fit max-w-full lg:mx-0";

  /** Lara-style luxury frame — white mat, soft depth; only when laraFrame=true */
  const frameOuterClass = laraFrame
    ? `relative overflow-hidden rounded-[1.625rem] border-[7px] border-white bg-[#faf8f5] p-1 shadow-[0_6px_28px_rgba(44,19,24,0.07),0_22px_56px_rgba(44,19,24,0.11)] ring-1 ring-[#2c1318]/[0.06] sm:rounded-[2rem] sm:border-8 sm:p-1.5 ${frameWidthClass}`
    : "relative mx-auto w-fit max-w-full rounded-[2rem] border border-velora-burgundy/10 bg-white shadow-lg";

  const frameImageClass = laraFrame ? "rounded-[1.2rem] sm:rounded-[1.35rem]" : "rounded-[1.15rem]";

  function onTouchStart(ev: TouchEvent) {
    touchStartX.current = ev.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(ev: TouchEvent) {
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
      {fixedHero ? (
        <div
          className={
            fullWidthMobile
              ? "-mx-4 mb-4 w-[calc(100%+2rem)] max-w-none sm:mx-0 sm:mb-5 sm:w-full"
              : "mb-4 w-full sm:mb-5"
          }
        >
          {fixedFailed ? (
            <div className="flex min-h-[12rem] items-center justify-center bg-velora-cream-dark px-4 text-center text-sm text-velora-burgundy/60">
              {placeholder}
            </div>
          ) : (
            <ProductPageImage
              src={fixedHero}
              alt={`${productName} — قبل وبعد`}
              priority
              className="w-full rounded-none object-cover sm:rounded-[1.15rem]"
              sizes="100vw"
              onError={() => setFixedFailed(true)}
            />
          )}
        </div>
      ) : null}

      <div
        className={frameOuterClass}
        onTouchStart={showControls ? onTouchStart : undefined}
        onTouchEnd={showControls ? onTouchEnd : undefined}
      >
        {!hasCarouselImages || !activeSrc || failed[failKey(activeSrc)] ? (
          failed[failKey(activeSrc)] && activeSrc ? (
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
            priority={!fixedHero && active === 0}
            className={frameImageClass}
            onError={() =>
              setFailed((prev) => ({ ...prev, [failKey(activeSrc)]: true }))
            }
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
