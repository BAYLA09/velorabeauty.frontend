import { codFee, currencyLabel } from "@/config/pricing";

/** Post-checkout COD — optimized for answer-rate & delivery confirmation (MENA COD funnel). */
export const codThankYouCopy = {
  eyebrow: "VELORA BEAUTY · طلب COD",
  title: "تم — طلبك مسجّل بنجاح",
  lead:
    "فريق مركز الاتصال في فيلورا غادي يتصل بك دابا أو فـأقرب وقت باش يأكّد العنوان وكمية الطلب. هاد المكالمة قصيرة — من فضلك جاوبي.",
  callWindow: "متوسط وقت الاتصال: 15–45 دقيقة (ساعات العمل)",
  answerTitle: "مهم: خلّي هاتفك قريب",
  answerBullets: [
    "جاوبي على الأرقام غير المحفوظة — غالباً يكون فريق فيلورا.",
    "تأكدي أن الرقم أعلاه صحيح (واتساب).",
    "إذا فاتتك المكالمة، نعاودو الاتصال أو نرسلو رسالة.",
  ],
  stats: [
    { value: "+90%", label: "طلبات نؤكّدها بنفس اليوم بعد المكالمة" },
    { value: "+90%", label: "عمليات توصيل ناجحة بعد التأكيد" },
  ],
  steps: [
    { id: "placed", label: "تسجيل الطلب", detail: "تم الآن" },
    { id: "call", label: "مكالمة التأكيد", detail: "قريباً — مركز الاتصال" },
    { id: "pack", label: "تجهيز الشحنة", detail: "بعد التأكيد بالهاتف" },
    { id: "ship", label: "التوصيل", detail: "2–4 أيام عمل — الإمارات" },
  ],
  paymentReminder: `الدفع عند الاستلام — كاش أو بطاقة للمندوب. رسوم التوصيل +${codFee} ${currencyLabel} مشمولة في المجموع.`,
  patience:
    "شكراً على صبرك — كل عميلة تؤكّد بالهاتف تساعدنا نوصل الطلب أسرع وتفادي أي خطأ في العنوان.",
  homeCta: "الصفحة الرئيسية",
  productCta: "العودة للمنتج",
} as const;
