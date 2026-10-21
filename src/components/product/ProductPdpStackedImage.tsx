"use client";

import { ProductPageImage } from "@/components/product/ProductPageImage";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
};

/** Full-bleed PDP stack — edge-to-edge on mobile, natural aspect ratio, no card chrome. */
export function ProductPdpStackedImage({ src, alt, priority = false }: Props) {
  return (
    <div
      className="-mx-4 w-[calc(100%+2rem)] max-w-none sm:-mx-6 sm:w-[calc(100%+3rem)] lg:mx-0 lg:w-full"
    >
      <ProductPageImage
        src={src}
        alt={alt}
        priority={priority}
        presentation="stacked"
        sizes="100vw"
      />
    </div>
  );
}
