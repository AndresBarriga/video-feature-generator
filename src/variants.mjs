// Turns video.config.json into the config of ONE concrete render:
//   - a named variant (top-level "variants" block): other language, shorter cut, ...
//   - an explicit format (portrait / square / landscape)
// Shared by the video engine (src/config.ts) and the scripts (stills, render-all,
// check), so all of them see exactly the same video.
export const SLIDE_SECONDS = 12 / 30; // keep in sync with SLIDE in src/timeline.ts (at 30 fps)

const TIME_KEYS = {
  clicks: ["at"],
  highlights: ["from", "to"],
  states: ["from"],
  typing: ["from"],
  callouts: ["from", "to"],
};

const scaleScene = (s, f) => {
  const out = { ...s, seconds: +(s.seconds * f).toFixed(2) };
  for (const [key, fields] of Object.entries(TIME_KEYS)) {
    if (!Array.isArray(s[key])) continue;
    out[key] = s[key].map((item) => {
      const c = { ...item };
      for (const k of fields) if (typeof c[k] === "number") c[k] = +(c[k] * f).toFixed(2);
      return c;
    });
  }
  if (s.detail) {
    out.detail = { ...s.detail };
    for (const k of ["from", "duration"]) if (typeof out.detail[k] === "number") out.detail[k] = +(out.detail[k] * f).toFixed(2);
  }
  return out;
};

/** Total length in seconds (slides overlap, cuts don't; the end card slides in). */
export const totalSeconds = (cfg) => {
  const main = cfg.scenes.filter((s) => s.type !== "end");
  const end = cfg.scenes.find((s) => s.type === "end");
  const slides = main.filter((s, i) => i > 0 && (s.transitionIn ?? "cut") !== "cut").length + (end ? 1 : 0);
  return cfg.scenes.reduce((t, s) => t + s.seconds, 0) - slides * SLIDE_SECONDS;
};

export const variantNames = (raw) => Object.keys(raw.variants ?? {});

/**
 * @param raw   the parsed video.config.json
 * @param opts  { variant?: string, format?: string }
 */
export const applyVariant = (raw, opts = {}) => {
  const cfg = JSON.parse(JSON.stringify(raw));
  const variants = cfg.variants ?? {};
  delete cfg.variants;
  const name = opts.variant || "";
  if (name) {
    const v = variants[name];
    if (!v) throw new Error(`Unknown variant "${name}". Available: ${Object.keys(variants).join(", ") || "(none defined)"}`);
    if (v.title) cfg.title = v.title;
    if (v.format) cfg.format = v.format;
    if (v.captionStyle) cfg.captionStyle = v.captionStyle;
    if (v.brand) cfg.brand = { ...cfg.brand, ...v.brand };
    // Scene numbers are 1-based and refer to the ORIGINAL scene list.
    for (const [n, patch] of Object.entries(v.scenes ?? {})) {
      const i = Number(n) - 1;
      if (cfg.scenes[i]) cfg.scenes[i] = { ...cfg.scenes[i], ...patch };
    }
    for (const [n, secs] of Object.entries(v.seconds ?? {})) {
      const i = Number(n) - 1;
      if (cfg.scenes[i]) cfg.scenes[i] = { ...cfg.scenes[i], seconds: secs };
    }
    const drop = new Set(v.drop ?? []);
    if (drop.size) cfg.scenes = cfg.scenes.filter((_, i) => !drop.has(i + 1));
    // Fit the whole video to a target length by scaling every scene except the end card.
    if (v.targetSeconds && cfg.scenes.length) {
      const end = cfg.scenes.find((s) => s.type === "end");
      const main = cfg.scenes.filter((s) => s.type !== "end");
      const slides = main.filter((s, i) => i > 0 && (s.transitionIn ?? "cut") !== "cut").length + (end ? 1 : 0);
      const mainSum = main.reduce((t, s) => t + s.seconds, 0);
      const wanted = v.targetSeconds - (end ? end.seconds : 0) + slides * SLIDE_SECONDS;
      const f = Math.max(0.4, Math.min(1.6, wanted / mainSum));
      cfg.scenes = cfg.scenes.map((s) => (s.type === "end" ? s : scaleScene(s, f)));
    }
    cfg.variantName = name;
  }
  if (opts.format) cfg.format = opts.format;
  return cfg;
};
