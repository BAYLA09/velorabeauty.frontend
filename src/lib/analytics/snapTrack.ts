import { isSnapPixelConfigured } from "@/config/snapPixel";

declare global {
  interface Window {
    snaptr?: {
      (...args: unknown[]): void;
      queue?: unknown[][];
      handleRequest?: (...args: unknown[]) => void;
    };
  }
}

export { isSnapPixelConfigured };

function snapSdkReady(): boolean {
  if (typeof window === "undefined") return false;
  const snaptr = window.snaptr;
  if (typeof snaptr !== "function") return false;
  if (typeof snaptr.handleRequest === "function") return true;
  return Boolean(
    document.querySelector('script[src*="scevent.min.js"],script[data-velora-snap="1"]'),
  );
}

/** Returns true if the call was passed to snaptr (SDK loaded or official queue). */
export function snapTrack(event: string, params?: Record<string, unknown>): boolean {
  if (typeof window === "undefined" || !isSnapPixelConfigured()) return false;
  if (!snapSdkReady()) return false;
  try {
    const snaptr = window.snaptr;
    if (!snaptr) return false;
    if (params && Object.keys(params).length > 0) {
      snaptr("track", event, params);
    } else {
      snaptr("track", event);
    }
    return true;
  } catch {
    return false;
  }
}

export function snapPageView(): boolean {
  return snapTrack("PAGE_VIEW");
}
