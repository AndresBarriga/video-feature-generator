// Brand kit helpers (brand.json at the project root), shared by the brand script and the checker.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));
export const BRAND_PATH = path.join(root, "brand.json");
export const BACKDROPS = ["plain", "soft", "dots", "grid", "glow"];
export const TONES = ["sober", "friendly", "technical"];

export const DEFAULT_BRAND = {
  configured: false,
  name: "",
  primary: "#1e293b",
  accent: "#3b82f6",
  success: "#22c55e",
  background: "#f8fafc",
  backdrop: "soft",
  font: "Inter",
  logo: "",
  tone: "friendly",
  notes: "",
};

export const readBrand = () => {
  if (!existsSync(BRAND_PATH)) return { ...DEFAULT_BRAND };
  try {
    return { ...DEFAULT_BRAND, ...JSON.parse(readFileSync(BRAND_PATH, "utf8")) };
  } catch {
    throw new Error("brand.json is not valid JSON. Delete it (a neutral one is recreated) or ask Claude to fix it.");
  }
};
export const writeBrand = (b) => writeFileSync(BRAND_PATH, JSON.stringify(b, null, 2) + "\n");
export const ensureBrandFile = () => {
  if (!existsSync(BRAND_PATH)) writeBrand(DEFAULT_BRAND);
};

export const isHex = (v) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(v));
const lum = (hex) => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
};
/** WCAG contrast ratio between two hex colors (1 to 21). */
export const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/** Problems and advice for a (merged) brand. `hasFile(path)` tells if a logo path exists in assets. */
export const checkBrand = (b, hasFile) => {
  const errors = [];
  const warn = [];
  for (const k of ["primary", "accent", "success", "background"]) {
    if (b[k] && !isHex(b[k])) errors.push(`brand.${k} "${b[k]}" is not a color like "#1e293b"`);
  }
  if (b.backdrop && !BACKDROPS.includes(b.backdrop)) errors.push(`brand.backdrop must be one of: ${BACKDROPS.join(", ")}`);
  if (b.logo && !hasFile(b.logo)) errors.push(`Logo not found in assets: ${b.logo}`);
  if (isHex(b.primary) && contrast("#ffffff", b.primary) < 4.5)
    warn.push(`The brand's main color ${b.primary} is light for the white caption text on it (contrast ${contrast("#ffffff", b.primary).toFixed(1)}:1, 4.5 is comfortable). Use a darker one for "primary".`);
  if (isHex(b.primary) && isHex(b.accent) && contrast(b.accent, b.primary) < 3)
    warn.push(`The accent ${b.accent} is hard to read on the main color ${b.primary} (contrast ${contrast(b.accent, b.primary).toFixed(1)}:1, 3 is the minimum). Keywords and the CTA button would be faint — pick a brighter or different accent.`);
  return { errors, warn };
};
