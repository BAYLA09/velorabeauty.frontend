/**
 * فيديوهات عميلات — MP4 تحت `public/videos/stories/skin-gummies/` (أو مسار public آخر).
 */
export type ProductVideoStory = {
  id: string;
  name: string;
  city?: string;
  videoSrc?: string;
  posterSrc?: string;
};

const SKIN_VIDEO = "/videos/stories/skin-gummies";
const SKIN_LEGACY_49239 =
  "/images/products/magnific_animate-the-provided-starting-image-into-a-realist_kling_1080p_9-16_24fps_49239.mp4";
const SKIN_VIDEO_31067 = `${SKIN_VIDEO}/magnific_animate-into-a-5second-photorealistic-lifestyle-cl_kling_720p_9-16_24fps_31067.mp4`;

/** علكات البشرة — 4 بطاقات */
const skinGummiesVideoStories: ProductVideoStory[] = [
  {
    id: "skin-v1",
    name: "شيماء",
    city: "دبي",
    videoSrc: SKIN_LEGACY_49239,
  },
  {
    id: "skin-v2",
    name: "نورة",
    city: "أبوظبي",
    videoSrc: SKIN_VIDEO_31067,
  },
  { id: "skin-v3", name: "مريم", city: "الشارقة" },
  { id: "skin-v4", name: "لطيفة", city: "الرياض" },
];

const defaultStories: ProductVideoStory[] = [
  { id: "story-1", name: "شيماء", city: "دبي" },
  { id: "story-2", name: "نورة", city: "أبوظبي" },
  { id: "story-3", name: "مريم", city: "الشارقة" },
  { id: "story-4", name: "لطيفة", city: "الرياض" },
  { id: "story-5", name: "هند", city: "الكويت" },
];

const videoOverridesByProductSlug: Record<
  string,
  Partial<Record<ProductVideoStory["id"], Pick<ProductVideoStory, "videoSrc" | "posterSrc">>>
> = {};

export function getProductVideoStories(productSlug: string): ProductVideoStory[] {
  if (productSlug === "skin-gummies") {
    return skinGummiesVideoStories.map((story) => ({ ...story }));
  }

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
