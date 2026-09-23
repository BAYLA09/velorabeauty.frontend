import type { ProductId } from "./products";

/** شريط المشكلة تحت صورة القصة (Nama-style) + نسبة مئوية وخط بصري */
export type ProductProblemOverlay = {
  /** رقم أو نسبة كبيرة في المربع الذهبي — مثل 68% */
  statValue: string;
  /** 0–100 لعرض خط النسبة */
  statPercent: number;
  headline: string;
  subline: string;
  statSource?: string;
};

export const productProblemOverlayById: Record<ProductId, ProductProblemOverlay> = {
  hair: {
    statValue: "72%",
    statPercent: 72,
    headline:
      "نسبة كبيرة من النساء في الخليج يلاحظن زيادة التساقط أو ضعف مظهر الشعر مع الحرارة والتكييف",
    subline: "العناية اليومية المناسبة تساعد على دعم مظهر الشعر أثناء الإيقاع السريع للحياة.",
    statSource: "وفق استطلاعات روتين العناية بالشعر — الإمارات ومنطقة الخليج",
  },
  skin: {
    statValue: "68%",
    statPercent: 68,
    headline:
      "أغلبية النساء في المنطقة يشعرن أن بشرتهن تبدو أقل إشراقاً بسبب الشمس والجفاف وقلة النوم",
    subline: "خطوة بسيطة في الروتين قد تدعم مظهراً أكثر حيوية دون تعقيد.",
    statSource: "وفق استطلاعات عادات العناية بالبشرة — الإمارات ومنطقة الخليج",
  },
  eye: {
    statValue: "65%",
    statPercent: 65,
    headline:
      "نسبة مهمة من النساء تعانين من مظهر متعب أو هالات حول العينين بسبب الشاشات والسهر",
    subline: "عناية مركّزة حول العين تكمل روتينك وتدعم مظهراً أكثر انتعاشاً.",
    statSource: "وفق استطلاعات روتين العناية بالعين — الإمارات ومنطقة الخليج",
  },
};
