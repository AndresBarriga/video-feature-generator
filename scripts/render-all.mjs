// Renders the video in several formats and/or variants in one go.
//   npm run render:all                          -> portrait + square + landscape
//   npm run render:all -- --formats portrait,landscape
//   npm run render:all -- --variants es,short   -> those variants (each in its own format(s))
//   npm run render:all -- --variants all        -> the base video AND every variant
//   npm run render:all -- --only-variants es    -> variants only, not the base video
// Files go to videos/<title>/exports/<title>[-variant]-<format>.mp4
import { renderMedia, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { FORMATS, bundleOnce, envFor, parseArgs, readConfig, root, slug } from "./lib/common.mjs";
import { applyVariant, variantNames } from "../src/variants.mjs";

const { flags } = parseArgs(process.argv.slice(2));
const base = readConfig();
const names = variantNames(base);
const pick = (v) => (v === "all" ? names : String(v).split(",").map((x) => x.trim()).filter(Boolean));

let variants = [];
if (flags["only-variants"]) variants = pick(flags["only-variants"]);
else if (flags.variants) variants = pick(flags.variants);
const includeBase = !flags["only-variants"];
const bad = variants.filter((v) => !names.includes(v));
if (bad.length) {
  console.error(`✗ Unknown variant(s): ${bad.join(", ")}. Defined in video.config.json: ${names.join(", ") || "none"}`);
  process.exit(1);
}
const formatsArg = flags.formats ? String(flags.formats).split(",").map((x) => x.trim()) : FORMATS;
const badF = formatsArg.filter((f) => !FORMATS.includes(f));
if (badF.length) {
  console.error(`✗ Unknown format(s): ${badF.join(", ")}. Use: ${FORMATS.join(", ")}`);
  process.exit(1);
}

// Job list. A variant that fixes its own "format" renders only that one.
const jobs = [];
for (const v of [...(includeBase ? [""] : []), ...variants]) {
  const own = v ? base.variants[v].format : undefined;
  for (const f of own ? [own] : formatsArg) jobs.push({ variant: v, format: f });
}

const outDir = path.join(root, "videos", slug(base.title), "exports");
mkdirSync(outDir, { recursive: true });
console.log(`Rendering ${jobs.length} file(s) into ${path.relative(root, outDir)}\n`);

const serveUrl = await bundleOnce();
const done = [];
for (const [n, job] of jobs.entries()) {
  const label = `${slug(base.title)}${job.variant ? "-" + slug(job.variant) : ""}-${job.format}`;
  process.stdout.write(`[${n + 1}/${jobs.length}] ${label} `);
  const envVariables = envFor(job);
  const composition = await selectComposition({ serveUrl, id: "Video", envVariables });
  const out = path.join(outDir, `${label}.mp4`);
  try {
    let last = -1;
    await renderMedia({
      composition,
      serveUrl,
      envVariables,
      codec: "h264",
      imageFormat: "png",
      pixelFormat: "yuv420p",
      crf: 18,
      overwrite: true,
      outputLocation: out,
      onProgress: ({ progress }) => {
        const pct = Math.floor(progress * 10) * 10;
        if (pct !== last) {
          last = pct;
          process.stdout.write(".");
        }
      },
    });
    const secs = (composition.durationInFrames / composition.fps).toFixed(1);
    console.log(` ${composition.width}x${composition.height}, ${secs} s`);
    done.push(out);
  } catch (e) {
    console.log(" failed");
    const msg = String(e?.message ?? e);
    console.error("✗ " + (/EPERM|EBUSY/.test(msg) ? `${label}.mp4 is open in a player — close it and run again.` : msg.split("\n")[0]));
    if (existsSync(out) && !done.includes(out)) rmSync(out, { force: true });
    process.exitCode = 1;
  }
}
console.log(`\nDone: ${done.length}/${jobs.length} video(s) in ${path.relative(root, outDir)}`);
// Also report what a variant looks like (length), so shortened cuts are easy to verify.
for (const v of variants) {
  const cfg = applyVariant(base, { variant: v });
  console.log(`  variant "${v}": ${cfg.scenes.length} scenes`);
}
