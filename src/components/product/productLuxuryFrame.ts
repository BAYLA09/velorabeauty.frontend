/** Lara-style luxury mat — white border, soft shadow (product photos only). */

export const luxuryImageInnerClass = "block w-full overflow-hidden rounded-[1.2rem] sm:rounded-[1.35rem]";

export function luxuryImageFrameOuterClass(options?: {
  /** Full width in column (PDP stack, gallery) */
  fullWidth?: boolean;
  /** Smaller cards (related products, upsell) */
  compact?: boolean;
}): string {
  if (options?.compact) {
    return [
      "relative overflow-hidden rounded-2xl border-[5px] border-white bg-[#faf8f5] p-0.5",
      "shadow-[0_4px_20px_rgba(44,19,24,0.08)] ring-1 ring-[#2c1318]/[0.05]",
      "sm:rounded-[1.35rem] sm:border-[6px] sm:p-1",
    ].join(" ");
  }

  return [
    "relative overflow-hidden rounded-[1.625rem] border-[7px] border-white bg-[#faf8f5] p-1",
    "shadow-[0_6px_28px_rgba(44,19,24,0.07),0_22px_56px_rgba(44,19,24,0.11)] ring-1 ring-[#2c1318]/[0.06]",
    "sm:rounded-[2rem] sm:border-8 sm:p-1.5",
    options?.fullWidth ? "mx-auto w-full max-w-full" : "mx-auto w-fit max-w-full",
  ].join(" ");
}

export const luxuryImageInnerCompactClass =
  "block w-full overflow-hidden rounded-[1.1rem] sm:rounded-[1.2rem]";
