import { codFee, currencyLabel, formatPrice } from "@/config/pricing";
import { brand } from "@/config/brand";

/** COD thank-you — Khaleeji; layout matches premium COD mockup (Velora colors). */
export const codThankYouCopy = {
  hero: {
    title: "أبشر! تم تسجيل طلبك بنجاح",
    lead: "يعطيك العافية على ثقتك فينا — مندوبنا بيتواصل معك قريب لتأكيد التفاصيل.",
  },
  meta: {
    orderNumber: "رقم الطلب",
    orderDate: "تاريخ الطلب",
  },
  timeline: {
    heading: "طلبك في 4 خطوات",
    steps: {
      placed: { label: "تسجيل الطلب", sub: "تم التسجيل" },
      confirm: { label: "مكالمة التأكيد", sub: "فريقنا يتصل فيك" },
      prepare: { label: "تجهيز الطلب", sub: "بعد التأكيد" },
      deliver: { label: "التوصيل للمنزل", sub: "الدفع عند الاستلام" },
    },
  },
  quickTrust: [
    { id: "time", label: "التوصيل المتوقع", value: "2–4 أيام عمل", badge: "داخل الإمارات" },
    { id: "cod", label: "الدفع", value: "عند الاستلام" },
    { id: "check", label: "استلام آمن", value: "راجعي الطرد قبل الدفع" },
    { id: "quality", label: "ثقة فيلورا", value: "منتجات مختارة بعناية" },
  ],
  reachable: {
    title: "خلّي جوالك قريب!",
    body: "بنتصل فيك خلال الساعات الجاية (15–45 دقيقة في أوقات الدوام) لتأكيد العنوان والكمية.",
    phoneLabel: "رقم التواصل",
    whatsappCta: "أكّد عبر واتساب",
    whatsappHint: "رسالة جاهزة — التأكيد النهائي من فريقنا بعد الرد.",
  },
  values: {
    title: "يعطيك العافية على ثقتك!",
    subtitle: "أنتِ الآن جزء من عائلة فيلورا",
    items: [
      { label: "جودة مختارة", sub: "مكونات مدروسة" },
      { label: "توصيل سريع", sub: brand.country },
      { label: "خدمة عملاء", sub: "حنا بخدمتك" },
      { label: "عناية حقيقية", sub: brand.tagline },
    ],
  },
  summary: {
    toggle: "تفاصيل الطلب والمبلغ",
    subtotal: "المجموع الفرعي",
    shipping: "رسوم التوصيل",
    totalCod: "المبلغ عند الاستلام",
    offer: "العرض",
  },
  footer: {
    help: "تحتاجين مساعدة؟ فريقنا موجود لك.",
    whatsapp: "تواصل واتساب",
    whatsappMissing: "فعّلي NEXT_PUBLIC_SUPPORT_WHATSAPP في إعدادات المتجر.",
    homeCta: "الصفحة الرئيسية",
  },
  faq: [
    {
      q: "كيف الدفع عند الاستلام؟",
      a: `تدفعين للمندوب كاش أو بطاقة (+${codFee} ${currencyLabel} توصيل في المجموع).`,
    },
    {
      q: "متى يوصل الطلب؟",
      a: "بعد التأكيد بالهاتف، التجهيز والتوصيل عادة 2–4 أيام عمل داخل الإمارات.",
    },
  ],
} as const;

export function codWhatsAppConfirmMessage(orderRef: string, customerFirstName: string): string {
  return `السلام عليكم، أبغى أأكد طلب COD في ${brand.nameEn}.\nمرجع: ${orderRef}\nالاسم: ${customerFirstName}\nشكراً.`;
}

export function codWhatsAppSupportMessage(orderRef: string): string {
  return `السلام عليكم، عندي استفسار عن طلب ${orderRef}.`;
}
