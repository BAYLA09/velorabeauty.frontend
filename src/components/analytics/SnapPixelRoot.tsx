"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { getSnapPixelId } from "@/config/snapPixel";
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

export function SnapPixelRoot() {
  const pixelId = getSnapPixelId();
  if (!pixelId) return null;

  const safeId = JSON.stringify(pixelId);
  const initSnippet = `
(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){
a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})
(window,document,'https://sc-static.net/scevent.min.js');
snaptr('init',${safeId});
snaptr('track','PAGE_VIEW');
`.trim();

  return (
    <>
      <Script id="snap-pixel" strategy="afterInteractive">
        {initSnippet}
      </Script>
      <SnapPageViewOnNavigate />
    </>
  );
}
