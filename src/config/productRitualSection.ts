import type { ProductId } from "./products";

export type ProductRitualData = {
  id: ProductId;
  index: string;
  categoryLabel: string;
  problem: string;
  problemCopy: string;
  solutionLabel: string;
  productName: string;
  ingredient: string;
  priceLabel: string;
};

export const productRitualByProductId: Record<ProductId, ProductRitualData> = {
  hair: {
    id: "hair",
    index: "01 — الشعر",
    categoryLabel: "الشعر",
    problem: "تساقط الشعر وضعف مظهره",
    problemCopy:
      "عندما تلاحظين المزيد من الشعر على المشط أو أثناء الاستحمام، تصبح العناية اليومية أكثر أهمية.",
    solutionLabel: "خطوة من طقس فيلورا",
    productName: "علكات صحة ونمو الشعر",
    ingredient: "بالبيوتين",
    priceLabel: "199 د.إ",
  },
  skin: {
    id: "skin",
    index: "02 — البشرة",
    categoryLabel: "البشرة",
    problem: "بشرة باهتة تفتقد الإشراقة",
    problemCopy:
      "الإرهاق والعوامل اليومية قد تجعل البشرة تبدو أقل نضارة وحيوية.",
    solutionLabel: "خطوة من طقس فيلورا",
    productName: "علكات إشراقة ونضارة البشرة",
    ingredient: "بالغلوتاثيون",
    priceLabel: "199 د.إ",
  },
  eye: {
    id: "eye",
    index: "03 — محيط العين",
    categoryLabel: "محيط العين",
    problem: "مظهر متعب حول العينين",
    problemCopy:
      "الهالات ومظهر الإرهاق حول العينين قد يجعلان الوجه يبدو أكثر تعباً.",
    solutionLabel: "خطوة من طقس فيلورا",
    productName: "سيروم العناية بمحيط العين",
    ingredient: "بفيتامين E",
    priceLabel: "199 د.إ",
  },
};

export const ritualCta = {
  title: "اكتشفي طقوس VELORA BEAUTY",
  subtitle: "روتين متكامل بثلاث عنايات: شعر، بشرة، ومحيط العين.",
  button: "اكتشفي المجموعة",
  href: "/#bundle",
} as const;
