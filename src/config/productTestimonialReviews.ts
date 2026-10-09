import type { ProductId } from "./products";
import type { TestimonialReview } from "./testimonials";

/**
 * تقييمات حسب المنتج — عدّلي النصوص أو أضيفي تقييمات حقيقية (published: true).
 */
export const productTestimonialReviews: Record<ProductId, TestimonialReview[]> = {
  hair: [
    {
      id: "hair-r1",
      published: true,
      quote:
        "كنت أؤجل العناية لأن يومي مزدحم. علكتان في الصباح — وصار الروتين جزءاً مني، وأحس بثقة أكبر تجاه شعري.",
      name: "نورة",
      city: "دبي",
      age: 34,
      rating: 5,
      productLabel: "روتين الشعر",
    },
    {
      id: "hair-r2",
      published: true,
      quote:
        "ما أحب الزيوت ولا ساعات أمام المرآة. هنا خطوة واحدة واضحة — والاستمرار صار أسهل مما توقعت.",
      name: "مريم",
      city: "الشارقة",
      age: 29,
      rating: 5,
    },
    {
      id: "hair-r3",
      published: true,
      quote:
        "أهم شيء عندي الوضوح: أعرف ماذا آخذ ومتى. فيلورا أعطتني روتيناً بسيطاً ألتزم به من دون إحساس بالتعب.",
      name: "لطيفة",
      city: "أبوظبي",
      age: 41,
      rating: 5,
    },
  ],
  skin: [
    {
      id: "skin-r1",
      published: true,
      quote:
        "بشرتي كانت تبدو مرهقة مع الشغل والتكييف. الروتين اليومي صار طقساً قصيراً — وأحس ببشرتي أكثر راحة.",
      name: "شيماء",
      city: "دبي",
      age: 28,
      rating: 5,
      productLabel: "روتين البشرة",
    },
    {
      id: "skin-r2",
      published: true,
      quote:
        "الشمس والتكييف يجهدان بشرتي. علكتان يومياً — أخف من أي روتين طويل، وأنا ألتزم بها فعلاً.",
      name: "هند",
      city: "أبوظبي",
      age: 36,
      rating: 5,
    },
    {
      id: "skin-r3",
      published: true,
      quote:
        "كنت أغطي التعب بالمكياج. اليوم أعتني من الداخل بخطوة بسيطة — وأحس أني أكرّم وجهي لا أخفيه.",
      name: "ريم",
      city: "العين",
      age: 31,
      rating: 5,
    },
  ],
  eye: [
    {
      id: "eye-r1",
      published: true,
      quote:
        "السهر والشاشات تظهر حول عيني. السيروم خطوة واحدة قبل النوم — وأحس بمحيط العين أكثر راحة.",
      name: "فاطمة",
      city: "دبي",
      age: 33,
      rating: 5,
      productLabel: "محيط العين",
    },
    {
      id: "eye-r2",
      published: true,
      quote:
        "ما أحب أبدو مرهقة في الاجتماعات. دقيقة مع السيروم — وإحساس بالعناية حتى في الأيام المزدحمة.",
      name: "عائشة",
      city: "أبوظبي",
      age: 39,
      rating: 5,
    },
    {
      id: "eye-r3",
      published: true,
      quote:
        "سهر وشاشات — ومحيط العين يحتاج لطفاً. خطوة واحدة، بلطف، والاستمرار أسهل من أي كريم ثقيل.",
      name: "دانة",
      city: "الشارقة",
      age: 27,
      rating: 5,
    },
  ],
};

export function publishedProductTestimonials(productId: ProductId): TestimonialReview[] {
  return productTestimonialReviews[productId].filter((r) => r.published);
}
