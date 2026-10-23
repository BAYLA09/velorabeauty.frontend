"use client";

import { ProductPageImage } from "@/components/product/ProductPageImage";
import {
  luxuryImageFrameOuterClass,
  luxuryImageInnerClass,
} from "@/components/product/productLuxuryFrame";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
};

/** PDP scroll images — luxury white mat frame (Lara-style). */
export function ProductPdpStackedImage({ src, alt, priority = false }: Props) {
  return (
    <div className="w-full min-w-0">
      <div className={luxuryImageFrameOuterClass({ fullWidth: true })}>
        <ProductPageImage
          src={src}
          alt={alt}
          priority={priority}
          presentation="stacked"
          sizes="100vw"
          className={luxuryImageInnerClass}
        />
      </div>
    </div>
  );
}
