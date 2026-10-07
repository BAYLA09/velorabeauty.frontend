export const images = {
  hero: {
    src: "/images/hero/hero-campaign.webp?v=20261007",
    background: "/images/hero/hero-background.webp?v=20261007",
    placeholder: "[ضع صورة الحملة الرئيسية هنا]",
  },
  /** الصفحة الرئيسية — صور حقيقية */
  products: {
    hair: {
      src: "/images/products/hair-gummies.webp?v=20261007",
      placeholder: "[ضع صورة المنتج هنا]",
    },
    skin: {
      src: "/images/products/skin-gummies.webp?v=20261007",
      placeholder: "[ضع صورة المنتج هنا]",
    },
    eye: {
      src: "/images/products/eye-serum.webp?v=20261007",
      placeholder: "[ضع صورة السيروم هنا]",
    },
    bundle: {
      src: "/images/products/bundle.webp?v=20261007",
      placeholder: "[ضع صورة المجموعة هنا]",
    },
  },
  /** صفحات المنتج (PDP) — placeholders حتى تزيدي صور مخصّصة
   * formulaSectionImageSrc: صورة تحت قسم التركيبة
   * timelineSectionImageSrc: صورة تحت «وش راح تشوفين مع الاستمرار»
   */
  productPage: {
    hair: {
      src: "/images/products/pdp/hair-main.webp?v=20261007",
      storySrc: "/images/products/pdp/hair-story.webp?v=20261007",
      upsellSlotSrc: {
        1: "/images/products/pdp/upsell/hair-qty-1.webp?v=20261007",
        2: "/images/products/pdp/upsell/hair-qty-2.webp?v=20261007",
        3: "/images/products/pdp/upsell/hair-qty-3.webp?v=20261007",
      },
      placeholder: "[صورة صفحة المنتج — علكات الشعر]",
      marketingSpotlight: undefined as string | undefined,
      formulaSectionImageSrc: "/images/products/pdp/hair-formula-slot.webp?v=20261007",
      timelineSectionImageSrc: "/images/products/pdp/hair-timeline-slot.webp?v=20261007",
    },
    skin: {
      src: "/images/products/pdp/skin-main.webp?v=20261007",
      storySrc: "/images/products/pdp/skin-story.webp?v=20261007",
      upsellSlotSrc: {
        1: "/images/products/pdp/upsell/skin-qty-1.webp?v=20261007",
        2: "/images/products/pdp/upsell/skin-qty-2.webp?v=20261007",
        3: "/images/products/pdp/upsell/skin-qty-3.webp?v=20261007",
      },
      placeholder: "[صورة صفحة المنتج — علكات البشرة]",
      marketingSpotlight: undefined as string | undefined,
      formulaSectionImageSrc: "/images/products/pdp/skin-formula-slot.webp?v=20261007",
      timelineSectionImageSrc: "/images/products/pdp/skin-timeline-slot.webp?v=20261007",
    },
    eye: {
      src: "/images/products/pdp/eye-main.webp?v=20261007",
      storySrc: "/images/products/pdp/eye-story.webp?v=20261007",
      upsellSlotSrc: {
        1: "/images/products/pdp/upsell/eye-qty-1.webp?v=20261007",
        2: "/images/products/pdp/upsell/eye-qty-2.webp?v=20261007",
        3: "/images/products/pdp/upsell/eye-qty-3.webp?v=20261007",
      },
      placeholder: "[صورة صفحة المنتج — سيروم العين]",
      marketingSpotlight: undefined as string | undefined,
      formulaSectionImageSrc: "/images/products/pdp/eye-formula-slot.webp?v=20261007",
      timelineSectionImageSrc: "/images/products/pdp/eye-timeline-slot.webp?v=20261007",
    },
  },
  testimonials: {
    customer01: {
      src: "/images/testimonials/customer-01.webp?v=20261007",
      placeholder: "[صورة العميلة هنا]",
    },
    customer02: {
      src: "/images/testimonials/customer-02.webp?v=20261007",
      placeholder: "[صورة العميلة هنا]",
    },
  },
} as const;
