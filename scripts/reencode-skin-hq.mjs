/** إعادة ضغط صور skin PDP بجودة أعلى من المصدر PNG */
import sharp from "sharp";
import fs from "node:fs";

const HQ = { width: 1800, quality: 92, effort: 4 };
const UPS = { width: 1000, quality: 90, effort: 4 };

async function toWebp(input, output, opts) {
  if (!fs.existsSync(input)) {
    console.warn("skip missing", input);
    return;
  }
  const before = fs.existsSync(output) ? fs.statSync(output).size : 0;
  await sharp(input)
    .rotate()
    .resize({ width: opts.width, withoutEnlargement: true })
    .webp({ quality: opts.quality, effort: opts.effort })
    .toFile(output);
  const after = fs.statSync(output).size;
  console.log(`${output}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`);
}

const root = "public/images/products";
await toWebp(`${root}/pdp/skin-main.png`, `${root}/pdp/skin-main.webp`, HQ);
await toWebp(`${root}/pdp/skin-story.png`, `${root}/pdp/skin-story.webp`, HQ);
await toWebp(
  `${root}/ChatGPT Image Sep 24, 2026, 09_27_45 PM.png`,
  `${root}/pdp/skin-formula-slot.webp`,
  HQ,
);
await toWebp(
  `${root}/ChatGPT Image Sep 24, 2026, 09_47_21 PM.png`,
  `${root}/pdp/skin-timeline-slot.webp`,
  HQ,
);
await toWebp(`${root}/skin-gummies.png`, `${root}/skin-gummies.webp`, { ...HQ, width: 1400 });

for (const n of [1, 2, 3]) {
  await toWebp(`${root}/pdp/upsell/skin-qty-${n}.png`, `${root}/pdp/upsell/skin-qty-${n}.webp`, UPS);
}

console.log("Skin HQ re-encode done.");
