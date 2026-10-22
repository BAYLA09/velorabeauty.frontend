/** Arabic copy for cart drawer (site language). */
export const cartDrawerCopy = {
  title: "سلتك",
  empty: "سلتك فارغة",
  emptyHint: "اختاري منتجاً للبدء، أو أضيفي من التوصيات أدناه بضغطة واحدة.",
  add: "أضيفي",
  remove: "حذف",
  upsellSection: "قد يعجبك أيضاً",
  upsellAlsoLike: "قد يعجبك أيضاً",
  upsellPriceFrom: (price: string) => `من ${price}`,
  bundleComplete: (price: string) =>
    `عرض 3 منتجات مكتمل — ${price} · أضيفي رابعاً بـ 199 د.إ أو أكملي الدفع.`,
  cartFull: (price: string) => `4 منتجات — ${price} · جاهزة للدفع.`,
  subtotal: (n: number) => `مجموع المنتجات (${n})`,
  total: "المجموع",
  shipping: "التوصيل",
  shippingHint: (card: string, cod: string) =>
    `يُحدَّد عند الدفع — ${card} بالبطاقة · ${cod} COD`,
  bundleNote: "السعر حسب عدد المنتجات في السلة (يمكن خلط الشعر، البشرة، والعين).",
  checkout: "إتمام الطلب",
  maxProducts: "الحد 4 منتجات — احذفي منتجاً للمتابعة.",
  invalid: "سلة غير صالحة.",
  close: "إغلاق السلة",
  closeBtn: "إغلاق",
  productCount: (n: number) => (n === 1 ? "منتج واحد" : `${n} منتجات`),
  none: "لا منتجات",
  lineTotal: "سعر هذا المنتج في السلة",
} as const;
