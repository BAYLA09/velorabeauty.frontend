import type { ProductId } from "./products";

/** شريط السياق تحت صورة القصة + نسبة مئوية وخط بصري */
export type ProductProblemOverlay = {
  statValue: string;
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
      "كثير من النساء في الخليج يلاحظن تأثير الحرارة والتكييف على مظهر الشعر في الروتين اليومي",
    subline: "خطوة بسيطة من الداخل قد تدعم مظهراً أكثر حيوية — بلا تعقيد.",
    statSource: "استطلاعات عادات العناية — الإمارات ومنطقة الخليج",
  },
  skin: {
    statValue: "68%",
    statPercent: 68,
    headline:
      "الشمس والجفاف وقلة النوم من أكثر ما يؤثر على إحساس النساء بإشراق البشرة",
    subline: "روتين خفيف قد يدعم مظهراً أكثر انتعاشاً — دون عشر خطوات.",
    statSource: "استطلاعات عادات العناية — الإمارات ومنطقة الخليج",
  },
  eye: {
    statValue: "65%",
    statPercent: 65,
    headline:
      "الشاشات والسهر من أكثر ما يؤثر على إحساس التعب حول محيط العين",
    subline: "عناية مركّزة تكمل روتينك — دقيقة واحدة، بلطف.",
    statSource: "استطلاعات عادات العناية — الإمارات ومنطقة الخليج",
  },
};
