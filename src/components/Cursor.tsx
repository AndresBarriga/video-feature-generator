import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BRAND } from "../config";
import { U } from "../layout";

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Waypoint = { x: number; y: number; at: number }; // image px, frame

// macOS-style cursor. Rules (they make clicks read clearly):
// - fades in where the eye already is (the focus center), never from off-screen
// - moves in ONE straight, decelerating line to each target
// - stays visible between clicks on the same screen, fades out after the last
// - every click emits a ripple in the accent color
export const Cursor: React.FC<{
  start: [number, number];
  clicks: Waypoint[];
  map: (x: number, y: number) => [number, number];
}> = ({ start, clicks, map }) => {
  const frame = useCurrentFrame();
  if (clicks.length === 0) return null;
  const fadeIn = Math.max(0, clicks[0].at - 24);
  const fadeOut = clicks[clicks.length - 1].at + 16;
  const opacity = interpolate(frame, [fadeIn, fadeIn + 8, fadeOut, fadeOut + 8], [0, 1, 1, 0], clamp);
  if (opacity === 0) return null;

  // current position in image px
  let pos: [number, number] = start;
  let from: [number, number] = start;
  let fromT = fadeIn + 6;
  for (const c of clicks) {
    if (frame <= c.at) {
      const t = interpolate(frame, [fromT, c.at], [0, 1], { ...clamp, easing: EASE });
      pos = [from[0] + (c.x - from[0]) * t, from[1] + (c.y - from[1]) * t];
      break;
    }
    pos = [c.x, c.y];
    from = [c.x, c.y];
    fromT = c.at + 8; // brief pause after a click
  }
  const [x, y] = map(pos[0], pos[1]);
  const size = 1.25 * U;

  return (
    <>
      {clicks.map((c, i) => {
        const local = frame - c.at;
        if (local < 0 || local > 24) return null;
        const [rx, ry] = map(c.x, c.y);
        const r = interpolate(local, [0, 24], [10, 70], clamp) * U;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rx - r,
              top: ry - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: `${4 * U}px solid ${BRAND.accent}`,
              opacity: interpolate(local, [0, 24], [0.8, 0], clamp),
            }}
          />
        );
      })}
      <svg
        width={32 * size}
        height={40 * size}
        viewBox="0 0 32 40"
        style={{ position: "absolute", left: x - 4 * size, top: y - 2 * size, opacity, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
      >
        <path d="M2 2 L2 28 L9 22 L13 32 L17 30 L13 20 L22 20 Z" fill="#0A0A0A" stroke="#FFFFFF" strokeWidth={1.5} strokeLinejoin="round" />
      </svg>
    </>
  );
};
