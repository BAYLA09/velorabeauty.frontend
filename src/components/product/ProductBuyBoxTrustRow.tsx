import { IconCheckCircle } from "@/components/product/ProductFunnelIcons";

const items = [
  {
    title: "الدفع عند الاستلام",
    sub: "متاح داخل الإمارات",
    icon: (
      <>
        <rect x="4" y="7" width="16" height="10" rx="2" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
  },
  {
    title: "توصيل 2–4 أيام",
    sub: "داخل الإمارات",
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v8H3V7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4l3 3v2h-7v-5z" />
      </>
    ),
  },
  {
    title: "ضمان 30 يوم",
    sub: "استرجاع كامل",
    icon: <IconCheckCircle className="h-5 w-5" />,
  },
] as const;

/** Compact 3-icon trust row directly under the buy-box CTA */
export function ProductBuyBoxTrustRow() {
  return (
    <div
      className="grid grid-cols-3 gap-2 rounded-2xl border border-velora-burgundy/10 bg-velora-cream-dark/60 px-2 py-3 sm:gap-3 sm:px-3"
      aria-label="ضمانات الطلب"
    >
      {items.map((item) => (
        <div key={item.title} className="flex min-w-0 flex-col items-center gap-1.5 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-velora-burgundy/15 bg-white text-velora-burgundy">
            {item.title === "ضمان 30 يوم" ? (
              item.icon
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                {item.icon}
              </svg>
            )}
          </div>
          <p className="text-[10px] font-extrabold leading-snug text-velora-burgundy-dark sm:text-[11px]">
            {item.title}
          </p>
          <p className="text-[9px] font-semibold text-velora-burgundy/55 sm:text-[10px]">{item.sub}</p>
        </div>
      ))}
      <p className="col-span-3 mt-1 text-center text-[11px] font-semibold leading-relaxed text-velora-burgundy/70">
        📞 سيتصل بك فريقنا خلال 24 ساعة لتأكيد طلبك — الرجاء الرد على الرقم
      </p>
    </div>
  );
}
