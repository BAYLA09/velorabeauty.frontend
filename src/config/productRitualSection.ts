import type { ProductId } from "./products";

/** نص شريط المشكلة (Nama-style) — بدون أرقام إحصائية أو مصادر وهمية */
export type ProductProblemOverlay = {
  badge: string;
  headline: string;
  subline: string;
};

export const productProblemOverlayById: Record<ProductId, ProductProblemOverlay> = {
  hair: {
    badge: "01",
    headline: "تساقط الشعر وضعف مظهره — حين يزداد الشعر على المشط أو في الاستحمام",
    subline: "الحرارة، التكييف، وإيقاع اليومي قد يؤثران على مظهر الشعر — العناية اليومية تصبح أهم.",
  },
  skin: {
    badge: "02",
    headline: "بشرة باهتة تفتقد الإشراقة — الإرهاق والعوامل اليومية تظهر على الوجه",
    subline: "الشمس، الجفاف، وقلة النوم قد تجعل البشرة تبدو أقل حيوية — خطوة بسيطة تلائم يومك.",
  },
  eye: {
    badge: "03",
    headline: "مظهر متعب حول العينين — الهالات والإجهاد يظهران قبل أن تشعرين بالتعب",
    subline: "الشاشات والسهر المتكرر قد يبرزان محيط العين — عناية مركّزة تكمل روتينك.",
  },
};
