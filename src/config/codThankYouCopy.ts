import { codFee, currencyLabel } from "@/config/pricing";

/** COD thank-you — minimal Khaleeji; every string is one screenful, no repetition. */
export const codThankYouCopy = {
  /** Shown under customer name */
  subtitle: "راح نتصل فيك خلال 15–45 دقيقة لتأكيد العنوان.",
  phoneHint: "خلّي جوّالك معاك",
  /** Horizontal journey — 4 words only */
  journey: [
    { id: "done", label: "تم الطلب" },
    { id: "call", label: "تأكيد" },
    { id: "pack", label: "تجهيز" },
    { id: "ship", label: "توصيل 2–4 أيام" },
  ] as const,
  orderRef: "مرجع",
  codShort: `دفع عند الاستلام · +${codFee} ${currencyLabel} توصيل`,
  homeCta: "الرئيسية",
} as const;
