/**
 * يشيل خلفية الشطرنج (ChatGPT export) — flood fill من الحواف
 * node scripts/remove-checkerboard-bg.mjs <input.png> <output.png>
 */
import sharp from "sharp";
import fs from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node scripts/remove-checkerboard-bg.mjs in.png out.png");
  process.exit(1);
}

function isBgPixel(r, g, b) {
  if (Math.abs(r - g) > 12 || Math.abs(g - b) > 12) return false;
  return r >= 175 && g >= 175 && b >= 175;
}

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;
const visited = new Uint8Array(w * h);
const queue = [];

for (let x = 0; x < w; x++) {
  queue.push([x, 0], [x, h - 1]);
}
for (let y = 0; y < h; y++) {
  queue.push([0, y], [w - 1, y]);
}

const at = (x, y) => (y * w + x) * 4;

while (queue.length) {
  const [x, y] = queue.pop();
  if (x < 0 || y < 0 || x >= w || y >= h) continue;
  const pi = y * w + x;
  if (visited[pi]) continue;
  visited[pi] = 1;
  const i = at(x, y);
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (!isBgPixel(r, g, b)) continue;
  data[i + 3] = 0;
  queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(output);

const webpOut = output.replace(/\.png$/i, ".webp");
await sharp(output).webp({ quality: 90, alphaQuality: 100 }).toFile(webpOut);
console.log("Wrote", output, "and", webpOut);
