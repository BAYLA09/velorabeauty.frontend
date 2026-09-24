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
  /** الصفحة الرئيسية — عينة من كل عناية */
  items: [
    {
      id: "home-hair",
      published: true,
      quote: "التساقط هدأ — وبدأت أحس بشعري يرجع قوته.",
      name: "نورة",
      city: "دبي",
      age: 34,
      rating: 5,
      productLabel: "الشعر",
    },
    {
      id: "home-skin",
      published: true,
      quote: "بشرتي رجعت تبان حية — إشراق من الداخل.",
      name: "شيماء",
      city: "أبوظبي",
      age: 28,
      rating: 5,
      productLabel: "البشرة",
    },
    {
      id: "home-eye",
      published: true,
      quote: "الهالات خفت — عيني ما عادت تحكي تعب.",
      name: "فاطمة",
      city: "الشارقة",
      age: 33,
      rating: 5,
      productLabel: "محيط العين",
    },
  ] as TestimonialReview[],
};

export function publishedTestimonials(): TestimonialReview[] {
  return testimonialsSection.items.filter((item) => item.published);
}
