// Your brand kit, saved once in brand.json and used by every video.
//   npm run brand -- show
//   npm run brand -- set --name "Acme" --primary "#10233f" --accent "#2ec4b6" --font Inter \
//                        --logo brand/logo.png --tone friendly --backdrop soft --notes "No exclamation marks"
//   npm run brand -- reset          (back to the neutral default)
// A video can still override any field in its own "brand" block.
import { existsSync } from "node:fs";
import path from "node:path";
import { parseArgs, root } from "./lib/common.mjs";
import { BACKDROPS, DEFAULT_BRAND, TONES, checkBrand, isHex, readBrand, writeBrand } from "./lib/brand.mjs";

const { flags, rest } = parseArgs(process.argv.slice(2));
const cmd = rest[0] ?? "show";
const hasFile = (p) => existsSync(path.join(root, "assets", p));

const print = (b) => {
  console.log(b.configured ? `Brand kit: ${b.name || "(unnamed)"}` : "Brand kit: NOT SET UP YET (neutral defaults in use)");
  for (const k of ["primary", "accent", "success", "background", "backdrop", "font", "logo", "tone", "notes"]) console.log(`  ${k.padEnd(10)} ${b[k] || "—"}`);
  const { errors, warn } = checkBrand(b, hasFile);
  errors.forEach((e) => console.log("  ✗ " + e));
  warn.forEach((w) => console.log("  ! " + w));
};

if (cmd === "show") {
  print(readBrand());
} else if (cmd === "reset") {
  writeBrand(DEFAULT_BRAND);
  console.log("Brand kit reset to the neutral default.");
} else if (cmd === "set") {
  const b = readBrand();
  const keys = ["name", "primary", "accent", "success", "background", "backdrop", "font", "logo", "tone", "notes"];
  const given = keys.filter((k) => flags[k] !== undefined && flags[k] !== true);
  if (!given.length) {
    console.error(`✗ Nothing to set. Use e.g. --primary "#10233f" --accent "#2ec4b6" --font Inter. Fields: ${keys.join(", ")}`);
    process.exit(1);
  }
  for (const k of given) b[k] = String(flags[k]);
  if (b.tone && !TONES.includes(b.tone)) {
    console.error(`✗ tone must be one of: ${TONES.join(", ")}`);
    process.exit(1);
  }
  const { errors } = checkBrand(b, hasFile);
  if (errors.length) {
    errors.forEach((e) => console.error("✗ " + e));
    process.exit(1);
  }
  const warn = [];
  // Is the font on Google Fonts? (only a hint: skipped offline)
  if (given.includes("font") && b.font) {
    try {
      const c = new AbortController();
      const t = setTimeout(() => c.abort(), 5000);
      const r = await fetch(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(b.font).replace(/%20/g, "+")}`, { signal: c.signal });
      clearTimeout(t);
      if (r.status === 400) warn.push(`"${b.font}" was not found on Google Fonts, so the video can't load it. Use the closest Google font (e.g. Inter, Poppins, DM Sans, Roboto, Montserrat).`);
    } catch {
      /* offline: can't verify */
    }
  }
  b.configured = true;
  writeBrand(b);
  print(b);
  warn.forEach((w) => console.log("  ! " + w));
  console.log("\nSaved to brand.json. Every new video uses it. See it: npm run brand:preview");
} else {
  console.error(`✗ Unknown command "${cmd}". Use: show, set, reset`);
  process.exit(1);
}
