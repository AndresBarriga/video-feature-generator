// Friendly validation of video.config.json — plain-language errors for
// non-technical users. Runs automatically before `stills` and `render`.
// It doubles as the "screenshot assistant": it also looks at the images
// (sizes, resolution, proportions, phone/tablet orientation, device-corner
// order, reading time of captions) and warns about what usually goes wrong.
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyVariant, totalSeconds, variantNames } from "../src/variants.mjs";
import { checkBrand, readBrand } from "./lib/brand.mjs";

const here = fileURLToPath(new URL(".", import.meta.url));
const read = (p) => JSON.parse(readFileSync(path.join(here, p), "utf8"));
let raw;
try {
  raw = read("../video.config.json");
} catch (e) {
  console.error("✗ video.config.json is not valid JSON:\n  " + e.message);
  process.exit(1);
}
const manifest = read("../assets/manifest.json");
const brandKit = readBrand(); // saved brand kit (brand.json); a video may override fields in its "brand" block
const FORMATS = ["portrait", "square", "landscape"];
const TRANSITIONS = ["cut", "slide-left", "slide-up"];
const DEVICES = ["phone", "tablet-portrait", "tablet-landscape", "browser", "laptop", "monitor"];
const BACKDROPS = ["plain", "soft", "dots", "grid", "glow"];
const SIDES = ["top", "bottom", "left", "right"];
const ORIENTATION = {
  phone: "portrait",
  "tablet-portrait": "portrait",
  "tablet-landscape": "landscape",
  browser: "landscape",
  laptop: "landscape",
  monitor: "landscape",
};

const fileMB = (p) => {
  try {
    return statSync(path.join(here, "../assets", p)).size / 1e6;
  } catch {
    return 0;
  }
};
const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
const words = (t) => (t ?? "").replace(/\*\*/g, "").split(/\s+/).filter(Boolean).length;

