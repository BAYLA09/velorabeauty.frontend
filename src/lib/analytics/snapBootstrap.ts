import { getSnapPixelId } from "@/config/snapPixel";

/** Official Snap base code + init + first PAGE_VIEW (runs before React hydrates). */
export function buildSnapPixelBootstrapScript(pixelId: string): string {
  const safeId = JSON.stringify(pixelId);
  return `
(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){
a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})
(window,document,'https://sc-static.net/scevent.min.js');
snaptr('init',${safeId});
snaptr('track','PAGE_VIEW');
`.trim();
}

export function snapPixelBootstrapScriptForApp(): string | null {
  const pixelId = getSnapPixelId();
  if (!pixelId) return null;
  return buildSnapPixelBootstrapScript(pixelId);
}
