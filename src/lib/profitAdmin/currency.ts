/** UAE dirham is pegged to USD; editable in dashboard state. */
export const DEFAULT_AED_PER_USD = 3.6725;

export function aedToUsd(aed: number, aedPerUsd: number = DEFAULT_AED_PER_USD): number {
  const rate = aedPerUsd > 0 ? aedPerUsd : DEFAULT_AED_PER_USD;
  return aed / rate;
}
