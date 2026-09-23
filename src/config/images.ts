export const images = {
  hero: {
    src: "/images/hero/0d992921-89dc-4309-bfeb-4feb78ba2834.png",
    background: "/images/hero/hero-background.webp",
    placeholder: "[ضع صورة الحملة الرئيسية هنا]",
  },
  /** الصفحة الرئيسية — صور حقيقية */
  products: {
    hair: {
      src: "/images/products/hair-gummies.png",
      placeholder: "[ضع صورة المنتج هنا]",
    },
    skin: {
      src: "/images/products/skin-gummies.png",
      placeholder: "[ضع صورة المنتج هنا]",
    },
    eye: {
      src: "/images/products/eye-serum.png",
      placeholder: "[ضع صورة السيروم هنا]",
    },
    bundle: {
      src: "/images/products/bundle.png",
      placeholder: "[ضع صورة المجموعة هنا]",
    },
  },
  /** صفحات المنتج (PDP) — placeholders حتى تزيدي صور مخصّصة */
  productPage: {
    hair: {
      src: "/images/products/pdp/hair-main.png",
      placeholder: "[صورة صفحة المنتج — علكات الشعر]",
    },
    skin: {
      src: "/images/products/pdp/skin-main.png?v=20260923-0110",
      placeholder: "[صورة صفحة المنتج — علكات البشرة]",
    },
    eye: {
      src: "/images/products/pdp/eye-main.png",
      placeholder: "[صورة صفحة المنتج — سيروم العين]",
    },
  },
  testimonials: {
    customer01: {
      src: "/images/testimonials/customer-01.webp",
      placeholder: "[صورة العميلة هنا]",
    },
    customer02: {
      src: "/images/testimonials/customer-02.webp",
      placeholder: "[صورة العميلة هنا]",
    },
  },
} as const;
