import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BRAND, FPS, ScreenScene as ScreenSceneT, imageSize } from "../config";
import { CONTENT, U, placeImage, toContent } from "../layout";
import { frames } from "../timeline";
import { Cursor } from "../components/Cursor";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** First-frame placement of a screen scene (used by a photo scene diving into it). */
export const screenPlacement = (s: ScreenSceneT) => placeImage(s.image, s.focus, "contain");

// A screenshot of your app, framed on `focus`, with an optional slow push-in,
// state swaps (same screen, new state), cursor clicks and glowing highlights.
export const ScreenScene: React.FC<{ scene: ScreenSceneT }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const dur = frames(scene.seconds);
  const p = screenPlacement(scene);
  const z = interpolate(frame, [0, dur], [1, scene.zoomTo ?? 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const map = (x: number, y: number) => toContent(p, z, x, y);

  const states = [...(scene.states ?? [])].sort((a, b) => a.from - b.from);
  const current = states.filter((st) => frame >= st.from * FPS).pop()?.image ?? scene.image;
  const { width: iw, height: ih } = imageSize(current);
  const [left, top] = map(0, 0);

  return (
    <AbsoluteFill style={{ top: CONTENT.y, height: CONTENT.h, overflow: "hidden", backgroundColor: BRAND.background }}>
      <Img
        src={staticFile(current)}
        style={{
          position: "absolute",
          left,
          top,
          width: iw * p.scale * z,
          height: ih * p.scale * z,
          borderRadius: 10 * U,
          boxShadow: "0 18px 50px rgba(20, 30, 50, 0.18)",
        }}
      />

      {(scene.highlights ?? []).map((hl, i) => {
        const from = (hl.from ?? 0) * FPS;
        const to = (hl.to ?? scene.seconds) * FPS;
        const o = interpolate(frame, [from, from + 8, to, to + 8], [0, 1, 1, 0], clamp);
        if (o === 0) return null;
        const pulse = 0.75 + 0.25 * Math.sin(((frame - from) / FPS) * Math.PI * 2);
        const [x1, y1] = map(hl.x, hl.y);
        const [x2, y2] = map(hl.x + hl.w, hl.y + hl.h);
        const pad = 6 * U;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x1 - pad,
              top: y1 - pad,
              width: x2 - x1 + pad * 2,
              height: y2 - y1 + pad * 2,
              borderRadius: 10 * U,
              border: `${4 * U}px solid ${BRAND.accent}`,
              boxShadow: `0 0 0 ${10 * U * pulse}px ${BRAND.accent}33`,
              opacity: o,
            }}
          />
        );
      })}

      <Cursor
        start={[p.cx, p.cy]}
        clicks={(scene.clicks ?? []).map((c) => ({ x: c.x, y: c.y, at: Math.round(c.at * FPS) }))}
        map={map}
      />
    </AbsoluteFill>
  );
};
