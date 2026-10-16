"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isSnapPixelConfigured } from "@/config/snapPixel";
import { snapPageView } from "@/lib/analytics/snapTrack";

function SnapPageViewOnNavigate() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    snapPageView();
  }, [pathname]);

  return null;
}

/** App Router client navigations — bootstrap runs from root layout (beforeInteractive). */
export function SnapPixelRoot() {
  if (!isSnapPixelConfigured()) return null;
  return <SnapPageViewOnNavigate />;
}
