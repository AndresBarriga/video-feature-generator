// Start a new video: archives the current video.config.json (and its script,
// if any) into videos/<old-slug>/ and writes a fresh starter config.
//   node scripts/new-video.mjs "My feature"                       -> blank starter
//   node scripts/new-video.mjs "My feature" --template tutorial   -> a ready-made structure
//   node scripts/new-video.mjs --list-templates                   -> what templates exist
//   node scripts/new-video.mjs --demo                             -> restore the Taskly demo
// New videos use your saved brand kit (brand.json, see: npm run brand).
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, slug } from "./lib/common.mjs";
import { ensureBrandFile, readBrand } from "./lib/brand.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const cfgPath = path.join(root, "video.config.json");
const tplDir = path.join(root, "templates");
const templates = existsSync(tplDir) ? readdirSync(tplDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")) : [];
const { flags, rest } = parseArgs(process.argv.slice(2));

if (flags["list-templates"]) {
  console.log("Templates: " + templates.join(", "));
  process.exit(0);
}
if (flags.template && !templates.includes(flags.template)) {
  console.error(`✗ Unknown template "${flags.template}". Available: ${templates.join(", ")}`);
  process.exit(1);
}

if (existsSync(cfgPath)) {
  const old = JSON.parse(readFileSync(cfgPath, "utf8"));
  const dir = path.join(root, "videos", slug(old.title ?? "previous"));
  mkdirSync(dir, { recursive: true });
  copyFileSync(cfgPath, path.join(dir, "video.config.json"));
  console.log(`Archived current video to videos/${path.basename(dir)}/`);
}

const name = rest.join(" ").trim();
ensureBrandFile();
const brandNote = () => {
  const b = readBrand();
  console.log(
    b.configured
      ? `Brand kit: ${b.name || "saved"} (brand.json) — used by this video.`
      : "Brand kit NOT set up yet: this video uses neutral colors. Set it up once — ask Claude, or: npm run brand -- set --primary ... --accent ... --font ..."
  );
};
if (flags.demo) {
  copyFileSync(path.join(root, "examples", "demo.config.json"), cfgPath);
  console.log("Restored the Taskly demo (it carries its own brand).");
} else if (flags.template) {
  const tpl = JSON.parse(readFileSync(path.join(tplDir, `${flags.template}.json`), "utf8"));
  tpl.title = name || tpl.title;
  writeFileSync(cfgPath, JSON.stringify(tpl, null, 2) + "\n");
  mkdirSync(path.join(root, "videos", slug(tpl.title)), { recursive: true });
  console.log(`Started "${tpl.title}" from the "${flags.template}" template.`);
  console.log("The text in [brackets] and the demo images are placeholders — replace them with yours.");
  brandNote();
} else {
  const starter = {
    title: name || "New feature video",
    format: "portrait",
    fps: 30,
    scenes: [
      { type: "screen", image: "screens/demo-01-before.png", seconds: 3, caption: "Replace me with **your** first caption" },
      { type: "end", seconds: 3, headline: name || "Your feature", cta: "Try it free" },
    ],
  };
  writeFileSync(cfgPath, JSON.stringify(starter, null, 2) + "\n");
  mkdirSync(path.join(root, "videos", slug(starter.title)), { recursive: true });
  console.log(`Started "${starter.title}".`);
  brandNote();
}
