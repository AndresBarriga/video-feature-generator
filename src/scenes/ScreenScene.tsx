import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BRAND, FPS, ScreenScene as ScreenSceneT, imageSize } from "../config";
import { CONTENT, Placement, U, placeImage, toContent } from "../layout";
import { frames } from "../timeline";
import { Cursor } from "../components/Cursor";
import { Backdrop } from "../components/Backdrop";
import { DeviceBack, DeviceFront, deviceMargin, imageRadius } from "../components/DeviceFrame";
import { renderMarked } from "../components/CaptionBand";
import { FONT } from "../components/FontLoader";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** First-frame placement of a screen scene (used by a photo scene diving into it). */
export const screenPlacement = (s: ScreenSceneT) => placeImage(s.image, s.focus, "contain", deviceMargin(s.device));

const UI_FONT = '-apple-system, "Segoe UI", Roboto, Arial, sans-serif';

// A screenshot of your app, framed on `focus`, with an optional device frame,
// slow push-in, a glide to a detail, state swaps (same screen, new state),
// cursor clicks, glowing highlights, callouts and typed text.
export const ScreenScene: React.FC<{ scene: ScreenSceneT; afterDive?: boolean }> = ({ scene, afterDive }) => {
  const frame = useCurrentFrame();
  const dur = frames(scene.seconds);
  const p0 = screenPlacement(scene);

  // Camera: optional glide from the whole screen to a detail, then the slow push-in on top.
  let p: Placement = p0;
  if (scene.detail) {
    const p1 = placeImage(scene.image, scene.detail.focus, "contain");
    const from = scene.detail.from * FPS;
    const t = interpolate(frame, [from, from + (scene.detail.duration ?? 0.9) * FPS], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    });
    p = {
      scale: p0.scale * Math.pow(p1.scale / p0.scale, t),
      cx: p0.cx + (p1.cx - p0.cx) * t,
      cy: p0.cy + (p1.cy - p0.cy) * t,
    };
  }
  const z = interpolate(frame, [0, dur], [1, scene.zoomTo ?? 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const map = (x: number, y: number) => toContent(p, z, x, y);

  const states = [...(scene.states ?? [])].sort((a, b) => a.from - b.from);
  const current = states.filter((st) => frame >= st.from * FPS).pop()?.image ?? scene.image;
  const { width: iw, height: ih } = imageSize(current);
  const [left, top] = map(0, 0);

  // Device frame. After a photo dive it fades in, so the flat landing stays seamless.
  const k = p.scale * z;
  const w = iw * k;
  const h = ih * k;
  const dev = scene.device;
  const frameOpacity = afterDive ? interpolate(frame, [0, 10], [0, 1], clamp) : 1;
  const frameProps = dev ? { device: dev, left, top, w, h, opacity: frameOpacity, url: scene.url } : null;

  return (
    <AbsoluteFill style={{ top: CONTENT.y, height: CONTENT.h, overflow: "hidden" }}>
      <Backdrop />
      {frameProps && <DeviceBack {...frameProps} />}
      <Img
        src={staticFile(current)}
        style={{
          position: "absolute",
          left,
          top,
          width: w,
          height: h,
          borderRadius: imageRadius(dev, w, h, 10 * U),
          boxShadow: dev ? undefined : "0 18px 50px rgba(20, 30, 50, 0.18)",
        }}
      />
      {frameProps && <DeviceFront {...frameProps} />}

      {(scene.typing ?? []).map((t, i) => {
        const start = t.from * FPS;
        if (frame < start) return null;
        const size = (t.size ?? 24) * k;
        const shown = Math.min(t.text.length, Math.floor(((frame - start) * (t.cps ?? 14)) / FPS));
        const [x, y] = map(t.x, t.y);
        const [cx2, cy2] = t.clear ? map(t.x + t.clear.w, t.y + t.clear.h) : [0, 0];
        const typing = shown < t.text.length;
        const caretOn = typing || Math.floor((frame - start) / 15) % 2 === 0;
        return (
          <div key={i}>
            {t.clear && (
              <div style={{ position: "absolute", left: x, top: y, width: cx2 - x, height: cy2 - y, background: t.clear.color ?? "#ffffff" }} />
            )}
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                fontFamily: UI_FONT,
                fontSize: size,
                fontWeight: t.weight ?? 500,
                lineHeight: 1.3,
                color: t.color ?? "#1f2a3d",
                whiteSpace: "pre",
              }}
            >
              {t.text.slice(0, shown)}
              <span
                style={{
                  display: "inline-block",
                  width: Math.max(2, size * 0.08),
                  height: size * 1.05,
                  marginLeft: size * 0.06,
                  verticalAlign: "text-bottom",
                  background: t.color ?? "#1f2a3d",
                  opacity: caretOn ? 1 : 0,
                }}
              />
            </div>
          </div>
        );
      })}

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

      {(scene.callouts ?? []).map((c, i) => {
        const from = (c.from ?? 0.3) * FPS;
        const to = (c.to ?? scene.seconds) * FPS;
        const o = interpolate(frame, [from, from + 8, to, to + 8], [0, 1, 1, 0], clamp);
        if (o === 0) return null;
        const pop = interpolate(frame, [from, from + 10], [0.85, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
        const [x, y] = map(c.x, c.y);
        const side = c.side ?? "top";
        const gap = 64 * U;
        const dot = 9 * U;
        const bubble: Record<string, React.CSSProperties> = {
          top: { left: x, top: y - gap, transform: "translate(-50%, -100%)" },
          bottom: { left: x, top: y + gap, transform: "translate(-50%, 0)" },
          left: { left: x - gap, top: y, transform: "translate(-100%, -50%)" },
          right: { left: x + gap, top: y, transform: "translate(0, -50%)" },
        };
        const end: Record<string, [number, number]> = {
          top: [x, y - gap],
          bottom: [x, y + gap],
          left: [x - gap, y],
          right: [x + gap, y],
        };
        return (
          <div key={i} style={{ opacity: o }}>
            <svg width={CONTENT.w} height={CONTENT.h} style={{ position: "absolute", left: 0, top: 0 }}>
              <line x1={x} y1={y} x2={end[side][0]} y2={end[side][1]} stroke={BRAND.accent} strokeWidth={4 * U} strokeLinecap="round" />
              <circle cx={x} cy={y} r={dot} fill={BRAND.accent} stroke="#fff" strokeWidth={3 * U} />
            </svg>
            <div
              style={{
                position: "absolute",
                ...bubble[side],
                scale: String(pop),
                background: BRAND.primary,
                color: "#fff",
                border: `${3 * U}px solid ${BRAND.accent}`,
                borderRadius: 14 * U,
                padding: `${10 * U}px ${18 * U}px`,
                fontFamily: FONT,
                fontSize: 30 * U,
                fontWeight: 600,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                boxShadow: "0 10px 26px rgba(20,30,50,0.28)",
              }}
            >
              {renderMarked(c.text, BRAND.accent)}
            </div>
          </div>
        );
      })}

      <Cursor
        start={[p0.cx, p0.cy]}
        clicks={(scene.clicks ?? []).map((c) => ({ x: c.x, y: c.y, at: Math.round(c.at * FPS) }))}
        map={map}
      />
    </AbsoluteFill>
  );
};
