import {
  cardBundlePrices,
  codFee,
  currencyLabel,
  type BundleQuantity,
} from "@/config/pricing";
import { IconBanknote, IconCard } from "@/components/product/ProductFunnelIcons";

/** عرض معلوماتي فقط — الاختيار فـ `/checkout` */
export function ProductPaymentMethodsInfo({ quantity: _quantity }: { quantity: BundleQuantity }) {
  void _quantity;

  return (
    <div className="space-y-2.5 pt-1" aria-label="طرق الدفع المتاحة">
      <p className="text-sm font-extrabold tracking-wide text-velora-burgundy-dark">
        طرق الدفع المتاحة
      </p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className="pointer-events-none select-none rounded-2xl border border-velora-burgundy/10 bg-gradient-to-br from-white to-velora-cream-dark/40 px-3.5 py-3.5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-velora-champagne/35 bg-velora-cream text-velora-burgundy">
              <IconCard className="h-5 w-5" />
            </span>
            <div className="min-w-0 text-right">
              <p className="text-sm font-extrabold text-velora-burgundy-dark">الدفع بالبطاقة</p>
              <p className="mt-0.5 text-[11px] font-bold text-emerald-800">شحن مجاني</p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none select-none rounded-2xl border border-velora-burgundy/10 bg-gradient-to-br from-white to-velora-cream-dark/40 px-3.5 py-3.5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-velora-burgundy/15 bg-white text-velora-burgundy">
              <IconBanknote className="h-5 w-5" />
            </span>
            <div className="min-w-0 text-right">
              <p className="text-sm font-extrabold text-velora-burgundy-dark">الدفع عند الاستلام</p>
              <p className="mt-0.5 text-[11px] font-bold text-amber-900/85">
                +{codFee} {currencyLabel} رسوم التوصيل
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-[11px] font-medium leading-relaxed text-velora-burgundy/55">
        تختارين طريقة الدفع في الخطوة التالية — السعر المعروض أعلاه بدون رسوم COD.
      </p>
    </div>
  );
}

export function cardOfferPrice(quantity: BundleQuantity): number {
  return cardBundlePrices[quantity];
}
