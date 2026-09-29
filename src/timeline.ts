import { CONFIG, FPS, Scene } from "./config";

export const SLIDE = 12; // frames a slide transition overlaps (keep in sync with scripts/stills.mjs)
export const CAPTION_IN = 10;
export const CAPTION_OUT = 6;

export const frames = (s: number) => Math.round(s * FPS);

export const MAIN = CONFIG.scenes.filter((s) => s.type !== "end");
export const END = CONFIG.scenes.find((s) => s.type === "end");

const enterOf = (s: Scene, i: number) => (i === 0 ? "cut" : s.transitionIn ?? "cut");

// Scene start frames. Slides overlap the previous scene; cuts don't.
export const STARTS: number[] = [];
let cursor = 0;
MAIN.forEach((s, i) => {
  if (enterOf(s, i) !== "cut") cursor -= SLIDE;
  STARTS.push(cursor);
  cursor += frames(s.seconds);
});
export const MAIN_END = cursor;
export const END_START = END ? MAIN_END - SLIDE : MAIN_END;
export const TOTAL = END ? END_START + frames(END.seconds) : MAIN_END;

export type Cue = { text: string; sub?: string; from: number; to: number };

// Captions: one global track. Consecutive scenes with the same caption share
// ONE cue (no re-animation at the cut). A cue ends exactly where the next one
// starts and fully fades out inside its own window, so two captions are never
// on screen together. The first caption is already visible on frame 0
// (that frame is the thumbnail in social feeds).
const swapAt = (i: number) => (i === 0 ? -CAPTION_IN : STARTS[i] + (enterOf(MAIN[i], i) === "cut" ? 0 : 4));
export const CUES: Cue[] = [];
MAIN.forEach((s, i) => {
  const key = `${s.caption ?? ""}|${s.sub ?? ""}`;
  const prev = CUES[CUES.length - 1];
  const prevKey = i > 0 ? `${MAIN[i - 1].caption ?? ""}|${MAIN[i - 1].sub ?? ""}` : null;
  if (prev && prevKey === key) return; // continuation
  if (prev && prev.to === Infinity) prev.to = swapAt(i);
  if (s.caption) CUES.push({ text: s.caption, sub: s.sub, from: swapAt(i), to: Infinity });
});
if (CUES.length && CUES[CUES.length - 1].to === Infinity) CUES[CUES.length - 1].to = MAIN_END;
