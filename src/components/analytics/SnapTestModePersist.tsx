"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  SNAP_TEST_CID_KEY,
  SNAP_TEST_MODE_ID_KEY,
} from "@/lib/analytics/snapTestMode";

/** Keep ScTestModeId / ScCid on the URL during App Router client navigations (Snap test session). */
export function SnapTestModePersist() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(searchParams.toString());
      let tid = params.get("ScTestModeId");
      let cid = params.get("ScCid");
      if (tid) sessionStorage.setItem(SNAP_TEST_MODE_ID_KEY, tid);
      if (cid) sessionStorage.setItem(SNAP_TEST_CID_KEY, cid);

      if (!tid) tid = sessionStorage.getItem(SNAP_TEST_MODE_ID_KEY);
      if (!cid) cid = sessionStorage.getItem(SNAP_TEST_CID_KEY);
      if (!tid || !cid) return;

      if (params.get("ScTestModeId") === tid && params.get("ScCid") === cid) return;

      params.set("ScTestModeId", tid);
      params.set("ScCid", cid);
      const qs = params.toString();
      const next = `${pathname}${qs ? `?${qs}` : ""}`;
      window.history.replaceState(window.history.state, "", next);
    } catch {
      /* ignore */
    }
  }, [pathname, searchParams]);

  return null;
}
