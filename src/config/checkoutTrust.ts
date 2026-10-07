/** Trust bullets shown under order summary on card checkout (Lara-style). */
export const checkoutTrust = {
  title: "لماذا فيلورا؟",
  items: [
    "منتج أصلي 100%",
    "شحن سريع داخل الإمارات",
    "دفع آمن عبر Stripe",
    "دعم عملاء على مدار الساعة",
  ],
} as const;

export const checkoutPaymentCopy = {
  secureStripe: "معالجة الدفع عبر Stripe بشكل آمن",
  noCardStorage: "لا نحفظ بيانات بطاقتك على الموقع",
  payRedirectHint: "بعد التأكيد، نرسل لك رابط الدفع الآمن لإكمال العملية",
} as const;
