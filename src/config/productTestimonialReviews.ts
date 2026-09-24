import type { ProductId } from "./products";
import type { TestimonialReview } from "./testimonials";

/**
 * تقييمات حسب المنتج — كل مجموعة تتكلم عن «المشكلة» اللي العناية تستهدفها.
 * عدّلي النصوص أو أضيفي تقييمات حقيقية لاحقاً (published: true).
 */
export const productTestimonialReviews: Record<ProductId, TestimonialReview[]> = {
  hair: [
    {
      id: "hair-r1",
      published: true,
      quote:
        "كنت ألتفت في المرآة وأحس شعري يضعف — مع الروتين حسّيت التساقط هدأ، وشعري صار يستحق أن أعتني فيه.",
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
        "ما كنت أبغى زيوت ولا ساعة قدام المرآة. علكتين — وبدأت أحس بشعري أقوى وأهدأ من جوّا.",
      name: "مريم",
      city: "الشارقة",
      age: 29,
      rating: 5,
    },
    {
      id: "hair-r3",
      published: true,
      quote:
        "أهم شي عندي: التساقط وقف يزعجني كل صباح. اليوم أحس إني أرجّع لشعري قوته — خطوة بخطوة.",
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
        "بشرتي كانت باهتة وما أحب المرآة. بعد أسابيع من الروتين، حسّيتها أنعم — كأنها تتنفس من جديد.",
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
        "الشمس والتكييف يخليني أحس بشرتي «تعبانة». الحين الإشراق رجع — مو مكياج، إحساس من الداخل.",
      name: "هند",
      city: "أبوظبي",
      age: 36,
      rating: 5,
    },
    {
      id: "skin-r3",
      published: true,
      quote:
        "كنت أغطي البقع بالكونسيلر كل يوم. اليوم بشرتي أهدأ — أحس إني ما أخبي وجهي، أعتني فيه.",
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
        "الهالات كانت أول شي أشوفه — تعب طول اليوم. السيروم خلّى محيط عيني أهدأ، والسواد خفّ واضح.",
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
        "ما أحب أبدو مرهقة قدام الناس. بعد الروتين، عيني صارت تبان أرتاح — حتى بدون concealer.",
      name: "عائشة",
      city: "أبوظبي",
      age: 39,
      rating: 5,
    },
    {
      id: "eye-r3",
      published: true,
      quote:
        "سهر وشاشات — والهالات ما تسامحني. خطوة واحدة قبل النوم، والفرق حول عيني حسّيته من أول أسبوعين.",
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
