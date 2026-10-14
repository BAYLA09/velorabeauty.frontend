/** Arabic copy for cart drawer (site language). */
export const cartDrawerCopy = {
  title: "سلتك",
  empty: "سلتك فارغة",
  pricingHint:
    "199 وحدة · 249 (منتجان مختلفان أو علبتان نفس المنتج) · 339 · الرابع +199.",
  add: "أضيفي",
  remove: "حذف",
  upsellSection: "أكملي روتين VELORA",
  upsellHint: "منتج مختلف فقط (شعر، بشرة، عين) — نفس المنتج من صفحة المنتج.",
  addPlus: "+ أضيفي",
  saveAmount: (aed: number) => `وفّري ${aed} د.إ`,
  addForDelta: (price: string) => `زيادة بـ ${price} فقط للانتقال للعرض التالي`,
  bundleComplete: (price: string) =>
    `عرض 3 منتجات مكتمل — ${price} · أضيفي رابعاً بـ 199 د.إ أو أكملي الدفع.`,
  cartFull: (price: string) => `4 منتجات — ${price} · جاهزة للدفع.`,
  subtotal: (n: number) => `مجموع المنتجات (${n})`,
  shipping: "التوصيل",
  shippingHint: (card: string, cod: string) =>
    `يُحدَّد عند الدفع — ${card} بالبطاقة · ${cod} COD`,
  bundleNote: "السعر حسب عدد المنتجات في السلة (يمكن خلط الشعر، البشرة، والعين).",
  checkout: "إتمام الطلب",
  maxProducts: "الحد 4 منتجات — احذفي منتجاً للمتابعة.",
  invalid: "سلة غير صالحة.",
  close: "إغلاق السلة",
  closeBtn: "إغلاق",
  afterAddTotal: (price: string) => `المجموع بعد الإضافة: ${price}`,
  productCount: (n: number) => (n === 1 ? "منتج واحد" : `${n} منتجات`),
  none: "لا منتجات",
} as const;
