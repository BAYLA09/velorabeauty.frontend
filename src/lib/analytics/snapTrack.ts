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

/** Minimal queue stub until scevent.min.js loads (safe for early funnel events). */
export function ensureSnaptrQueue(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.snaptr === "function") return true;
  const queue: unknown[][] = [];
  const stub = ((...args: unknown[]) => {
    queue.push(args);
  }) as NonNullable<Window["snaptr"]>;
  stub.queue = queue;
  window.snaptr = stub;
  return true;
}

export { isSnapPixelConfigured };

/** Returns true if the call was passed to snaptr (or its queue). */
export function snapTrack(event: string, params?: Record<string, unknown>): boolean {
  if (typeof window === "undefined" || !isSnapPixelConfigured()) return false;
  try {
    ensureSnaptrQueue();
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