/** Validate ONE concrete config. Returns { errors, warn, total }. */
const validate = (cfg) => {
  const errors = [];
  const warn = [];
  const img = (p, where) => {
    if (p && !manifest[p]) errors.push(`${where}: image "${p}" not found in the assets folder`);
    return manifest[p];
  };
  const inside = (m, x, y) => m && x >= 0 && y >= 0 && x <= m.width && y <= m.height;

  if (!FORMATS.includes(cfg.format)) errors.push(`"format" must be one of: ${FORMATS.join(", ")}`);
  // Brand = saved kit + this video's own overrides
  const brand = { ...brandKit, ...Object.fromEntries(Object.entries(cfg.brand ?? {}).filter(([, v]) => v !== "" && v != null)) };
  const bc = checkBrand(brand, (p) => !!manifest[p]);
  errors.push(...bc.errors);
  warn.push(...bc.warn);
  if (!brandKit.configured && !cfg.brand?.primary)
    warn.push(`Your brand kit isn't set up yet, so this video uses neutral colors. Set it up once (logo, colors, font, tone): ask Claude, or run "npm run brand -- set --primary ... --accent ...".`);
  if (cfg.captionStyle && !["words", "rise"].includes(cfg.captionStyle)) errors.push(`"captionStyle" must be "words" or "rise"`);
  if (!Array.isArray(cfg.scenes) || cfg.scenes.length === 0) {
    errors.push(`"scenes" is empty`);
    return { errors, warn, total: 0 };
  }
  if (cfg.cover) {
    img(cfg.cover.image, "cover");
    if (cfg.cover.device && !DEVICES.includes(cfg.cover.device)) errors.push(`cover: device must be one of ${DEVICES.join(", ")}`);
  }

  let total = 0;
  const screens = [];
  cfg.scenes.forEach((s, i) => {
    const where = `Scene ${i + 1} (${s.type})`;
    if (!["photo", "screen", "end"].includes(s.type)) errors.push(`${where}: unknown type "${s.type}"`);
    if (!(s.seconds > 0)) errors.push(`${where}: "seconds" must be a positive number`);
    total += s.seconds ?? 0;
    if (s.transitionIn && !TRANSITIONS.includes(s.transitionIn))
      errors.push(`${where}: transitionIn must be one of ${TRANSITIONS.join(", ")}`);

    if (s.type === "screen") {
      const m = img(s.image, where);
      screens.push({ i, s, m });
      (s.states ?? []).forEach((st) => {
        const sm = img(st.image, where);
        if (m && sm && (sm.width !== m.width || sm.height !== m.height))
          errors.push(
            `${where}: state image "${st.image}" is ${sm.width}x${sm.height} but "${s.image}" is ${m.width}x${m.height} — screenshots of the same screen must have the same size (retake both in the same window size)`
          );
      });
      (s.clicks ?? []).forEach((c) => {
        if (c.at > s.seconds) errors.push(`${where}: a click happens at ${c.at}s but the scene lasts ${s.seconds}s`);
        if (m && !inside(m, c.x, c.y)) errors.push(`${where}: click (${c.x}, ${c.y}) is outside the screenshot (${m.width}x${m.height})`);
      });
      (s.highlights ?? []).forEach((h) => {
        if (m && (h.x < 0 || h.y < 0 || h.x + h.w > m.width || h.y + h.h > m.height))
          warn.push(`${where}: a highlight box sticks out of the screenshot (${m.width}x${m.height})`);
      });
      (s.callouts ?? []).forEach((c) => {
        if (!c.text) errors.push(`${where}: a callout has no "text"`);
        if (c.side && !SIDES.includes(c.side)) errors.push(`${where}: callout side must be one of ${SIDES.join(", ")}`);
        if (m && !inside(m, c.x, c.y)) errors.push(`${where}: callout point (${c.x}, ${c.y}) is outside the screenshot (${m.width}x${m.height})`);
        if ((c.from ?? 0) >= s.seconds) warn.push(`${where}: a callout starts after the scene ends`);
      });
      (s.typing ?? []).forEach((t) => {
        if (!t.text) errors.push(`${where}: a "typing" entry has no text`);
        if (t.from >= s.seconds) warn.push(`${where}: typing starts at ${t.from}s but the scene lasts ${s.seconds}s`);
        else if (t.text && t.from + (t.text.length / (t.cps ?? 14)) > s.seconds)
          warn.push(`${where}: the text won't finish typing before the scene ends (needs ~${(t.text.length / (t.cps ?? 14)).toFixed(1)} s)`);
        if (m && !inside(m, t.x, t.y)) errors.push(`${where}: typing position (${t.x}, ${t.y}) is outside the screenshot`);
      });
      if (s.detail) {
        if (!s.detail.focus || !(s.detail.focus.width > 0)) errors.push(`${where}: "detail" needs a focus with x, y and width`);
        if (s.detail.from >= s.seconds) warn.push(`${where}: the detail zoom starts after the scene ends`);
        else if (s.detail.from + (s.detail.duration ?? 0.9) > s.seconds) warn.push(`${where}: the detail zoom doesn't finish before the scene ends`);
      }
      if (s.device) {
        if (!DEVICES.includes(s.device)) errors.push(`${where}: device must be one of ${DEVICES.join(", ")} (or leave it out)`);
        else if (m) {
          const orient = m.height > m.width ? "portrait" : "landscape";
          if (orient !== ORIENTATION[s.device])
            warn.push(`${where}: device "${s.device}" is meant for ${ORIENTATION[s.device]} screenshots, but this one is ${orient} (${m.width}x${m.height})`);
        }
        if (s.url && s.device !== "browser") warn.push(`${where}: "url" only shows on device "browser"`);
      }
      if (m) {
        const small = Math.min(m.width, m.height) < 500 || (m.width >= m.height && m.width < 900);
        if (small) warn.push(`${where}: "${s.image}" is small (${m.width}x${m.height}) — it may look blurry. Retake it larger (browser zoom 100–125 %, or a retina screenshot)`);
        if (Math.max(m.width, m.height) > 5000) warn.push(`${where}: "${s.image}" is very large (${m.width}x${m.height}) — rendering will be slower; a 2x screenshot is plenty`);
        if (fileMB(s.image) > 10) warn.push(`${where}: "${s.image}" weighs ${fileMB(s.image).toFixed(0)} MB — consider exporting it smaller`);
      }
    }

    if (s.type === "photo") {
      const m = img(s.image, where);
      if (s.screen?.image) img(s.screen.image, where);
      if (s.screen && (!Array.isArray(s.screen.quad) || s.screen.quad.length !== 4))
        errors.push(`${where}: screen.quad needs 4 corner points [top-left, top-right, bottom-right, bottom-left]`);
      else if (s.screen?.quad) {
        const q = s.screen.quad;
        if (m && q.some(([x, y]) => x < -5 || y < -5 || x > m.width + 5 || y > m.height + 5))
          errors.push(`${where}: a screen corner is outside the photo (${m.width}x${m.height}) — measure again with tools/picker.html`);
        const signs = [0, 1, 2, 3].map((k) => Math.sign(cross(q[k], q[(k + 1) % 4], q[(k + 2) % 4])));
        if (signs.some((v) => v !== signs[0]))
          errors.push(`${where}: the 4 screen corners cross each other — order them top-left, top-right, bottom-right, bottom-left`);
        else if (signs[0] < 0) errors.push(`${where}: the screen corners go counter-clockwise — order them top-left, top-right, bottom-right, bottom-left`);
        const next = cfg.scenes[i + 1];
        const nm = next?.type === "screen" ? manifest[next.image] : undefined;
        if (nm && signs.every((v) => v > 0)) {
          const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
          const qa = (dist(q[0], q[1]) + dist(q[3], q[2])) / (dist(q[0], q[3]) + dist(q[1], q[2]));
          const ia = nm.width / nm.height;
          if (Math.abs(qa - ia) / ia > 0.15)
            warn.push(`${where}: the screen in the photo has a different shape (${qa.toFixed(2)}:1) than the screenshot (${ia.toFixed(2)}:1) — the screenshot will look stretched on it`);
        }
      }
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

  // Screenshots of one video should look like one app: same proportions, similar size.
  const sizes = new Map();
  screens.filter((x) => x.m && !x.s.device).forEach(({ m, i }) => {
    const key = `${m.width}x${m.height}`;
    sizes.set(key, [...(sizes.get(key) ?? []), i + 1]);
  });
  if (sizes.size > 1) {
    const list = [...sizes.entries()].map(([k, sc]) => `${k} (scene ${sc.join(", ")})`).join(" · ");
    const aspects = [...sizes.keys()].map((k) => k.split("x").map(Number)).map(([w, h]) => w / h);
    const drift = Math.max(...aspects) / Math.min(...aspects);
    warn.push(`Screenshots have different sizes: ${list}.${drift > 1.1 ? " Their proportions differ too, so screens will look inconsistent — retake them with the same window size." : ""}`);
  }

  // Can the captions be read? ~0.35 s per word + 0.9 s, over the scenes that share the caption.
  const main = cfg.scenes.filter((s) => s.type !== "end");
  for (let i = 0; i < main.length; ) {
    let j = i;
    let secs = 0;
    const key = `${main[i].caption ?? ""}|${main[i].sub ?? ""}`;
    while (j < main.length && `${main[j].caption ?? ""}|${main[j].sub ?? ""}` === key) secs += main[j++].seconds;
    if (main[i].caption) {
      const need = 0.9 + 0.35 * (words(main[i].caption) + words(main[i].sub));
      if (secs < need)
        warn.push(`Scene ${i + 1}${j - i > 1 ? `–${j}` : ""}: the caption stays ${secs.toFixed(1)} s but needs ~${need.toFixed(1)} s to be read — shorten it or hold the scene longer`);
    }
    i = j;
  }
  if (total > 45) warn.push(`Video is ${total.toFixed(1)} s long — feature videos work best under ~25 s`);
  return { errors, warn, total };
};

// ---- base video + variants ----
const errors = [];
const warn = [];
const seen = new Set();
const collect = (res, prefix) => {
  res.errors.forEach((e) => errors.push(prefix + e));
  res.warn.forEach((w) => {
    if (!seen.has(w)) {
      seen.add(w);
      warn.push(prefix + w);
    }
  });
};
let base;
try {
  base = applyVariant(raw, {});
} catch (e) {
  console.error("✗ " + e.message);
  process.exit(1);
}
const res = validate(base);
collect(res, "");

const nScenes = raw.scenes?.length ?? 0;
for (const name of variantNames(raw)) {
  const v = raw.variants[name];
  const where = `Variant "${name}": `;
  if (v.format && !FORMATS.includes(v.format)) errors.push(`${where}format must be one of ${FORMATS.join(", ")}`);
  [...(v.drop ?? []), ...Object.keys(v.scenes ?? {}).map(Number), ...Object.keys(v.seconds ?? {}).map(Number)].forEach((n) => {
    if (!(n >= 1 && n <= nScenes)) errors.push(`${where}scene number ${n} doesn't exist (this video has ${nScenes} scenes, numbered from 1)`);
  });
  if (v.targetSeconds && !(v.targetSeconds >= 3)) errors.push(`${where}targetSeconds must be at least 3`);
  try {
    collect(validate(applyVariant(raw, { variant: name })), where);
  } catch (e) {
    errors.push(where + e.message);
  }
}

warn.forEach((w) => console.warn("! " + w));
if (errors.length) {
  errors.forEach((e) => console.error("✗ " + e));
  console.error(`\n${errors.length} problem(s) in video.config.json.`);
  process.exit(1);
}
const vn = variantNames(raw);
console.log(
  `config ok: ${base.scenes.length} scenes, ~${totalSeconds(base).toFixed(1)} s, ${base.format}` + (vn.length ? ` · variants: ${vn.join(", ")}` : "")
);
