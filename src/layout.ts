import { CONFIG, Focus, Format, imageSize } from "./config";

const SIZES: Record<Format, { w: number; h: number }> = {
  portrait: { w: 1080, h: 1350 }, // 4:5 — LinkedIn / Instagram feed
  square: { w: 1080, h: 1080 }, // 1:1
  landscape: { w: 1920, h: 1080 }, // 16:9 — YouTube, website, presentations
};

const { w, h } = SIZES[CONFIG.format] ?? SIZES.portrait;

export const W = w;
export const H = h;
/** Caption band height (~19% of the frame): big enough for 2 lines + a sub-line. */
export const BAND = Math.round(h * 0.19);
/** Area below the caption band where screenshots and photos are shown. */
export const CONTENT = { w, h: h - BAND, y: BAND };
/** Unit for sizes: 1 at 1080 px on the short side. */
export const U = Math.min(w, h) / 1080;

/** How an image is placed: scale + the image point shown at the content center. */
export type Placement = { scale: number; cx: number; cy: number };

/** Fit `focus` into the content area. Default: whole image contained ("screen")
 *  or cover-filled ("photo"). */
export const placeImage = (path: string, focus: Focus | undefined, mode: "contain" | "cover"): Placement => {
  const { width: iw, height: ih } = imageSize(path);
  const aspect = CONTENT.w / CONTENT.h;
  if (focus) {
    const byWidth = CONTENT.w / focus.width;
    const scale = focus.height ? Math.min(byWidth, CONTENT.h / focus.height) : byWidth;
    return { scale, cx: focus.x, cy: focus.y };
  }
  if (mode === "cover") {
    const fw = Math.min(iw, ih * aspect);
    return { scale: CONTENT.w / fw, cx: iw / 2, cy: ih / 2 };
  }
  // contain with a small margin so the screenshot reads as a screen
  const scale = Math.min((CONTENT.w * 0.94) / iw, (CONTENT.h * 0.94) / ih);
  return { scale, cx: iw / 2, cy: ih / 2 };
};

/** Image point -> content-area point for a placement at zoom `z` (about the focus). */
export const toContent = (p: Placement, z: number, x: number, y: number): [number, number] => [
  CONTENT.w / 2 + (x - p.cx) * p.scale * z,
  CONTENT.h / 2 + (y - p.cy) * p.scale * z,
];
