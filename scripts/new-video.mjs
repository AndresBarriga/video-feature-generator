// Start a new video: archives the current video.config.json (and its script,
// if any) into videos/<old-slug>/ and writes a fresh starter config.
//   node scripts/new-video.mjs "My feature"      -> blank starter
//   node scripts/new-video.mjs --demo            -> restore the Taskly demo
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const cfgPath = path.join(root, "video.config.json");
const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "video";

if (existsSync(cfgPath)) {
  const old = JSON.parse(readFileSync(cfgPath, "utf8"));
  const dir = path.join(root, "videos", slug(old.title ?? "previous"));
  mkdirSync(dir, { recursive: true });
  copyFileSync(cfgPath, path.join(dir, "video.config.json"));
  console.log(`Archived current video to videos/${path.basename(dir)}/`);
}

const arg = process.argv.slice(2).join(" ").trim();
if (arg === "--demo") {
  copyFileSync(path.join(root, "examples", "demo.config.json"), cfgPath);
  console.log("Restored the Taskly demo.");
} else {
  const demo = JSON.parse(readFileSync(path.join(root, "examples", "demo.config.json"), "utf8"));
  const starter = {
    title: arg || "New feature video",
    format: "portrait",
    fps: 30,
    brand: { ...demo.brand, logo: undefined },
    scenes: [
      { type: "screen", image: "screens/demo-01-before.png", seconds: 3, caption: "Replace me with **your** first caption" },
      { type: "end", seconds: 3, headline: arg || "Your feature", cta: "Try it free" },
    ],
  };
  writeFileSync(cfgPath, JSON.stringify(starter, null, 2) + "\n");
  mkdirSync(path.join(root, "videos", slug(starter.title)), { recursive: true });
  console.log(`Started "${starter.title}". Brand colors copied from the demo — replace them with yours.`);
}
