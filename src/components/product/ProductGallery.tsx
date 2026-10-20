"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductPageImage } from "./ProductPageImage";

type Props = {
  mainSrc?: string;
  /** Up to 4 PDP images — main + thumbnail row */
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

  useEffect(() => {
    setActive(0);
    setFailed({});
  }, [imageKey]);

  const activeSrc = images[active];
  const hasImages = images.length > 0;
  const showThumbs = images.length > 1;

  const frameOuterClass = laraFrame
    ? `rounded-[2rem] border-8 border-white bg-white p-0 shadow-2xl ${
        fullWidthMobile
          ? "mx-auto w-full max-w-full lg:mx-0 lg:w-fit"
          : "mx-auto w-fit max-w-full lg:mx-0"
      }`
    : "mx-auto w-fit max-w-full rounded-[2rem] border border-velora-burgundy/10 bg-white shadow-lg";

  return (
    <div className="w-full min-w-0">
      <div className={frameOuterClass}>
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
            alt={productName}
            priority
            className="rounded-[1.15rem]"
            onError={() => setFailed((prev) => ({ ...prev, [active]: true }))}
          />
        )}
      </div>

      {showThumbs ? (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:gap-2.5">
          {images.map((src, index) => {
            const isActive = index === active;
            const thumbFailed = failed[index];
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`overflow-hidden rounded-xl border-2 bg-white transition ${
                  isActive
                    ? "border-velora-burgundy shadow-sm"
                    : "border-velora-burgundy/10 hover:border-velora-burgundy/35"
                }`}
                aria-label={`صورة ${index + 1} من ${images.length}`}
                aria-pressed={isActive}
              >
                {thumbFailed ? (
                  <div className="aspect-square bg-velora-cream-dark/80" aria-hidden />
                ) : (
                  <ProductPageImage
                    src={src}
                    alt=""
                    className="aspect-square object-cover"
                    sizes="80px"
                    onError={() => setFailed((prev) => ({ ...prev, [index]: true }))}
                  />
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
