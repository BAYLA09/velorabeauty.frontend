/**
 * يضغّط صور PDP الكبيرة إلى WebP (عرض أقصى 1400px) — شغّل: node scripts/optimize-pdp-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public/images/products/pdp");
const MAX_WIDTH = 1400;
const QUALITY = 82;

async function optimizeFile(absPath) {
  const ext = path.extname(absPath).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) return;
  const out = absPath.replace(/\.(png|jpe?g)$/i, ".webp");
  const stat = fs.statSync(absPath);
  await sharp(absPath)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(out);
  const outStat = fs.statSync(out);
  console.log(
    `${path.basename(absPath)} → ${path.basename(out)} (${(stat.size / 1024 / 1024).toFixed(2)}MB → ${(outStat.size / 1024).toFixed(0)}KB)`,
  );
}

async function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) await walk(p);
    else await optimizeFile(p);
  }
}

if (fs.existsSync(ROOT)) {
  await walk(ROOT);
  console.log("Done.");
} else {
  console.warn("Missing", ROOT);
}
