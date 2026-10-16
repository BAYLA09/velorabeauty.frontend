import { SNAP_PIXEL_ID } from "@/config/snapPixel";

declare global {
  interface Window {
    snaptr?: (...args: unknown[]) => void;
  }
}

export function isSnapPixelConfigured(): boolean {
  return Boolean(SNAP_PIXEL_ID?.trim());
}

export function snapTrack(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !isSnapPixelConfigured()) return;
  try {
    if (typeof window.snaptr === "function") {
      if (params && Object.keys(params).length > 0) {
        window.snaptr("track", event, params);
      } else {
        window.snaptr("track", event);
      }
    }
  } catch {
    /* ignore */
  }
}

export function snapPageView(): void {
  snapTrack("PAGE_VIEW");
}
