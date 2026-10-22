/** Total Snapchat spend from manual CPA × purchase count (store orders in range). */
export function computeSnapchatAdSpendUsd(
  snapCpaUsd: number,
  purchaseCount: number,
): number {
  const cpa = Math.max(0, snapCpaUsd);
  const n = Math.max(0, purchaseCount);
  return cpa * n;
}
