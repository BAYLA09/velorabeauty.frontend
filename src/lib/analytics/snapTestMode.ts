import { VELORA_SNAP_PIXEL_ID } from "@/config/snapPixel";

export const SNAP_TEST_MODE_ID_KEY = "velora_ScTestModeId";
export const SNAP_TEST_CID_KEY = "velora_ScCid";

/** Runs before pixel bootstrap — persist Snap test URL params for SPA navigations. */
export function buildSnapTestModeCaptureScript(): string {
  const canonical = JSON.stringify(VELORA_SNAP_PIXEL_ID);
  return `
(function(){
  try {
    var p = new URLSearchParams(location.search);
    var tid = p.get('ScTestModeId');
    var cid = p.get('ScCid');
    var canonical = ${canonical};
    if (tid && tid === canonical) sessionStorage.setItem('${SNAP_TEST_MODE_ID_KEY}', tid);
    if (cid) sessionStorage.setItem('${SNAP_TEST_CID_KEY}', cid);
  } catch (e) {}
})();
`.trim();
}
