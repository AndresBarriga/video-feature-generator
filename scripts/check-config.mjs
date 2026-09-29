// Friendly validation of video.config.json — plain-language errors for
// non-technical users. Runs automatically before `stills` and `render`.
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
let cfg;
try {
  cfg = read("../video.config.json");
} catch (e) {
  console.error("✗ video.config.json is not valid JSON:\n  " + e.message);
  process.exit(1);
}
const manifest = read("../assets/manifest.json");
const errors = [];
const warn = [];
const FORMATS = ["portrait", "square", "landscape"];
const TRANSITIONS = ["cut", "slide-left", "slide-up"];

if (!FORMATS.includes(cfg.format)) errors.push(`"format" must be one of: ${FORMATS.join(", ")}`);
if (!cfg.brand?.primary) errors.push(`"brand.primary" (a color like "#16254c") is missing`);
if (cfg.brand?.logo && !manifest[cfg.brand.logo]) errors.push(`Logo not found in assets: ${cfg.brand.logo}`);
if (!Array.isArray(cfg.scenes) || cfg.scenes.length === 0) errors.push(`"scenes" is empty`);

const img = (p, where) => {
  if (p && !manifest[p]) errors.push(`${where}: image "${p}" not found in the assets folder`);
};

let total = 0;
(cfg.scenes ?? []).forEach((s, i) => {
  const where = `Scene ${i + 1} (${s.type})`;
  if (!["photo", "screen", "end"].includes(s.type)) errors.push(`${where}: unknown type "${s.type}"`);
  if (!(s.seconds > 0)) errors.push(`${where}: "seconds" must be a positive number`);
  total += s.seconds ?? 0;
  if (s.transitionIn && !TRANSITIONS.includes(s.transitionIn))
    errors.push(`${where}: transitionIn must be one of ${TRANSITIONS.join(", ")}`);

  if (s.type === "screen") {
    img(s.image, where);
    (s.states ?? []).forEach((st) => img(st.image, where));
    const m = manifest[s.image];
    (s.clicks ?? []).forEach((c) => {
      if (c.at > s.seconds) errors.push(`${where}: a click happens at ${c.at}s but the scene lasts ${s.seconds}s`);
      if (m && (c.x < 0 || c.y < 0 || c.x > m.width || c.y > m.height))
        errors.push(`${where}: click (${c.x}, ${c.y}) is outside the screenshot (${m.width}x${m.height})`);
    });
  }
  if (s.type === "photo") {
    img(s.image, where);
    if (s.screen?.image) img(s.screen.image, where);
    if (s.screen && (!Array.isArray(s.screen.quad) || s.screen.quad.length !== 4))
      errors.push(`${where}: screen.quad needs 4 corner points [top-left, top-right, bottom-right, bottom-left]`);
    if (s.diveIntoNext && cfg.scenes[i + 1]?.type !== "screen")
      errors.push(`${where}: diveIntoNext needs the NEXT scene to be a "screen" scene`);
    if (s.diveIntoNext && !s.screen?.quad)
      errors.push(`${where}: diveIntoNext needs screen.quad (the corners of the tablet/laptop screen in the photo)`);
  }
  if (s.type === "end") {
    if (i !== cfg.scenes.length - 1) errors.push(`${where}: the end card must be the last scene`);
    if (!s.headline) errors.push(`${where}: "headline" is missing`);
    img(s.backgroundImage, where);
  }
  const plain = (s.caption ?? "").replace(/\*\*/g, "");
  if (plain.length > 60) warn.push(`${where}: caption is long (${plain.length} characters) — hard to read on a phone`);
});
if (total > 45) warn.push(`Video is ${total.toFixed(1)} s long — feature videos work best under ~25 s`);

warn.forEach((w) => console.warn("! " + w));
if (errors.length) {
  errors.forEach((e) => console.error("✗ " + e));
  console.error(`\n${errors.length} problem(s) in video.config.json.`);
  process.exit(1);
}
console.log(`config ok: ${cfg.scenes.length} scenes, ~${total.toFixed(1)} s, ${cfg.format}`);
