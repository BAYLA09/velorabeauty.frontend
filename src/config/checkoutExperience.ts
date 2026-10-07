import { codFee, currencyLabel } from "./pricing";

export const checkoutExperience = {
  card: {
    eyebrow: "VELORA BEAUTY · UAE",
    title: "إتمام الطلب — الدفع بالبطاقة",
    lead: "تجربة دفع أنيقة وآمنة. شحن مجاني لجميع الإمارات — بدون رسوم إضافية.",
    heroBadge: "دفع آمن · 256-bit",
    perks: [
      "شحن مجاني خلال ٢–٤ أيام عمل",
      "تأكيد سريع عبر الهاتف قبل الإرسال",
      "رابط دفع آمن بعد التأكيد",
    ],
    submit: "تأكيد الطلب — الدفع بالبطاقة",
    accent: "gold" as const,
  },
  cod: {
    eyebrow: "VELORA BEAUTY · UAE",
    title: "إتمام الطلب — الدفع عند الاستلام",
    lead: `ادفعي عند استلام طلبك — كاش أو بطاقة للمندوب. رسوم التوصيل +${codFee} ${currencyLabel} تُضاف للمجموع.`,
    heroBadge: `+${codFee} ${currencyLabel} رسوم التوصيل`,
    perks: [
      "لا حاجة للدفع مسبقاً",
      "مندوب فيلورا يتصل قبل التوصيل",
      "كاش أو بطاقة عند الباب",
    ],
    submit: "تأكيد الطلب — الدفع عند الاستلام",
    accent: "burgundy" as const,
  },
  hub: {
    title: "اختاري طريقة الدفع",
    lead: "صفحة مخصّصة لكل خيار — تصميم فيلورا الفاخر، وأسعار واضحة قبل التأكيد.",
  },
  fields: {
    name: "الاسم الكامل",
    phone: "رقم الهاتف (واتساب)",
    emirate: "الإمارة",
    address: "العنوان التفصيلي",
  },
  trustLine: "بياناتك محمية — نستخدمها فقط لتأكيد طلبك وتوصيله.",
} as const;
