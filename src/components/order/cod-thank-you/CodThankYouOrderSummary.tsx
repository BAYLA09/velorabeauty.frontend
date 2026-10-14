import Image from "next/image";
import { codThankYouCopy } from "@/config/codThankYouCopy";
import { codFee, currencyLabel, formatPrice } from "@/config/pricing";
import type { BundleQuantity } from "@/config/pricing";

type Props = {
  productName: string;
  productSlug: string;
  quantity: BundleQuantity;
  image: { src: string; alt: string } | null;
  emirate: string;
  address: string;
  subtotalAed: number;
  deliveryFeeAed: number;
  totalAed: number;
};

export function CodThankYouOrderSummary({
  productName,
  quantity,
  image,
  emirate,
  address,
  subtotalAed,
  deliveryFeeAed,
  totalAed,
}: Props) {
  const { summary } = codThankYouCopy;

  return (
    <section className="rounded-3xl border border-velora-burgundy/10 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-right text-sm font-bold text-velora-burgundy-dark">{summary.title}</h2>

      <div className="mt-4 flex gap-4 text-right">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-velora-burgundy/10 bg-velora-cream">
          {image ? (
            <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="80px" />
          ) : (
            <div className="flex h-full items-center justify-center text-[9px] text-velora-burgundy/40">
              VELORA
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-velora-burgundy-dark">{productName}</p>
          <p className="mt-1 text-xs text-velora-burgundy/60">
            {summary.offer}: {quantity === 1 ? "قطعة واحدة" : quantity === 2 ? "عرض ×2" : "عرض ×3"}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-velora-burgundy/65">
            {emirate} · {address}
          </p>
        </div>
      </div>

      <dl className="mt-5 space-y-2 border-t border-velora-burgundy/10 pt-4 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-velora-burgundy/65">{summary.subtotal}</dt>
          <dd className="font-semibold tabular-nums text-velora-burgundy-dark">
            {formatPrice(subtotalAed)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-velora-burgundy/65">{summary.shipping}</dt>
          <dd className="font-semibold tabular-nums text-velora-burgundy-dark">
            +{deliveryFeeAed || codFee} {currencyLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-velora-burgundy/10 pt-3">
          <dt className="font-bold text-velora-burgundy">{summary.totalCod}</dt>
          <dd className="text-lg font-black tabular-nums text-velora-burgundy">{formatPrice(totalAed)}</dd>
        </div>
      </dl>
    </section>
  );
}
