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
      storySrc: "/images/products/pdp/hair-story.png?v=20260923-0131",
      upsellSlotSrc: {
        1: "/images/products/pdp/upsell/hair-qty-1.png?v=20260923-1523",
        2: "/images/products/pdp/upsell/hair-qty-2.png?v=20260923-1526",
        3: "/images/products/pdp/upsell/hair-qty-3.png?v=20260923-1528",
      },
      placeholder: "[صورة صفحة المنتج — علكات الشعر]",
      marketingGallery: [undefined, undefined, undefined],
    },
    skin: {
      src: "/images/products/pdp/skin-main.png?v=20260923-0110",
      storySrc: "/images/products/pdp/skin-story.png?v=20260923-0126",
      upsellSlotSrc: {
        1: "/images/products/pdp/upsell/skin-qty-1.png?v=20260923-1500",
        2: "/images/products/pdp/upsell/skin-qty-2.png?v=20260923-1510",
        3: "/images/products/pdp/upsell/skin-qty-3.png?v=20260923-1513",
      },
      placeholder: "[صورة صفحة المنتج — علكات البشرة]",
      marketingGallery: [undefined, undefined, undefined],
    },
    eye: {
      src: "/images/products/pdp/eye-main.png",
      storySrc: "/images/products/pdp/eye-story.png?v=20260923-0111",
      upsellSlotSrc: {
        1: "/images/products/pdp/upsell/eye-qty-1.png?v=20260923-1535",
        2: "/images/products/pdp/upsell/eye-qty-2.png?v=20260923-1539",
        3: "/images/products/pdp/upsell/eye-qty-3.png?v=20260923-1542",
      },
      placeholder: "[صورة صفحة المنتج — سيروم العين]",
      marketingGallery: [undefined, undefined, undefined],
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
