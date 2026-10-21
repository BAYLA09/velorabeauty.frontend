import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { HAIR_GUMMIES_BACKORDER } from "@/config/hairGummiesBackorder";

/** Customer-visible copy must not mention backorder / OOS (dormant strings live only in hairGummiesBackorder.ts). */
const BANNED_PATTERNS: RegExp[] = [
  /نفدت\s*الكمية/,
  /نفاد/,
  /المخزون\s*الجديد\s*واصل/,
  /واصل\s*قريب/,
  /احجزي\s*الحين/,
  /احجزي\s*حبتك/,
  /حجز\s*مسبق/,
  /\bbackorder\b/i,
  /\bsold\s*out\b/i,
  /\bout\s*of\s*stock\b/i,
  /\bpre-?order\b/i,
  /\brestock\b/i,
];

const SCAN_ROOTS = [
  join(process.cwd(), "src/components"),
  join(process.cwd(), "src/config"),
  join(process.cwd(), "src/app"),
];

const ALLOWLIST_BASENAMES = new Set([
  "hairGummiesBackorder.ts",
  "storefrontBackorderCopy.test.ts",
  "statusMapping.ts",
]);

const SKIP_DIR_NAMES = new Set(["profitAdmin", "bayla-admin", "redirectkiller"]);

function walkTsFiles(dir: string, out: string[]): void {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR_NAMES.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkTsFiles(full, out);
      continue;
    }
    if (name.endsWith(".test.ts") || name.endsWith(".test.tsx")) continue;
    if (name.endsWith(".ts") || name.endsWith(".tsx")) {
      if (!ALLOWLIST_BASENAMES.has(name)) out.push(full);
    }
  }
}

describe("storefront customer copy — no backorder / OOS wording", () => {
  it("hair backorder flag is off (reservation UI hidden)", () => {
    assert.equal(HAIR_GUMMIES_BACKORDER, false);
  });

  it("scans app/components/config sources (except dormant backorder module)", () => {
    const files: string[] = [];
    for (const root of SCAN_ROOTS) walkTsFiles(root, files);

    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const pattern of BANNED_PATTERNS) {
        if (pattern.test(text)) {
          hits.push(`${file}: ${pattern}`);
        }
      }
    }
    assert.equal(
      hits.length,
      0,
      `backorder/OOS copy found in customer-facing sources:\n${hits.join("\n")}`,
    );
  });
});
