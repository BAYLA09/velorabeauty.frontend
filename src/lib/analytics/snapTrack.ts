import { getSnapPixelId } from "@/config/snapPixel";

declare global {
  interface Window {
    snaptr?: (...args: unknown[]) => void;
  }
}

export function isSnapPixelConfigured(): boolean {
  return Boolean(getSnapPixelId());
}

/** Returns true if the call was passed to snaptr (or its queue). */
export function snapTrack(event: string, params?: Record<string, unknown>): boolean {
  if (typeof window === "undefined" || !isSnapPixelConfigured()) return false;
  try {
    if (typeof window.snaptr !== "function") return false;
    if (params && Object.keys(params).length > 0) {
      window.snaptr("track", event, params);
    } else {
      window.snaptr("track", event);
    }
    return true;
  } catch {
    return false;
  }
}

export function snapPageView(): boolean {
  return snapTrack("PAGE_VIEW");
}
