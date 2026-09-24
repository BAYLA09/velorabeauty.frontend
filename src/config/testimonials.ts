/**
 * آراء العميلات — أضيفي تقييمات حقيقية فقط (published: true).
 *
 * مثال:
 * {
 *   id: "review-1",
 *   published: true,
 *   quote: "الروتين بسيط والنتيجة واضحة على شعري.",
 *   name: "سارة",
 *   city: "دبي",
 *   rating: 5,
 *   imageSrc: "/images/testimonials/customer-01.webp",
 *   productLabel: "علكات الشعر",
 * }
 */
export type TestimonialReview = {
  id: string;
  published: boolean;
  quote: string;
  name: string;
  city: string;
  /** مثل Lara: «دبي • 32 سنة» */
  age?: number;
  rating?: 1 | 2 | 3 | 4 | 5;
  imageSrc?: string;
  productLabel?: string;
};

export const testimonialsSection = {
  title: "آراء عميلاتنا",
  subtitle: "تجارب حقيقية من الإمارات — كل رأي يُعرض بعد اعتماده.",
  emptyTitle: "أول تقييمات Velora قريباً",
  emptyBody:
    "لا نعرض آراءً وهمية. حين تشاركينا تجربتك أو نعتمد تقييمات حقيقية، ستظهر هنا باسمك ومدينتك.",
  items: [
    {
      id: "velora-review-1",
      published: true,
      quote: "طلبت علبتين ووفرت — التوصيل كان خلال يومين.",
      name: "عبدالله",
      city: "أبوظبي",
      age: 45,
      rating: 5,
    },
    {
      id: "velora-review-2",
      published: true,
      quote: "العلكة طعمها حلو — الروتين سهل وما نسيته.",
      name: "سارة",
      city: "دبي",
      age: 32,
      rating: 5,
    },
    {
      id: "velora-review-3",
      published: true,
      quote: "صرت آخذها الصبح — أحس يومي أخف وأنشط بدون قهوة زايدة.",
      name: "فهد",
      city: "أبوظبي",
      age: 38,
      rating: 5,
    },
  ] as TestimonialReview[],
};

export function publishedTestimonials(): TestimonialReview[] {
  return testimonialsSection.items.filter((item) => item.published);
}
