// Renders test frames (PNG) for review: the middle of every scene plus the
// moment just after each click. Output: out/stills/*.png
//   npm run stills             -> key frames
//   npm run stills -- 12 150   -> specific frame numbers
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const cfg = JSON.parse(readFileSync(path.join(root, "video.config.json"), "utf8"));
const fps = cfg.fps ?? 30;
const SLIDE = 12; // keep in sync with src/timeline.ts

const main = cfg.scenes.filter((s) => s.type !== "end");
const end = cfg.scenes.find((s) => s.type === "end");
let cursor = 0;
const starts = main.map((s, i) => {
  if (i > 0 && (s.transitionIn ?? "cut") !== "cut") cursor -= SLIDE;
  const start = cursor;
  cursor += Math.round(s.seconds * fps);
  return start;
});
const frames = new Map();
main.forEach((s, i) => {
  const d = Math.round(s.seconds * fps);
  frames.set(starts[i] + Math.round(d * 0.55), `scene${i + 1}-${s.type}`);
  (s.clicks ?? []).forEach((c, k) => frames.set(starts[i] + Math.round(c.at * fps) + 2, `scene${i + 1}-click${k + 1}`));
});
if (end) frames.set(cursor - SLIDE + Math.round(end.seconds * fps) - 10, `scene${cfg.scenes.length}-end`);

const custom = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));
const list = custom.length ? custom.map((f) => [f, `frame${f}`]) : [...frames.entries()];

const outDir = path.join(root, "out", "stills");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
console.log("Preparing preview…");
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "assets") });
const composition = await selectComposition({ serveUrl, id: "Video" });
for (const [frame, name] of list.sort((a, b) => a[0] - b[0])) {
  const f = Math.min(Math.max(0, frame), composition.durationInFrames - 1);
  const file = path.join(outDir, `${String(f).padStart(4, "0")}-${name}.png`);
  await renderStill({ serveUrl, composition, frame: f, output: file, imageFormat: "png" });
  console.log("  " + path.relative(root, file));
}
console.log(`Done: ${list.length} still(s) in out/stills`);
