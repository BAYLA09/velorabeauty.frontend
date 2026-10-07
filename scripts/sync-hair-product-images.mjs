/**
 * Regenerate hair WebP assets from PNG masters.
 * Run: node scripts/sync-hair-product-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const chatGptPdp = path.join(
  root,
  "public/images/products/ChatGPT Image Sep 24, 2026, 09_00_20 PM.png",
);

async function toWebp(src, dest, width) {
  if (!fs.existsSync(src)) {
    console.warn("skip missing", src);
    return;
  }
  await sharp(src)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(dest);
  console.log(path.basename(dest));
}

const packshot = path.join(root, "public/images/products/hair-gummies.png");
const beforeAfter = path.join(root, "public/images/products/pdp/upsell/hair-qty-1.png");

/** PDP hero PNG is generated from this ChatGPT master (replace PNG to update the live WebP). */
if (fs.existsSync(chatGptPdp)) {
  fs.copyFileSync(
    chatGptPdp,
    path.join(root, "public/images/products/pdp/hair-main.png"),
  );
}

await toWebp(packshot, packshot.replace(/\.png$/, ".webp"), 1400);
await toWebp(
  path.join(root, "public/images/products/pdp/hair-main.png"),
  path.join(root, "public/images/products/pdp/hair-main.webp"),
  1400,
);

for (const n of [1, 2, 3]) {
  const png = path.join(root, `public/images/products/pdp/upsell/hair-qty-${n}.png`);
  if (fs.existsSync(beforeAfter) && !fs.existsSync(png)) {
    fs.copyFileSync(beforeAfter, png);
  }
  await toWebp(png, png.replace(/\.png$/, ".webp"), 900);
}

console.log("Hair images synced.");
