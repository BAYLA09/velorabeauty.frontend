import type { ReactNode } from "react";

type TrustItem = {
  title: string;
  sub: string;
  /** Subtitle shown larger (e.g. حلال • جودة ممتازة) */
  subEmphasis?: boolean;
  icon: ReactNode;
};

export function ProductTrustBar({
  compact = false,
  prominent = false,
}: {
  compact?: boolean;
  /** Nama-style large 2×2 bar (gallery / story) */
  prominent?: boolean;
}) {
  const items: TrustItem[] = [
    {
      title: "الدفع عند الاستلام",
      sub: "بدون دفع أونلاين",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      title: "توصيل داخل الإمارات",
      sub: "لمناطق متعددة",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      ),
    },
    {
      title: "30 يوم",
      sub: "سياسة استرجاع واضحة",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      ),
    },
    {
      title: "مرخّص ومعتمد",
      sub: "حلال · معتمد",
      subEmphasis: true,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      ),
    },
  ];

  const isLarge = prominent && !compact;

  return (
    <div
      className={
        isLarge
          ? "overflow-hidden rounded-[1.75rem] bg-[#2c1318] text-velora-cream shadow-[0_10px_40px_rgba(44,19,24,0.25)]"
          : compact
            ? "overflow-hidden rounded-2xl bg-[#2c1318] text-velora-cream"
            : "border-y border-white/10 bg-[#2c1318] text-velora-cream"
      }
    >
      <div
        className={
          isLarge
            ? "px-4 py-5 sm:px-6 sm:py-6"
            : compact
              ? "px-3 py-3 sm:px-4 sm:py-4"
              : "mx-auto max-w-6xl px-4 py-3 sm:px-6"
        }
      >
        <div
          className={
            isLarge
              ? "grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-6"
              : "grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          }
        >
          {items.map((item) => (
            <div
              key={item.title}
              className={`flex items-center gap-3 sm:gap-3.5 ${item.subEmphasis && isLarge ? "sm:col-span-1" : ""}`}
            >
              <div
                className={
                  isLarge
                    ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-velora-champagne/45 bg-white/5 text-velora-champagne sm:h-12 sm:w-12"
                    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-velora-champagne/40 bg-white/5 text-velora-champagne sm:h-10 sm:w-10"
                }
              >
                <svg
                  className={isLarge ? "h-5 w-5 sm:h-6 sm:w-6" : "h-4 w-4 sm:h-5 sm:w-5"}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {item.icon}
                </svg>
              </div>
              <div className="min-w-0">
                <p
                  className={
                    isLarge
                      ? "text-[13px] font-extrabold leading-snug sm:text-[15px]"
                      : "text-[11px] font-extrabold leading-snug sm:text-xs"
                  }
                >
                  {item.title}
                </p>
                <p
                  className={
                    item.subEmphasis && isLarge
                      ? "mt-0.5 text-[13px] font-black leading-snug text-velora-champagne sm:text-base"
                      : isLarge
                        ? "mt-0.5 text-[11px] font-semibold text-velora-cream/65 sm:text-xs"
                        : "text-[9px] text-velora-cream/60 sm:text-[10px]"
                  }
                >
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
