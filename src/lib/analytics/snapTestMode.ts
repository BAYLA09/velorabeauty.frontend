export const SNAP_TEST_MODE_ID_KEY = "velora_ScTestModeId";
export const SNAP_TEST_CID_KEY = "velora_ScCid";

/**
 * Runs before pixel bootstrap — capture ScTestModeId/ScCid and keep them on every URL
 * (including Next.js client navigations) so Snap Test Events can attribute the session.
 */
export function buildSnapTestModeCaptureScript(): string {
  const tidKey = SNAP_TEST_MODE_ID_KEY;
  const cidKey = SNAP_TEST_CID_KEY;
  return `
(function(){
  var TID_KEY = ${JSON.stringify(tidKey)};
  var CID_KEY = ${JSON.stringify(cidKey)};
  function readFromUrl(){
    var p = new URLSearchParams(location.search);
    return { tid: p.get('ScTestModeId'), cid: p.get('ScCid') };
  }
  function persist(tid, cid){
    try {
      if (tid) sessionStorage.setItem(TID_KEY, tid);
      if (cid) sessionStorage.setItem(CID_KEY, cid);
    } catch (e) {}
  }
  function stored(){
    try {
      return {
        tid: sessionStorage.getItem(TID_KEY),
        cid: sessionStorage.getItem(CID_KEY)
      };
    } catch (e) { return { tid: null, cid: null }; }
  }
  function mergeSnapTestParams(url){
    try {
      var st = stored();
      var tid = st.tid;
      var cid = st.cid;
      if (!tid || !cid) return url;
      var u = new URL(url, location.origin);
      if (!u.searchParams.get('ScTestModeId')) u.searchParams.set('ScTestModeId', tid);
      if (!u.searchParams.get('ScCid')) u.searchParams.set('ScCid', cid);
      return u.pathname + u.search + u.hash;
    } catch (e) {
      return url;
    }
  }
  function ensureCurrentUrlHasTestParams(){
    var fromUrl = readFromUrl();
    persist(fromUrl.tid, fromUrl.cid);
    var st = stored();
    if (!st.tid || !st.cid) return;
    var p = new URLSearchParams(location.search);
    if (p.get('ScTestModeId') === st.tid && p.get('ScCid') === st.cid) return;
    p.set('ScTestModeId', st.tid);
    p.set('ScCid', st.cid);
    var qs = p.toString();
    history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  }
  var boot = readFromUrl();
  persist(boot.tid, boot.cid);
  ensureCurrentUrlHasTestParams();
  var _push = history.pushState;
  var _replace = history.replaceState;
  history.pushState = function(state, title, url){
    var next = typeof url === 'string' ? mergeSnapTestParams(url) : url;
    var ret = _push.call(this, state, title, next);
    ensureCurrentUrlHasTestParams();
    return ret;
  };
  history.replaceState = function(state, title, url){
    var next = typeof url === 'string' ? mergeSnapTestParams(url) : url;
    var ret = _replace.call(this, state, title, next);
    ensureCurrentUrlHasTestParams();
    return ret;
  };
})();
`.trim();
}
