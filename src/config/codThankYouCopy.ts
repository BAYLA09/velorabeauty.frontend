import { codFee, currencyLabel } from "@/config/pricing";
import { brand } from "@/config/brand";

/** COD thank-you — Khaleeji; layout matches premium COD mockup (Velora colors). */
export const codThankYouCopy = {
  hero: {
    title: "تم استلام طلبك ✅ — انتظري اتصالنا",
    lead: "فريق فيلورا بيتصل فيك خلال 24 ساعة لتأكيد الطلب — الرجاء الرد على الرقم.",
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
      deliver: { label: "التوصيل للمنزل", sub: "2–4 أيام · الدفع عند الاستلام" },
    },
  },
  quickTrust: [
    { id: "time", label: "التوصيل المتوقع", value: "2–4 أيام عمل", badge: "كل الإمارات" },
    { id: "cod", label: "الدفع", value: "عند الاستلام" },
    { id: "check", label: "استلام آمن", value: "راجعي الطرد قبل الدفع" },
    { id: "quality", label: "ثقة فيلورا", value: "منتجات مختارة بعناية" },
  ],
  reachable: {
    title: "خلّي جوالك قريب!",
    body: "بنتصل فيك خلال 24 ساعة لتأكيد العنوان والكمية — أضيفي رقمنا لجهات الاتصال وخلّي الجوال قريب.",
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
    title: "تفاصيل طلبك",
    promise:
      "بعد مكالمة التأكيد، يوصلك الطلب خلال 2–4 أيام داخل الإمارات — جهّزي المبلغ أدناه للمندوب.",
    prepareCash: "احتفظي بالمبلغ جاهز عند الاستلام:",
    deliveryNote: "التوصيل لباب المنزل · الدفع عند الاستلام",
    subtotal: "المجموع الفرعي",
    shipping: "رسوم التوصيل",
    totalCod: "المبلغ عند الاستلام",
    offer: "العرض",
    singleQty: "قطعة واحدة",
  },
  footer: {
    help: "تحتاجين مساعدة؟ فريقنا موجود لك.",
    whatsapp: "تواصل واتساب",
    whatsappMissing: "تواصلي معنا من قسم «تواصل معنا» في الموقع أو انتظري مكالمة التأكيد.",
    homeCta: "الصفحة الرئيسية",
  },
  faq: [
    {
      q: "كيف الدفع عند الاستلام؟",
      a: `تدفعين للمندوب كاش أو بطاقة (+${codFee} ${currencyLabel} توصيل في المجموع).`,
    },
    {
      q: "متى يوصل الطلب؟",
      a: "بعد التأكيد بالهاتف، التوصيل لباب بيتك خلال يومين عمل في كل الإمارات.",
    },
  ],
} as const;

export function codWhatsAppConfirmMessage(orderRef: string, customerFirstName: string): string {
  return `السلام عليكم، أبغى أأكد طلب COD في ${brand.nameEn}.\nمرجع: ${orderRef}\nالاسم: ${customerFirstName}\nشكراً.`;
}

export function codWhatsAppSupportMessage(orderRef: string): string {
  return `السلام عليكم، عندي استفسار عن طلب ${orderRef}.`;
}
