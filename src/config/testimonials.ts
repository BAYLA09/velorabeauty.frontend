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
  rating?: 1 | 2 | 3 | 4 | 5;
  imageSrc?: string;
  productLabel?: string;
};

export const testimonialsSection = {
  title: "تجارب حقيقية",
  subtitle: "تُعرض هنا عند توفرها — بلا آراء وهمية.",
  emptyTitle: "صوتكِ يهمّنا",
  emptyBody: "حين تشاركين تجربتكِ، ستجدينها هنا — بكل شفافية.",
  items: [] as TestimonialReview[],
};

export function publishedTestimonials(): TestimonialReview[] {
  return testimonialsSection.items.filter((item) => item.published);
}
