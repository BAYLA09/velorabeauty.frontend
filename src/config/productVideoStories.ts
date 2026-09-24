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

export const productVideoStoriesSection = {
  eyebrow: "تجارب من الخليج",
  title: "يسمعون من عميلاتنا",
  /** نفس القائمة على كل صفحات المنتجات — عدّلي الأسماء أو أضيفي slots */
  stories: [
    { id: "story-1", name: "شيماء", city: "دبي" },
    { id: "story-2", name: "نورة", city: "أبوظبي" },
    { id: "story-3", name: "مريم", city: "الشارقة" },
    { id: "story-4", name: "لطيفة", city: "الرياض" },
    { id: "story-5", name: "هند", city: "الكويت" },
  ] satisfies ProductVideoStory[],
} as const;
