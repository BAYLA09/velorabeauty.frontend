import { ProductPageImage } from "@/components/product/ProductPageImage";

const SLOTS = [0, 1, 2] as const;

/** 3 emplacements marketing sous le funnel — slot 3 vide jusqu’à ce que tu ajoutes l’image */
export function ProductMarketingGallery({
  slots,
  productName,
}: {
  slots?: readonly (string | undefined)[];
  productName: string;
}) {
  const normalized: (string | undefined)[] = [
    slots?.[0],
    slots?.[1],
    slots?.[2],
  ];

  const hasAny = normalized.some(Boolean);
  if (!hasAny) {
    return (
      <section className="mx-auto max-w-lg px-4 py-2 sm:max-w-3xl sm:px-6">
        <div className="grid gap-4">
          {SLOTS.map((i) => (
            <EmptySlot key={i} index={i + 1} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg space-y-4 px-4 py-2 sm:max-w-3xl sm:px-6">
      {SLOTS.map((i) => {
        const src = normalized[i];
        if (src) {
          return (
            <div
              key={i}
              className="overflow-hidden rounded-[1.75rem] border border-velora-burgundy/10 bg-white shadow-sm"
            >
              <ProductPageImage
                src={src}
                alt={`${productName} — صورة ${i + 1}`}
                className="h-auto w-full object-cover"
              />
            </div>
          );
        }
        return <EmptySlot key={i} index={i + 1} />;
      })}
    </section>
  );
}

function EmptySlot({ index }: { index: number }) {
  return (
    <div
      className="flex min-h-[11rem] flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-velora-burgundy/20 bg-velora-cream-dark/80 px-6 py-10 text-center"
      aria-label={`مكان الصورة ${index} — فارغ`}
    >
      <p className="text-sm font-bold text-velora-burgundy/45">صورة {index}</p>
      <p className="mt-1 text-xs text-velora-burgundy/35">اتركيها فارغة — تزيدي الصورة من GitHub لاحقاً</p>
    </div>
  );
}
