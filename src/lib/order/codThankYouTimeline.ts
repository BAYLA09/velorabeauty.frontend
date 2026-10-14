/** COD thank-you timeline — driven by real order status only. */

export type CodTimelineStepId = "placed" | "confirm" | "prepare" | "deliver";

export type CodTimelineStepState = "done" | "active" | "upcoming";

export type CodTimelineStep = {
  id: CodTimelineStepId;
  state: CodTimelineStepState;
};

const COD_PREP_STATUSES = new Set(["confirmed", "preparing", "packed", "processing"]);
const COD_SHIP_STATUSES = new Set(["shipped", "out_for_delivery", "delivered"]);

/**
 * Maps DB status to the active step index (0–3).
 * COD orders start as `pending` → only "confirm" is active until ops updates status.
 */
export function codTimelineSteps(orderStatus: string | null | undefined): CodTimelineStep[] {
  const status = (orderStatus ?? "pending").toLowerCase();
  let activeIndex = 1;

  if (status === "pending") activeIndex = 1;
  else if (COD_PREP_STATUSES.has(status)) activeIndex = 2;
  else if (COD_SHIP_STATUSES.has(status)) activeIndex = 3;
  else if (status === "cancelled") activeIndex = 1;
  else activeIndex = 1;

  const ids: CodTimelineStepId[] = ["placed", "confirm", "prepare", "deliver"];

  return ids.map((id, index) => {
    let state: CodTimelineStepState = "upcoming";
    if (index < activeIndex) state = "done";
    else if (index === activeIndex) state = "active";
    else state = "upcoming";
    if (index === 0) state = "done";
    return { id, state };
  });
}
