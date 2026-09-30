// Scans ./assets for images and writes assets/manifest.json with their pixel
// sizes, so the video can lay out screenshots without guessing.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { ensureBrandFile } from "./lib/brand.mjs";

const ROOT = fileURLToPath(new URL("../assets/", import.meta.url));
const EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const size = (buf, ext) => {
  if (ext === ".png") return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (ext === ".webp") {
    const t = buf.toString("ascii", 12, 16);
    if (t === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (t === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    const v = buf.readUInt32LE(21);
    return { width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1 };
  }
  // JPEG: walk the segments until a start-of-frame marker
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
    }
    i += 2 + len;
  }
  throw new Error("could not read JPEG size");
};

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const manifest = {};
for (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!EXT.has(ext)) continue;
  const key = relative(ROOT, file).split("\\").join("/");
  try {
    manifest[key] = size(readFileSync(file), ext);
  } catch (e) {
    console.warn(`! Skipped ${key}: ${e.message}`);
  }
}
writeFileSync(join(ROOT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`assets: ${Object.keys(manifest).length} image(s) indexed`);
ensureBrandFile(); // brand.json always exists (neutral default until you set up your brand)
