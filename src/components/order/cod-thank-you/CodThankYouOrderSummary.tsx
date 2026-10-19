import Image from "next/image";
import { codThankYouCopy } from "@/config/codThankYouCopy";
import { codFee, currencyLabel, formatPrice } from "@/config/pricing";
import type { OrderDisplayLine } from "@/lib/order/buildOrderDisplayLines";
import { CodThankYouIconFrame } from "./CodThankYouIconFrame";
import { IconPackage, IconTruck } from "./CodThankYouIcons";

type Props = {
  lines: OrderDisplayLine[];
  emirate: string;
  address: string;
  subtotalAed: number;
  deliveryFeeAed: number;
  totalAed: number;
};

export function CodThankYouOrderSummary(props: Props) {
  const { summary } = codThankYouCopy;

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

      <div className="mt-4 space-y-3">
        {props.lines.map((line) => (
          <div
            key={`${line.slug}-${line.quantity}-${line.name}`}
            className="flex items-center gap-3 rounded-2xl border border-velora-burgundy/10 bg-gradient-to-b from-white to-velora-cream/40 p-3 shadow-sm"
          >
            <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-[#FFF9F5] ring-1 ring-velora-burgundy/10">
              {line.image ? (
                <Image
                  src={line.image.src}
                  alt={line.image.alt}
                  fill
                  className="object-contain p-1"
                  sizes="72px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[8px] text-velora-burgundy/35">
                  VELORA
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 text-right">
              <p className="text-sm font-bold text-velora-burgundy-dark">{line.name}</p>
              <p className="mt-0.5 text-[11px] text-velora-burgundy/55">
                {line.quantity > 1 ? `الكمية: ×${line.quantity}` : summary.singleQty}
              </p>
            </div>
            <p className="shrink-0 text-base font-black tabular-nums text-velora-burgundy">
              {formatPrice(line.lineMerchandiseAed)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-velora-burgundy/10 bg-white p-4 text-right text-sm shadow-sm">
        <p className="text-xs leading-relaxed text-velora-burgundy/65">
          {props.emirate} · {props.address}
        </p>

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

        <p className="mt-3 rounded-xl bg-velora-champagne/25 px-3 py-2.5 text-center text-sm font-extrabold text-velora-burgundy-dark">
          {summary.prepareCash} {formatPrice(props.totalAed)}
        </p>

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
