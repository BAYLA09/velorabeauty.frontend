import { ProductPageImage } from "@/components/product/ProductPageImage";

/** صورة marketing واحدة (Lara-style) — لا تظهر 3 صور فوق بعض */
export function ProductMarketingGallery({
  src,
  productName,
}: {
  src?: string;
  productName: string;
}) {
  if (!src) return null;

  return (
    <section className="mx-auto max-w-lg px-4 py-2 sm:max-w-3xl sm:px-6">
      <div className="overflow-hidden rounded-[1.75rem] border border-velora-burgundy/10 bg-white shadow-sm">
        <ProductPageImage
          src={src}
          alt={`${productName} — صورة العرض`}
          className="h-auto w-full object-cover"
        />
      </div>
    </section>
  );
}
