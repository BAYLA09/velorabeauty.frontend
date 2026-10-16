import { getSnapPixelId } from "@/config/snapPixel";

const SCEVENT_SRC = "https://sc-static.net/scevent.min.js";

/** Snap Business Help — official web pixel base code (loader only). */
export function buildSnapPixelLoaderScript(): string {
  const sdk = JSON.stringify(SCEVENT_SRC);
  return `
(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){
a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})
(window,document,${sdk});
`.trim();
}

export function buildSnapPixelInitScript(pixelId: string): string {
  const safeId = JSON.stringify(pixelId);
  return `
snaptr('init',${safeId});
snaptr('track','PAGE_VIEW');
`.trim();
}

export function snapPixelBootstrapScriptForApp(): string | null {
  const pixelId = getSnapPixelId();
  if (!pixelId) return null;
  return `${buildSnapPixelLoaderScript()}\n${buildSnapPixelInitScript(pixelId)}`;
}
