/** Arabic copy for cart drawer (site language). */
export const cartDrawerCopy = {
  title: "سلتك",
  empty: "سلتك فارغة",
  pricingHint:
    "نفس المنتج: 199 / 249 / 339 من صفحة المنتج · منتج مختلف يُضاف +199 د.إ (مثال: 2 شعر + 1 بشرة = 448).",
  add: "أضيفي",
  remove: "حذف",
  upsellSection: "🔥 قبل الدفع — كمّلي روتينك",
  upsellBadge: "ضغطة واحدة",
  upsellHint: "تبقين في السلة · ما تعيديش اختيار الكمية · أضيفي وكمّلي.",
  upsellFootnote: (current: string) =>
    `المجموع الحالي ${current} — الأسعار كما هي (+199 لكل منتج مختلف).`,
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
