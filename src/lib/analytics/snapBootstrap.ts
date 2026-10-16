import { getSnapPixelId } from "@/config/snapPixel";

const SCEVENT_SRC = "https://sc-static.net/scevent.min.js";

/** Always inject scevent.min.js — an orphan snaptr stub must not block the real SDK. */
export function buildSnapPixelLoaderScript(): string {
  const sdk = JSON.stringify(SCEVENT_SRC);
  return `
(function(e,t,n){
  if(!e.snaptr){
    var a=e.snaptr=function(){
      a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments);
    };
    a.queue=[];
  }
  var loaded=t.querySelector('script[data-velora-snap="1"]');
  if(!loaded){
    var s='script',r=t.createElement(s);
    r.async=true;r.src=n;r.setAttribute('data-velora-snap','1');
    var u=t.getElementsByTagName(s)[0];
    u.parentNode.insertBefore(r,u);
  }
})(window,document,${sdk});
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
