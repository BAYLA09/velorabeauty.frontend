"use client";

import { ProductPageImage } from "@/components/product/ProductPageImage";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
};

/** Full-width static PDP image — no carousel. */
export function ProductPdpStackedImage({ src, alt, priority = false }: Props) {
  return (
    <div className="-mx-4 w-[calc(100%+2rem)] max-w-none sm:mx-0 sm:w-full">
      <ProductPageImage
        src={src}
        alt={alt}
        priority={priority}
        className="w-full rounded-none object-cover sm:rounded-2xl"
        sizes="100vw"
      />
    </div>
  );
}
