/**
 * فيديوهات عميلات — أضيفي الملفات على GitHub ثم عبّي `videoSrc` (واختياري `posterSrc`).
 *
 * مثال:
 * videoSrc: "/videos/stories/shaima-dubai.mp4",
 * posterSrc: "/videos/stories/shaima-dubai-poster.webp",
 */
export type ProductVideoStory = {
  id: string;
  /** اسم العميلة — يظهر على البطاقة */
  name: string;
  /** مدينة (اختياري) */
  city?: string;
  videoSrc?: string;
  posterSrc?: string;
};

const defaultStories: ProductVideoStory[] = [
  { id: "story-1", name: "شيماء", city: "دبي" },
  { id: "story-2", name: "نورة", city: "أبوظبي" },
  { id: "story-3", name: "مريم", city: "الشارقة" },
  { id: "story-4", name: "لطيفة", city: "الرياض" },
  { id: "story-5", name: "هند", city: "الكويت" },
];

/** فيديوهات خاصة بصفحة منتج — slot واحد في كل مرة */
const videoOverridesByProductSlug: Record<
  string,
  Partial<Record<ProductVideoStory["id"], Pick<ProductVideoStory, "videoSrc" | "posterSrc">>>
> = {
  "skin-gummies": {
    /** أول بطاقة ظاهرة في الشريط (هند) */
    "story-5": {
      videoSrc:
        "/images/products/magnific_animate-the-provided-starting-image-into-a-realist_kling_1080p_9-16_24fps_49239.mp4",
    },
  },
};

export function getProductVideoStories(productSlug: string): ProductVideoStory[] {
  const overrides = videoOverridesByProductSlug[productSlug];
  if (!overrides) {
    return defaultStories.map((story) => ({ ...story }));
  }

  return defaultStories.map((story) => ({
    ...story,
    ...overrides[story.id],
  }));
}

export const productVideoStoriesSection = {
  eyebrow: "من الخليج",
  title: "نسمع من عميلاتنا",
} as const;
