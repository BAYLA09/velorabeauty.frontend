import type { ProductId } from "./products";

/** Caption éditoriale sous la photo — sans statistiques inventées */
export type ProductProblemOverlay = {
  kicker: string;
  headline: string;
  subline: string;
};

export const productProblemOverlayById: Record<ProductId, ProductProblemOverlay> = {
  hair: {
    kicker: "لحظة لكِ",
    headline: "شعركِ يستحق أن يكون جزءاً من روتينكِ — لا مهمة أخيرة.",
    subline: "خطوة صغيرة كل يوم. إحساس أهدأ بكثير.",
  },
  skin: {
    kicker: "لحظة لكِ",
    headline: "بشرتكِ تستحق أن تُروى بعناية — لا باستعجال.",
    subline: "روتين بسيط. لمسة تختارينها لنفسكِ.",
  },
  eye: {
    kicker: "تفاصيل",
    headline: "محيط العين يحكي تعب اليوم — ويستحق لطفاً.",
    subline: "عناية مركّزة. جزء هادئ من يومكِ.",
  },
};
