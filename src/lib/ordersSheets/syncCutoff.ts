import {
  isOrderEligibleForInboundStatusUpdate,
  readInboundStatusCutoffIso,
} from "@/lib/inboundStatusCutoff";

/** @deprecated Use readInboundStatusCutoffIso */
export function readOrdersSheetsSyncCutoffIso(): string {
  return readInboundStatusCutoffIso();
}

/** @deprecated Use isOrderEligibleForInboundStatusUpdate */
export function isOrderEligibleForSheetSync(createdAtIso: string, cutoffIso: string): boolean {
  return isOrderEligibleForInboundStatusUpdate(createdAtIso, cutoffIso);
}

/** @deprecated Sheet inbound sync removed */
export function isSheetRowEligibleForSync(rowOrderDateIso: string | null, cutoffIso: string): boolean {
  if (!rowOrderDateIso) return false;
  return isOrderEligibleForInboundStatusUpdate(rowOrderDateIso, cutoffIso);
}
