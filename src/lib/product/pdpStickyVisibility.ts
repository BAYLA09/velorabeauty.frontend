/** Whether the PDP sticky bar should show (top buy box scrolled out of view). */
export function shouldShowPdpStickyBar(buyBoxVisible: boolean): boolean {
  return !buyBoxVisible;
}
