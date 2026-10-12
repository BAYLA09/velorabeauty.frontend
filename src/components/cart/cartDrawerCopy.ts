/** Arabic copy for cart drawer (site language). */
export const cartDrawerCopy = {
  title: "سلتك",
  empty: "سلتك فارغة",
  pricingHint: "منتج 199 د.إ · منتجان 249 د.إ · 3 منتجات 339 د.إ (مختلط).",
  add: "أضيفي",
  remove: "حذف",
  upsellSection: "أكملي روتين VELORA",
  bundleComplete: (price: string) =>
    `عرض 3 منتجات مكتمل — ${price} · جاهزة للدفع.`,
  subtotal: (n: number) => `مجموع المنتجات (${n})`,
  shipping: "التوصيل",
  shippingHint: (card: string, cod: string) =>
    `يُحدَّد عند الدفع — ${card} بالبطاقة · ${cod} COD`,
  bundleNote: "السعر حسب عدد المنتجات في السلة (يمكن خلط الشعر، البشرة، والعين).",
  checkout: "إتمام الطلب",
  maxProducts: "الحد 3 منتجات — احذفي منتجاً للمتابعة.",
  invalid: "سلة غير صالحة.",
  close: "إغلاق السلة",
  closeBtn: "إغلاق",
  afterAddTotal: (price: string) => `المجموع بعد الإضافة: ${price}`,
  productCount: (n: number) => (n === 1 ? "منتج واحد" : `${n} منتجات`),
  none: "لا منتجات",
} as const;
