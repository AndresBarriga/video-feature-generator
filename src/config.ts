import raw from "../video.config.json";
import manifest from "../assets/manifest.json";

// ---- video.config.json schema (see docs/CONFIG-REFERENCE.md) ----

export type Pt = [number, number];
export type Transition = "cut" | "slide-left" | "slide-up";
export type Format = "portrait" | "square" | "landscape";

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
  /** Draw a phone frame around the screenshot (for mobile app screenshots). */
  device?: "phone";
  /** Slow camera push-in over the scene, e.g. 1.1 */
  zoomTo?: number;
  /** Cursor clicks, in screenshot pixels; `at` = seconds from scene start. */
  clicks?: { x: number; y: number; at: number }[];
  /** Glowing boxes around important parts, in screenshot pixels. */
  highlights?: { x: number; y: number; w: number; h: number; from?: number; to?: number }[];
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

export type VideoConfig = {
  title: string;
  format: Format;
  fps?: number;
  brand: {
    primary: string; // caption band, end card
    accent: string; // highlighted keywords, CTA, cursor ripple
    success?: string; // check marks, success glows
    background?: string; // behind screenshots
    font?: string; // any Google Fonts family, e.g. "Inter"
    logo?: string; // path inside assets/, e.g. "brand/logo.png"
  };
  scenes: Scene[];
};

export const CONFIG = raw as unknown as VideoConfig;
export const FPS = CONFIG.fps ?? 30;

const SIZES = manifest as Record<string, { width: number; height: number }>;
export const imageSize = (path: string) => {
  const s = SIZES[path];
  if (!s) throw new Error(`Image "${path}" is not in assets/ (run npm run check).`);
  return s;
};

export const BRAND = {
  success: "#2bb673",
  background: "#f2f5fa",
  font: "Inter",
  ...CONFIG.brand,
};
