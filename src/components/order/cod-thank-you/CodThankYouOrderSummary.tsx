import Image from "next/image";
import { codThankYouCopy } from "@/config/codThankYouCopy";
import { codFee, currencyLabel, formatPrice } from "@/config/pricing";
import type { BundleQuantity } from "@/config/pricing";
import { CodThankYouIconFrame } from "./CodThankYouIconFrame";
import { IconPackage, IconTruck } from "./CodThankYouIcons";

type Props = {
  productName: string;
  quantity: BundleQuantity;
  image: { src: string; alt: string } | null;
  emirate: string;
  address: string;
  subtotalAed: number;
  deliveryFeeAed: number;
  totalAed: number;
};

export function CodThankYouOrderSummary(props: Props) {
  const { summary } = codThankYouCopy;
  const qtyLabel =
    props.quantity === 1 ? "قطعة واحدة" : props.quantity === 2 ? "عرض ×2" : "عرض ×3";

  return (
    <section className="border-t border-velora-burgundy/8 px-5 py-5">
      <div className="flex items-center justify-end gap-2.5">
        <CodThankYouIconFrame variant="luxury" size="sm">
          <IconPackage />
        </CodThankYouIconFrame>
        <h2 className="text-sm font-bold text-velora-burgundy-dark">{summary.title}</h2>
      </div>

      <p className="mt-3 rounded-xl bg-velora-cream/80 px-3.5 py-3 text-right text-xs leading-relaxed text-velora-burgundy/80 ring-1 ring-velora-burgundy/8">
        {summary.promise}
      </p>

      <div className="mt-4 rounded-2xl border border-velora-burgundy/10 bg-gradient-to-b from-white to-velora-cream/40 p-4 text-right text-sm shadow-sm">
        <div className="flex gap-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-velora-cream ring-1 ring-velora-burgundy/10">
            {props.image ? (
              <Image src={props.image.src} alt={props.image.alt} fill className="object-cover" sizes="80px" />
            ) : (
              <div className="flex h-full items-center justify-center text-[9px] text-velora-burgundy/35">VELORA</div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-velora-burgundy-dark">{props.productName}</p>
            <p className="mt-1 text-xs text-velora-burgundy/55">
              {summary.offer}: {qtyLabel}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-velora-burgundy/65">
              {props.emirate} · {props.address}
            </p>
          </div>
        </div>

        <dl className="mt-4 space-y-2 border-t border-velora-burgundy/10 pt-3 text-xs">
          <div className="flex justify-between gap-2">
            <dt className="text-velora-burgundy/60">{summary.subtotal}</dt>
            <dd className="font-semibold tabular-nums">{formatPrice(props.subtotalAed)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-velora-burgundy/60">{summary.shipping}</dt>
            <dd className="font-semibold tabular-nums">
              +{props.deliveryFeeAed || codFee} {currencyLabel}
            </dd>
          </div>
          <div className="flex justify-between gap-2 border-t border-velora-burgundy/10 pt-2">
            <dt className="font-bold text-velora-burgundy">{summary.totalCod}</dt>
            <dd className="text-base font-black tabular-nums text-velora-burgundy">
              {formatPrice(props.totalAed)}
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex items-start justify-end gap-2 border-t border-velora-burgundy/8 pt-3 text-[11px] text-velora-burgundy/65">
          <p className="text-right leading-relaxed">{summary.deliveryNote}</p>
          <CodThankYouIconFrame variant="muted" size="sm" className="mt-0.5 shrink-0">
            <IconTruck />
          </CodThankYouIconFrame>
        </div>
      </div>
    </section>
  );
}
