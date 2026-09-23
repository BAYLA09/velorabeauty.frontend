import type { ProductId } from "./products";

export type RitualCardConfig = {
  id: ProductId;
  index: string;
  categoryLabel: string;
  problem: string;
  problemCopy: string;
};

export const productRitualSection = {
  eyebrow: "من التحدّي إلى الطقس",
  headline:
    "حين يبدأ شعرك بفقدان حيويته، وتبدو بشرتك مرهقة، ويظهر التعب حول عينيك…",
  intro:
    "إيقاع الحياة اليومية — من الشاشات إلى المناخ — قد يؤثر على مظهر الشعر والبشرة ومحيط العين. صمّمت فيلورا بيوتي طقوساً بثلاث خطوات واضحة: عناية بالشعر، إشراقة البشرة، وتركيز حول العين — في تجربة واحدة أنيقة تناسب أسلوبك في الإمارات.",
  cards: [
    {
      id: "hair",
      index: "01",
      categoryLabel: "الشعر",
      problem: "تساقط الشعر وضعف مظهره",
      problemCopy:
        "عندما تلاحظين المزيد من الشعر على المشط أو أثناء الاستحمام، تصبح العناية اليومية أكثر أهمية.",
    },
    {
      id: "skin",
      index: "02",
      categoryLabel: "البشرة",
      problem: "بشرة باهتة تفتقد الإشراقة",
      problemCopy:
        "الإرهاق والعوامل اليومية قد تجعل البشرة تبدو أقل نضارة وحيوية.",
    },
    {
      id: "eye",
      index: "03",
      categoryLabel: "محيط العين",
      problem: "مظهر متعب حول العينين",
      problemCopy:
        "الهالات ومظهر الإرهاق حول العينين قد يجعلان الوجه يبدو أكثر تعباً.",
    },
  ] satisfies RitualCardConfig[],
  ctaTitle: "اكتشفي طقوس VELORA BEAUTY",
  ctaButton: "اكتشفي المجموعة",
  ctaHref: "/#bundle",
} as const;
