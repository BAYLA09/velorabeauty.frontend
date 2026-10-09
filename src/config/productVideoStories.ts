/**
 * فيديوهات عميلات — ارفعي MP4 على GitHub ثم عبّي المسارات (واختياري posterSrc).
 *
 * علكات البشرة (4 فيديوهات):
 *   public/videos/stories/skin-gummies/01-shaima-dubai.mp4
 *   public/videos/stories/skin-gummies/02-noura-abudhabi.mp4
 *   public/videos/stories/skin-gummies/03-mariam-sharjah.mp4
 *   public/videos/stories/skin-gummies/04-latifah-riyadh.mp4
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

const SKIN_GUMMIES_VIDEO_DIR = "/videos/stories/skin-gummies";

/** أربع بطاقات فيديو — صفحة skin-gummies فقط */
const skinGummiesVideoStories: ProductVideoStory[] = [
  {
    id: "skin-v1",
    name: "شيماء",
    city: "دبي",
    videoSrc: `${SKIN_GUMMIES_VIDEO_DIR}/01-shaima-dubai.mp4`,
  },
  {
    id: "skin-v2",
    name: "نورة",
    city: "أبوظبي",
    videoSrc: `${SKIN_GUMMIES_VIDEO_DIR}/02-noura-abudhabi.mp4`,
  },
  {
    id: "skin-v3",
    name: "مريم",
    city: "الشارقة",
    videoSrc: `${SKIN_GUMMIES_VIDEO_DIR}/03-mariam-sharjah.mp4`,
  },
  {
    id: "skin-v4",
    name: "لطيفة",
    city: "الرياض",
    videoSrc: `${SKIN_GUMMIES_VIDEO_DIR}/04-latifah-riyadh.mp4`,
  },
];

const defaultStories: ProductVideoStory[] = [
  { id: "story-1", name: "شيماء", city: "دبي" },
  { id: "story-2", name: "نورة", city: "أبوظبي" },
  { id: "story-3", name: "مريم", city: "الشارقة" },
  { id: "story-4", name: "لطيفة", city: "الرياض" },
  { id: "story-5", name: "هند", city: "الكويت" },
];

/** فيديوهات خاصة بمنتجات أخرى — slot واحد في كل مرة */
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
