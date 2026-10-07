"use client";

import { useEffect, useState } from "react";
import { ProductPageImage } from "@/components/product/ProductPageImage";

type Props = {
  src: string;
  productName: string;
  watchSelector: string;
};

/** Mobile: mini product jar stays visible while scrolling the long PDP. */
export function ProductFloatingJar({ src, productName, watchSelector }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.querySelector(watchSelector);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: "-72px 0px 0px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [watchSelector]);

  if (!src.trim()) return null;

  return (
    <div
      className={`pointer-events-none fixed z-30 transition-all duration-300 lg:hidden ${
        visible
          ? "bottom-[5.25rem] end-4 translate-y-0 opacity-100"
          : "bottom-[5.25rem] end-4 translate-y-4 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="w-[4.25rem] overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl ring-1 ring-velora-burgundy/10">
        <ProductPageImage
          src={src}
          alt={productName}
          className="rounded-xl"
          sizes="68px"
        />
      </div>
    </div>
  );
}
