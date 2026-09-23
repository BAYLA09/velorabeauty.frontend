import { uaeDeliveryCities } from "@/config/productPageShared";

export const productCheckoutCopy = {
  sectionTitle: "إتمام طلبك",
  sectionLead: "خطوة أخيرة — نؤكد معكِ التفاصيل بكل وضوح.",
  formTitle: "بيانات التوصيل",
  fields: {
    name: "الاسم الكامل",
    phone: "رقم الهاتف (واتساب)",
    emirate: "الإمارة",
    address: "العنوان / المنطقة / معلم قريب",
  },
  submitHint:
    "بالضغط على «إتمام الطلب» أنتِ توافقين على التواصل لتأكيد الطلب — بدون التزام حتى التأكيد النهائي.",
  cardNextStep:
    "بعد التأكيد، نرسل لك رابط دفع آمن بالبطاقة (شحن مجاني).",
  codNextStep:
    "ندفع عند الاستلام — كاش أو بطاقة للمندوب (+20 د.إ رسوم التوصيل).",
} as const;

export const checkoutEmirates = uaeDeliveryCities;
