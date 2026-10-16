import { brand } from "@/config/brand";
import { formatPrice } from "@/config/pricing";

/** Card (Stripe) payment success — premium post-purchase (Velora). */
export const cardThankYouCopy = {
  hero: {
    title: "تم الدفع بنجاح",
    lead: "استلمنا طلبك ودفعك — نجهّز الشحنة ونرسل لك التحديثات على رقمك.",
  },
  paidBadge: "مدفوع · بطاقة آمنة",
  meta: {
    orderNumber: "رقم الطلب",
    orderDate: "تاريخ الطلب",
  },
  timeline: {
    heading: "طلبك في 4 خطوات",
    steps: {
      placed: { label: "تسجيل الطلب", sub: "تم التسجيل" },
      paid: { label: "تأكيد الدفع", sub: "Stripe · مؤكّد" },
      prepare: { label: "تجهيز الشحنة", sub: "1–2 يوم عمل" },
      deliver: { label: "التوصيل", sub: "كل الإمارات · مجاني" },
    },
  },
  quickTrust: [
    { id: "paid", label: "المبلغ", value: "مخصوم من بطاقتك" },
    { id: "ship", label: "الشحن", value: "مجاني", badge: "بطاقة" },
    { id: "secure", label: "دفع آمن", value: "Stripe مشفّر" },
    { id: "delivery", label: "التوصيل", value: "1–3 أيام عمل", badge: brand.country },
  ],
  receipt: {
    charged: (totalAed: number) => `تم خصم ${formatPrice(totalAed)} من بطاقتك بنجاح.`,
    copyRef: "نسخ رقم الطلب",
    copied: "تم النسخ",
  },
  summary: {
    title: "ملخص الطلب",
    promise:
      "لا حاجة لمكالمة تأكيد — طلبك في قائمة التجهيز. رسالة SMS أو واتساب عند الشحن إن وُجد رقمك.",
    deliveryLabel: "التوصيل",
    deliveryFree: "مجاني",
    totalLabel: "الإجمالي المدفوع",
  },
  status: {
    paid: "تم تأكيد الدفع — طلبك قيد التجهيز في المستودع.",
    pending: "جاري تأكيد الدفع من البنك… الصفحة تتحدّث تلقائياً خلال ثوانٍ.",
  },
  values: {
    title: "شكراً لثقتك في فيلورا",
    subtitle: "نتمنى لكِ تجربة عناية تليق بك",
  },
  actions: {
    home: "الصفحة الرئيسية",
    shop: "متابعة التسوق",
  },
  footer: {
    help: "استفسار عن الطلب؟ فريقنا جاهز لمساعدتك.",
    whatsapp: "تواصل واتساب",
    whatsappMissing: "راجعي بريدك أو انتظري رسالة الشحن على رقمك.",
    homeCta: "الصفحة الرئيسية",
  },
} as const;

export function cardWhatsAppSupportMessage(orderRef: string): string {
  return `السلام عليكم، عندي استفسار عن طلب مدفوع بالبطاقة في ${brand.nameEn}.\nمرجع: ${orderRef}\nشكراً.`;
}
