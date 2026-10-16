#!/usr/bin/env node
/**
 * Production Snap funnel probe (Playwright). Requires: npm install --no-save playwright && npx playwright install chromium
 * Usage: node scripts/snap-funnel-probe.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { randomUUID } from "node:crypto";

const PIXEL = "628f12d8-df4e-4272-889a-4806255011cd";
const BASE = process.argv[2] || "https://www.velorabeauty.world";

function parseTracks(postBodies) {
  const out = [];
  for (const body of postBodies) {
    const j = JSON.parse(body);
    for (const r of j.req || []) {
      if (r.t?.ev) {
        out.push({
          ev: r.t.ev,
          pid: r.t.pid,
          price: r.t.e_pr,
          currency: r.t.e_cur,
          item_ids: r.t.e_iids,
          number_items: r.t.e_ni,
          ctxUrl: j.ctx?.url,
          ctxTest: j.ctx?.t,
        });
      }
    }
  }
  return out;
}

function piiScan(text) {
  const issues = [];
  if (/@[\w.-]+\.\w{2,}/.test(text)) issues.push("email-like");
  if (/\b05\d{8}\b/.test(text)) issues.push("uae-phone");
  if (/\b\+971\d+/.test(text)) issues.push("intl-phone");
  return issues;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function runFunnel(startUrl) {
  const postBodies = [];
  const milestones = [];
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on("request", (req) => {
    if (req.url() === "https://tr.snapchat.com/p" && req.method() === "POST") {
      const data = req.postData();
      if (data) postBodies.push(data);
    }
  });

  const snapshot = (name) => {
    milestones.push({ name, tracks: parseTracks(postBodies) });
  };

  await page.goto(startUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2500);
  snapshot("home");

  await page.getByRole("link", { name: /علكات الشعر/ }).first().click();
  await page.waitForURL(/\/products\/hair-gummies/, { timeout: 30000 });
  await page.waitForTimeout(2500);
  snapshot("product");

  await page.getByRole("button", { name: /أضيفي للسلة/ }).click();
  await page.waitForTimeout(2000);
  snapshot("add_to_cart");

  if (!(await page.getByRole("link", { name: "إتمام الطلب" }).isVisible().catch(() => false))) {
    await page.getByRole("button", { name: /السلة/ }).first().click();
    await page.waitForTimeout(800);
  }
  await page.getByRole("link", { name: "إتمام الطلب" }).click();
  await page.waitForURL(/\/checkout/, { timeout: 30000 });
  await page.waitForTimeout(2500);
  snapshot("checkout");

  await browser.close();
  return { postBodies, milestones, tracks: parseTracks(postBodies) };
}

async function compareTestModeSnippet() {
  const cid = randomUUID();
  const qs = `ScTestModeId=${PIXEL}&ScCid=${cid}`;
  const veloraUrl = `${BASE}/?${qs}`;
  const bare = `<!DOCTYPE html><html><head><script>
(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');
snaptr('init','${PIXEL}');snaptr('track','PAGE_VIEW');
</script></head><body>x</body></html>`;
  const bareUrl = `data:text/html,${encodeURIComponent(bare)}?${qs}`;

  async function firstPageView(url) {
    const bodies = [];
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.on("request", (req) => {
      if (req.url() === "https://tr.snapchat.com/p" && req.method() === "POST") {
        const d = req.postData();
        if (d) bodies.push(JSON.parse(d));
      }
    });
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(3000);
    await browser.close();
    return bodies.find((b) => b.req?.some((r) => r.t?.ev === "PAGE_VIEW")) || bodies[0];
  }

  const veloraPv = await firstPageView(veloraUrl);
  const barePv = await firstPageView(bareUrl);
  return {
    velora: { ctxT: veloraPv?.ctx?.t, urlHasTest: String(veloraPv?.ctx?.url || "").includes("ScTestModeId") },
    bare: { ctxT: barePv?.ctx?.t, urlHasTest: String(barePv?.ctx?.url || "").includes("ScTestModeId") },
    trackKeysVelora: Object.keys(veloraPv?.req?.[0]?.t || {}),
    trackKeysBare: Object.keys(barePv?.req?.[0]?.t || {}),
  };
}

const cid = randomUUID();
const funnel = await runFunnel(`${BASE}/?ScTestModeId=${PIXEL}&ScCid=${cid}`);
const testMode = await compareTestModeSnippet();

const pii = piiScan(funnel.postBodies.join(""));
assert(pii.length === 0, `PII detected in Snap payloads: ${pii.join(", ")}`);

const pvByMilestone = funnel.milestones.map((m, i) => {
  const prev = i > 0 ? funnel.milestones[i - 1].tracks.filter((t) => t.ev === "PAGE_VIEW").length : 0;
  const cur = m.tracks.filter((t) => t.ev === "PAGE_VIEW").length;
  return { milestone: m.name, newPageViews: cur - prev };
});
for (const row of pvByMilestone) {
  if (row.milestone === "add_to_cart") assert(row.newPageViews === 0, "ADD_CART should not add PAGE_VIEW");
  else assert(row.newPageViews === 1, `${row.milestone}: expected 1 new PAGE_VIEW, got ${row.newPageViews}`);
}

const view = funnel.tracks.find((t) => t.ev === "VIEW_CONTENT");
const add = funnel.tracks.find((t) => t.ev === "ADD_CART");
const start = funnel.tracks.find((t) => t.ev === "START_CHECKOUT");

assert(view?.pid === PIXEL, "VIEW_CONTENT pid");
assert(view?.price === 199 && view?.currency === "AED" && view?.item_ids?.[0] === "hair-gummies" && view?.number_items === 1, "VIEW_CONTENT commerce");

assert(add?.price === 398 && add?.currency === "AED" && add?.item_ids?.[0] === "hair-gummies" && add?.number_items === 2, "ADD_CART commerce (2×199)");

assert(start?.price === 249 && start?.currency === "AED" && start?.item_ids?.[0] === "hair-gummies" && start?.number_items === 2, "START_CHECKOUT bundle total for 2 units");

assert(testMode.velora.ctxT === true && testMode.bare.ctxT === true, "Snap test mode ctx.t should be true with ScTestModeId/ScCid");
assert(testMode.velora.urlHasTest && testMode.bare.urlHasTest, "ctx.url should retain test query params");

const table = [
  { step: "Home (load)", event: "PAGE_VIEW", price: "—", currency: "—", item_ids: "—", qty: "—" },
  {
    step: "Product /hair-gummies (client nav)",
    event: "PAGE_VIEW + VIEW_CONTENT",
    price: view?.price,
    currency: view?.currency,
    item_ids: view?.item_ids?.join(","),
    qty: view?.number_items,
  },
  {
    step: "Add to cart (2 default)",
    event: "ADD_CART",
    price: add?.price,
    currency: add?.currency,
    item_ids: add?.item_ids?.join(","),
    qty: add?.number_items,
  },
  {
    step: "Checkout (client nav via cart)",
    event: "START_CHECKOUT + PAGE_VIEW",
    price: start?.price,
    currency: start?.currency,
    item_ids: start?.item_ids?.join(","),
    qty: start?.number_items,
  },
];

console.log(JSON.stringify({ ok: true, pixel: PIXEL, testMode, table, pageViewsPerNav: pvByMilestone }, null, 2));
