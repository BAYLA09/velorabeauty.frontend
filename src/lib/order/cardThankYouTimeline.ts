/** Card thank-you timeline — paid orders skip phone confirmation. */

export type CardTimelineStepId = "placed" | "paid" | "prepare" | "deliver";

export type CardTimelineStepState = "done" | "active" | "upcoming";

export type CardTimelineStep = {
  id: CardTimelineStepId;
  state: CardTimelineStepState;
};

const PREP_STATUSES = new Set(["awaiting_payment", "confirmed", "preparing", "packed", "processing"]);
const SHIP_STATUSES = new Set(["shipped", "out_for_delivery", "delivered"]);

export function cardTimelineSteps(orderStatus: string | null | undefined): CardTimelineStep[] {
  const status = (orderStatus ?? "awaiting_payment").toLowerCase();
  const ids: CardTimelineStepId[] = ["placed", "paid", "prepare", "deliver"];

  let activeIndex = 1;
  if (status === "paid") activeIndex = 2;
  else if (PREP_STATUSES.has(status) && status !== "awaiting_payment") activeIndex = 2;
  else if (SHIP_STATUSES.has(status)) activeIndex = 3;
  else if (status === "awaiting_payment" || status === "pending") activeIndex = 1;

  return ids.map((id, index) => {
    if (index === 0) return { id, state: "done" as const };
    let state: CardTimelineStepState = "upcoming";
    if (index < activeIndex) state = "done";
    else if (index === activeIndex) state = "active";
    return { id, state };
  });
}
