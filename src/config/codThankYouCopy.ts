import { codFee, currencyLabel, formatPrice } from "@/config/pricing";
import { brand } from "@/config/brand";

/** COD thank-you — Khaleeji, premium tone; keep blocks short on mobile. */
export const codThankYouCopy = {
  hero: {
    title: "أبشر! تم تسجيل طلبك بنجاح",
    subtitle: "يعطيك العافية على ثقتك فينا",
    nextStep: "مندوبنا بيتواصل معك لتأكيد تفاصيل الطلب",
    codBadge: "تدفع عند الاستلام، بكل سهولة وأمان",
  },
  meta: {
    orderNumber: "رقم الطلب",
    orderDate: "تاريخ الطلب",
  },
  timeline: {
    heading: "طلبك في 4 خطوات",
    steps: {
      placed: { label: "تم تسجيل الطلب", hint: "تم الآن" },
      confirm: { label: "تأكيد الطلب", hint: "مكالمة أو واتساب" },
      prepare: { label: "تجهيز وشحن", hint: "بعد التأكيد" },
      deliver: {
        label: "التوصيل والدفع",
        hint: `عند الباب · ${formatPrice(codFee)} توصيل مشمول`,
      },
    },
    deliveryNote:
      "بعد ما نؤكد معك، التوصيل المتوقع داخل الإمارات 2–4 أيام عمل (حسب المدينة).",
  },
  trust: [
    { id: "cod", label: "دفع عند الاستلام", sub: "كاش أو بطاقة مع المندوب" },
    { id: "support", label: "خدمة عملاء", sub: "حنا بخدمتك" },
    { id: "uae", label: "توصيل الإمارات", sub: brand.country },
    { id: "check", label: "راجع قبل الدفع", sub: "تأكد من الطلب عند الاستلام" },
  ],
  confirmSection: {
    title: "باقي خطوة بسيطة!",
    body: "خل جوالك قريب عشان نقدر نأكد طلبك ونوصل لك بسرعة.",
    phoneLabel: "رقم التواصل",
    whatsappCta: "أكّد عبر واتساب",
    whatsappHint: "يفتح واتساب برسالة جاهزة — التأكيد النهائي من فريقنا بعد الرد.",
    callWindow: "عادةً نتصل خلال 15–45 دقيقة (أوقات الدوام)",
  },
  beforeDelivery: {
    title: "قبل ما يوصلك طلبك",
    items: [
      "تأكد من رقم الجوال والعنوان.",
      "تابع مكالمة فريق فيلورا أو رسالة واتساب.",
      "جهّز المبلغ عند الباب إذا بتدفع كاش.",
      "تبي تعدّل البيانات؟ تواصل معنا قبل الشحن.",
    ],
  },
  summary: {
    title: "راجع طلبك وتأكد من بيانات التوصيل",
    subtotal: "المجموع الفرعي",
    shipping: "رسوم التوصيل",
    totalCod: "المبلغ عند الاستلام",
    quantity: "الكمية",
    offer: "العرض",
  },
  support: {
    title: "نحن هنا لخدمتك",
    subtitle: "عندك استفسار؟ حنا بخدمتك",
    whatsapp: "تواصل واتساب",
    call: "اتصل بنا",
    whatsappMissing: "أضيفي NEXT_PUBLIC_SUPPORT_WHATSAPP في إعدادات المتجر لتفعيل واتساب.",
    faqTitle: "أسئلة سريعة",
  },
  faq: [
    {
      q: "كيف الدفع عند الاستلام؟",
      a: `تدفع للمندوب كاش أو بطاقة. رسوم التوصيل +${codFee} ${currencyLabel} محسوبة في المجموع.`,
    },
    {
      q: "متى يوصل الطلب؟",
      a: "بعد تأكيد الطلب بالهاتف أو واتساب، التجهيز والتوصيل داخل الإمارات عادة 2–4 أيام عمل.",
    },
    {
      q: "أقدر أعدّل الطلب؟",
      a: "إيه، تواصل معنا قبل ما نجهّز الشحنة — نحاول نعدّل العنوان أو الكمية.",
    },
  ],
  homeCta: "الصفحة الرئيسية",
} as const;

export function codWhatsAppConfirmMessage(orderRef: string, customerFirstName: string): string {
  return `السلام عليكم، أبغى أأكد طلب COD في ${brand.nameEn}.\nمرجع الطلب: ${orderRef}\nالاسم: ${customerFirstName}\nشكراً 🌸`;
}
