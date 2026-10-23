import { ProductPageImage } from "@/components/product/ProductPageImage";
import {
  luxuryImageFrameOuterClass,
  luxuryImageInnerClass,
} from "@/components/product/productLuxuryFrame";

/** صورة marketing واحدة — إطار فاخر */
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
      <div className={luxuryImageFrameOuterClass({ fullWidth: true })}>
        <ProductPageImage
          src={src}
          alt={`${productName} — صورة العرض`}
          className={`${luxuryImageInnerClass} h-auto object-cover`}
        />
      </div>
    </section>
  );
}
