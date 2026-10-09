/**
 * فيديوهات عميلات — MP4 تحت `public/videos/stories/{product-slug}/`.
 */
export type ProductVideoStory = {
  id: string;
  name: string;
  city?: string;
  videoSrc?: string;
  posterSrc?: string;
};

const SKIN_VIDEO = "/videos/stories/skin-gummies";
const HAIR_VIDEO = "/videos/stories/hair-gummies";
const EYE_VIDEO = "/videos/stories/eye-serum";
const SKIN_LEGACY_49239 =
  "/images/products/magnific_animate-the-provided-starting-image-into-a-realist_kling_1080p_9-16_24fps_49239.mp4";

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
    videoSrc: `${SKIN_VIDEO}/magnific_animate-into-a-5second-photorealistic-lifestyle-cl_kling_720p_9-16_24fps_31067.mp4`,
  },
  {
    id: "skin-v3",
    name: "مريم",
    city: "الشارقة",
    videoSrc: `${SKIN_VIDEO}/magnific_create-a-56-second-natural-ugc-video-from-the-star_kling_720p_9-16_24fps_31064.mp4`,
  },
  {
    id: "skin-v4",
    name: "هند",
    city: "الكويت",
    videoSrc: `${SKIN_VIDEO}/magnific_animate-this-image-into-a-5second-realistic-smartp_kling_720p_9-16_24fps_31065.mp4`,
  },
];

/** علكات الشعر — 5 فيديوهات */
const hairGummiesVideoStories: ProductVideoStory[] = [
  {
    id: "hair-v1",
    name: "شيماء",
    city: "دبي",
    videoSrc: `${HAIR_VIDEO}/magnific_animate-the-provided-image-into-a-5second-ultrarea_kling_1080p_9-16_24fps_21720.mp4`,
  },
  {
    id: "hair-v2",
    name: "نورة",
    city: "أبوظبي",
    videoSrc: `${HAIR_VIDEO}/magnific_create-a-5second-photorealistic-video-from-the-pro_kling_720p_9-16_24fps_21719.mp4`,
  },
  {
    id: "hair-v3",
    name: "مريم",
    city: "الشارقة",
    videoSrc: `${HAIR_VIDEO}/magnific_create-a-realistic-5second-ugc-video-from-this-ima_kling_720p_9-16_24fps_21717.mp4`,
  },
  {
    id: "hair-v4",
    name: "لطيفة",
    city: "الرياض",
    videoSrc: `${HAIR_VIDEO}/magnific_animate-the-provided-image-into-a-5second-ultrarea_kling_720p_9-16_24fps_21716.mp4`,
  },
  {
    id: "hair-v5",
    name: "هند",
    city: "الكويت",
    videoSrc: `${HAIR_VIDEO}/magnific_animate-this-image-into-a-6second-realistic-lifest_kling_720p_9-16_24fps_21718.mp4`,
  },
];

/** سيروم محيط العين — 4 فيديوهات (بلا هند) */
const eyeSerumVideoStories: ProductVideoStory[] = [
  {
    id: "eye-v1",
    name: "شيماء",
    city: "دبي",
    videoSrc: `${EYE_VIDEO}/magnific_create-a-5second-ultrarealistic-beauty-ugc-video-u_kling_720p_9-16_24fps_21725.mp4`,
  },
  {
    id: "eye-v2",
    name: "نورة",
    city: "أبوظبي",
    videoSrc: `${EYE_VIDEO}/magnific_create-a-5second-ultrarealistic-skincare-video-usi_kling_720p_9-16_24fps_21727.mp4`,
  },
  {
    id: "eye-v3",
    name: "مريم",
    city: "الشارقة",
    videoSrc: `${EYE_VIDEO}/magnific_create-a-5second-ultrarealistic-vertical-916-skinc_kling_720p_9-16_24fps_21728.mp4`,
  },
  {
    id: "eye-v4",
    name: "لطيفة",
    city: "الرياض",
    videoSrc: `${EYE_VIDEO}/magnific_create-a-5second-ultrarealistic-smartphone-video-f_kling_720p_9-16_24fps_21724.mp4`,
  },
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
  if (productSlug === "hair-gummies") {
    return hairGummiesVideoStories.map((story) => ({ ...story }));
  }
  if (productSlug === "eye-serum") {
    return eyeSerumVideoStories.map((story) => ({ ...story }));
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
