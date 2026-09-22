"use client";

import { VeloraImage } from "@/components/ui/VeloraImage";

type Props = {
  mainSrc: string;
  productName: string;
  placeholder: string;
  laraFrame?: boolean;
};

export function ProductGallery({ mainSrc, productName, placeholder, laraFrame = false }: Props) {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-lg">
      <VeloraImage
        src={mainSrc}
        alt={productName}
        placeholder={placeholder}
        fit="contain"
        sharp
        className={
          laraFrame
            ? "aspect-square w-full overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-2xl"
            : "aspect-square w-full rounded-[2rem] border border-velora-burgundy/10 shadow-lg"
        }
        priority
        sizes="(max-width: 1024px) 92vw, 560px"
      />
    </div>
  );
}
