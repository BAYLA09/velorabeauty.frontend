"use client";

import { useState } from "react";
import { VeloraImage } from "@/components/ui/VeloraImage";

type Props = {
  mainSrc: string;
  productName: string;
  placeholders: string[];
};

export function ProductGallery({ mainSrc, productName, placeholders }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <VeloraImage
        src={mainSrc}
        alt={productName}
        placeholder={placeholders[active] ?? placeholders[0]}
        className="aspect-square rounded-[2rem] border border-velora-burgundy/10 shadow-lg"
        priority
        sizes="(max-width: 768px) 100vw, 520px"
      />
      <div className="grid grid-cols-3 gap-3">
        {placeholders.map((ph, i) => (
          <button
            key={ph + i}
            type="button"
            onClick={() => setActive(i)}
            className={`overflow-hidden rounded-2xl border-2 transition ${
              active === i ? "border-velora-burgundy" : "border-velora-burgundy/10"
            }`}
          >
            <VeloraImage
              src={mainSrc}
              alt=""
              placeholder={ph}
              className="aspect-square"
              sizes="120px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
