import { codFee, currencyLabel } from "@/config/pricing";

/** Post-checkout COD — Khaleeji (UAE/Gulf) tone, short & clear for call confirmation. */
export const codThankYouCopy = {
  eyebrow: "VELORA BEAUTY · الدفع عند الاستلام",
  title: "تم تسجيل طلبك",
  lead:
    "فريق فيلورا راح يتصل فيك الحين أو في أقرب وقت، عشان نتأكد من العنوان والكمية. المكالمة قصيرة — نرجوك تردّين.",
  callWindow: "عادةً نتصل خلال 15–45 دقيقة (أوقات الدوام)",
  trustLine:
    "أغلب الطلبات تُؤكَّد في نفس اليوم بعد المكالمة، والتوصيل داخل الإمارات خلال 2–4 أيام عمل.",
  answerTitle: "خلّي جوّالك قريب منك",
  answerBullets: [
    "ردّي على الأرقام اللي ما تعرفينها — غالباً يكون فريق فيلورا.",
    "تأكّدي إن رقم الجوال اللي تحت صحيح (واتساب).",
    "إذا ما ردّيتِ، نعيد الاتصال أو نرسل لك رسالة.",
  ],
  phoneLabel: "رقم الجوال للتأكيد",
  steps: [
    { id: "placed", label: "تسجيل الطلب", detail: "تم الآن" },
    { id: "call", label: "مكالمة التأكيد", detail: "الخطوة الحالية — مركز الاتصال" },
    { id: "pack", label: "تجهيز الطلب", detail: "بعد ما نؤكد معك بالهاتف" },
    { id: "ship", label: "التوصيل", detail: "2–4 أيام عمل — داخل الإمارات" },
  ],
  activeStepBadge: "الحين",
  paymentReminder: `الدفع عند الاستلام — كاش أو بطاقة مع المندوب. رسوم التوصيل +${codFee} ${currencyLabel} داخلة في المجموع.`,
  patience:
    "شكراً على صبرك — تأكيدك بالهاتف يساعدنا نوصل طلبك أسرع وبدون أخطاء في العنوان.",
  homeCta: "الصفحة الرئيسية",
  productCta: "العودة للمنتج",
} as const;
