// Poster / thumbnail image for the video: headline, sub-line and a hero screenshot.
//   npm run cover                          -> one PNG per format
//   npm run cover -- --formats landscape   -> just that one
// Files: videos/<title>/exports/<title>-cover-<format>.png
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { FORMATS, bundleOnce, envFor, parseArgs, readConfig, root, slug } from "./lib/common.mjs";

const { flags } = parseArgs(process.argv.slice(2));
const base = readConfig();
const formats = flags.formats ? String(flags.formats).split(",").map((x) => x.trim()) : FORMATS;
const variant = flags.variant && flags.variant !== true ? String(flags.variant) : "";
const outDir = path.join(root, "videos", slug(base.title), "exports");
mkdirSync(outDir, { recursive: true });
const serveUrl = await bundleOnce();
for (const format of formats) {
  const envVariables = envFor({ format, variant });
  const composition = await selectComposition({ serveUrl, id: "Cover", envVariables });
  const out = path.join(outDir, `${slug(base.title)}${variant ? "-" + slug(variant) : ""}-cover-${format}.png`);
  await renderStill({ serveUrl, composition, envVariables, output: out, imageFormat: "png" });
  console.log("  " + path.relative(root, out));
}
