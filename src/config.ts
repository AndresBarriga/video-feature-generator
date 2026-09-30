import raw from "../video.config.json";
import manifest from "../assets/manifest.json";
import brandFile from "../brand.json"; // your saved brand kit (npm run brand); a video can override any field
import { applyVariant } from "./variants.mjs";

// Set per render by scripts/render-all.mjs, stills and cover (Remotion "envVariables").
declare const process: { env: Record<string, string | undefined> };

// ---- video.config.json schema (see docs/CONFIG-REFERENCE.md) ----

export type Pt = [number, number];
export type Transition = "cut" | "slide-left" | "slide-up";
export type Format = "portrait" | "square" | "landscape";
export type Device = "phone" | "tablet-portrait" | "tablet-landscape" | "browser" | "laptop" | "monitor";
export type Backdrop = "plain" | "soft" | "dots" | "grid" | "glow";
export type CaptionStyle = "words" | "rise";

/** Where to look in an image: center (x, y) + width in image pixels.
 *  With `height` too, the whole rectangle is fitted inside the frame. */
export type Focus = { x: number; y: number; width: number; height?: number };

type Base = {
  seconds: number;
  /** On-screen caption. Wrap keywords in **double asterisks**; use \n for a line break. */
  caption?: string;
  /** Smaller supporting line under the caption. */
  sub?: string;
  transitionIn?: Transition;
};

export type ScreenScene = Base & {
  type: "screen";
  image: string;
  /** Extra screenshots of the SAME screen, swapped in at `from` seconds (e.g. empty -> filled). */
  states?: { image: string; from: number }[];
  focus?: Focus;
  /** Draw a device frame around the screenshot: phone, tablet-portrait, tablet-landscape, browser, laptop, monitor. */
  device?: Device;
  /** Text shown in the address bar when device is "browser". */
  url?: string;
  /** Slow camera push-in over the scene, e.g. 1.1 */
  zoomTo?: number;
  /** Cursor clicks, in screenshot pixels; `at` = seconds from scene start. */
  clicks?: { x: number; y: number; at: number }[];
  /** Glowing boxes around important parts, in screenshot pixels. */
  highlights?: { x: number; y: number; w: number; h: number; from?: number; to?: number }[];
  /** Small labels with an arrow pointing at (x, y): "look here". `side` = where the label sits. */
  callouts?: { x: number; y: number; text: string; side?: "top" | "bottom" | "left" | "right"; from?: number; to?: number }[];
  /** Text typed into a field, letter by letter. (x, y) = top-left of the text; `clear` covers the placeholder. */
  typing?: {
    x: number;
    y: number;
    text: string;
    from: number;
    size?: number;
    color?: string;
    weight?: number;
    cps?: number;
    clear?: { w: number; h: number; color?: string };
  }[];
  /** Camera glides from the whole screen to a detail: zoom to `focus` starting at `from` seconds. */
  detail?: { focus: Focus; from: number; duration?: number };
};

export type PhotoScene = Base & {
  type: "photo";
  image: string;
  focus?: Focus;
  /** Slow push-in, e.g. 1.08 */
  pushIn?: number;
  /** A device screen visible in the photo; your screenshot is mapped onto it. */
  screen?: { quad: [Pt, Pt, Pt, Pt]; image?: string };
  /** End by diving into the device screen, landing exactly on the next screen scene. */
  diveIntoNext?: boolean;
};

export type EndScene = Base & {
  type: "end";
  headline: string;
  tagline?: string;
  subline?: string;
  cta?: string;
  url?: string;
  backgroundImage?: string;
};

export type Scene = ScreenScene | PhotoScene | EndScene;

/** A named alternative of the same video (other language, shorter cut...). See docs/CONFIG-REFERENCE.md. */
export type Variant = {
  title?: string;
  format?: Format;
  captionStyle?: CaptionStyle;
  brand?: Partial<Brand>;
  /** Scene number (1-based, of the original list) -> fields to change, e.g. { "1": { "caption": "..." } } */
  scenes?: Record<string, Partial<Scene>>;
  /** Scene number -> new duration in seconds */
  seconds?: Record<string, number>;
  /** Scene numbers to leave out */
  drop?: number[];
  /** Fit the whole video to this length by scaling every scene except the end card */
  targetSeconds?: number;
};

export type Cover = { headline?: string; sub?: string; image?: string; device?: Device; url?: string };

export type Brand = {
  primary: string; // caption band, end card
  accent: string; // highlighted keywords, CTA, cursor ripple
  success?: string; // check marks, success glows
  background?: string; // behind screenshots
  backdrop?: Backdrop; // look of the area behind screenshots
  font?: string; // any Google Fonts family, e.g. "Inter"
  logo?: string; // path inside assets/, e.g. "brand/logo.png"
};

export type VideoConfig = {
  title: string;
  format: Format;
  fps?: number;
  /** How captions enter: "words" (word by word, default) or "rise" (whole caption slides up). */
  captionStyle?: CaptionStyle;
  /** Poster image (npm run cover): headline, sub-line and a hero screenshot. */
  cover?: Cover;
  variants?: Record<string, Variant>;
  /** Overrides for this video only. Anything left out comes from brand.json (your saved brand kit). */
  brand?: Partial<Brand>;
  scenes: Scene[];
};

export const CONFIG = applyVariant(raw, {
  variant: process.env.REMOTION_VARIANT,
  format: process.env.REMOTION_FORMAT,
}) as VideoConfig;
export const FPS = CONFIG.fps ?? 30;

const SIZES = manifest as Record<string, { width: number; height: number }>;
export const imageSize = (path: string) => {
  const s = SIZES[path];
  if (!s) throw new Error(`Image "${path}" is not in assets/ (run npm run check).`);
  return s;
};

// Brand = defaults < brand.json (saved kit) < this video's own "brand" block.
const KIT_KEYS = ["primary", "accent", "success", "background", "backdrop", "font", "logo"];
const kit = Object.fromEntries(
  Object.entries(brandFile as Record<string, unknown>).filter(([k, v]) => KIT_KEYS.includes(k) && typeof v === "string" && v !== "")
);
export const BRAND = {
  primary: "#1e293b",
  accent: "#3b82f6",
  success: "#2bb673",
  background: "#f2f5fa",
  font: "Inter",
  ...kit,
  ...CONFIG.brand,
} as Brand & { success: string; background: string; font: string };
