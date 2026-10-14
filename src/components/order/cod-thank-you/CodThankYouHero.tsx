import { codThankYouCopy } from "@/config/codThankYouCopy";
import { formatPrice } from "@/config/pricing";
import { IconCheck } from "./CodThankYouIcons";

type Props = {
  customerName: string;
  orderRef: string;
  createdAt: string;
  totalAed: number;
};

function formatOrderDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ar-AE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function CodThankYouHero({ customerName, orderRef, createdAt, totalAed }: Props) {
  const firstName = customerName.split(/\s+/)[0] ?? customerName;
  const { hero, meta } = codThankYouCopy;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-velora-burgundy/10 bg-white p-6 shadow-[0_12px_40px_rgba(58,24,32,0.08)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="absolute h-2 w-2 rounded-full bg-velora-champagne/50 animate-[codConfetti_3s_ease-out_infinite]"
            style={{
              left: `${12 + i * 14}%`,
              top: `${8 + (i % 3) * 6}%`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center text-center">
        <div className="flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full bg-velora-burgundy text-velora-cream shadow-lg shadow-velora-burgundy/25">
          <IconCheck className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-2xl font-bold leading-snug text-velora-burgundy-dark sm:text-[1.75rem]">
          {hero.title} 🎉
        </h1>
        <p className="mt-2 text-base text-velora-burgundy/75">
          {firstName}، {hero.subtitle}
        </p>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-velora-burgundy/85">
          {hero.nextStep}
        </p>
        <span className="mt-4 inline-flex rounded-full bg-velora-champagne/25 px-4 py-1.5 text-xs font-bold text-velora-burgundy-dark">
          {hero.codBadge}
        </span>
      </div>

      <div className="relative mt-8 grid grid-cols-2 gap-3 rounded-2xl bg-velora-cream/80 p-4 text-right text-sm">
        <div>
          <p className="text-[10px] font-semibold text-velora-burgundy/45">{meta.orderNumber}</p>
          <p className="mt-1 font-bold tabular-nums text-velora-burgundy-dark" dir="ltr">
            #{orderRef}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-velora-burgundy/45">{meta.orderDate}</p>
          <p className="mt-1 text-xs font-medium text-velora-burgundy/80">{formatOrderDate(createdAt)}</p>
        </div>
        <div className="col-span-2 flex items-center justify-between border-t border-velora-burgundy/10 pt-3">
          <span className="text-velora-burgundy/70">المبلغ</span>
          <span className="text-xl font-black text-velora-burgundy">{formatPrice(totalAed)}</span>
        </div>
      </div>
    </section>
  );
}
