import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../public", import.meta.url).pathname;

const svgRegular = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0f172a"/>
  <text x="256" y="368" text-anchor="middle" font-family="Georgia, serif" font-size="320" font-style="italic" fill="white">L</text>
</svg>`;

// Maskable: content must fit in a ~80% safe zone (rounded to any shape)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0f172a"/>
  <text x="256" y="340" text-anchor="middle" font-family="Georgia, serif" font-size="240" font-style="italic" fill="white">L</text>
</svg>`;

const targets = [
  { name: "icon-192.png", size: 192, svg: svgRegular },
  { name: "icon-512.png", size: 512, svg: svgRegular },
  { name: "apple-icon.png", size: 180, svg: svgRegular },
  { name: "icon-maskable-512.png", size: 512, svg: svgMaskable },
];

for (const t of targets) {
  const buf = await sharp(Buffer.from(t.svg))
    .resize(t.size, t.size)
    .png()
    .toBuffer();
  const out = join(root, t.name);
  await writeFile(out, buf);
  console.log("wrote", out);
}
