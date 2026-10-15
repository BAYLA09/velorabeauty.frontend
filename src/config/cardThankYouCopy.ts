/** Card (Stripe) payment success — separate from COD thank-you. */
export const cardThankYouCopy = {
  hero: {
    title: "تم الدفع بنجاح",
    subtitle: (name: string) =>
      `${name}، استلمنا طلبك ودفعك عبر البطاقة. نجهّز الشحنة ونرسل لك التحديثات على ${""}`,
  },
  paidBadge: "مدفوع · Stripe",
  summary: {
    title: "ملخص الطلب",
    promise: "شحن مجاني للطلبات المدفوعة بالبطاقة. ستصلك رسالة تأكيد على رقمك عند الشحن.",
    singleQty: "قطعة واحدة",
    deliveryLabel: "التوصيل",
    deliveryFree: "مجاني",
    totalLabel: "الإجمالي",
  },
  status: {
    paid: "تم تأكيد الدفع — طلبك قيد التجهيز.",
    pending: "جاري تأكيد الدفع… إذا استمرت هذه الرسالة، تواصلي مع الدعم.",
  },
  actions: {
    home: "الصفحة الرئيسية",
    shop: "متابعة التسوق",
  },
} as const;
