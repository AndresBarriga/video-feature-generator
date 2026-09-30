import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BRAND, PhotoScene as PhotoSceneT, Pt, ScreenScene, imageSize } from "../config";
import { CONTENT, U, placeImage, toContent } from "../layout";
import { frames } from "../timeline";
import { lerpPt, quadMatrix3d } from "../components/perspective";
import { screenPlacement } from "./ScreenScene";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A real-world photo (desk, office, shop, on-the-go…) with a slow push-in.
// If the photo shows a device, `screen.quad` maps your screenshot onto that
// screen in perspective. With `diveIntoNext`, the camera dives into the device
// and the screen flattens into EXACTLY the first frame of the next screen
// scene — the cut is invisible. (This "photo → live UI" move is the hook
// that tested best in practice.)
export const PhotoScene: React.FC<{ scene: PhotoSceneT; next?: ScreenScene }> = ({ scene, next }) => {
  const frame = useCurrentFrame();
  const D = frames(scene.seconds);
  const dive = !!(scene.diveIntoNext && next && scene.screen);
  const pushEnd = dive ? Math.max(1, D - 24) : D;

  const pushT = interpolate(frame, [0, pushEnd], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const diveT = dive ? interpolate(frame, [D - 30, D - 1], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) }) : 0;
  const flatT = dive ? interpolate(frame, [D - 22, D - 1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 0;

  let base = placeImage(scene.image, scene.focus, "cover");
  const quadImg = scene.screen?.quad;
  // Wide formats crop the photo; keep the device screen fully in view.
  if (quadImg && !scene.focus) {
    const xs = quadImg.map((q) => q[0]);
    const ys = quadImg.map((q) => q[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const pad = 0.09 * Math.max(x1 - x0, y1 - y0);
    const fit = (c: number, lo: number, hi: number) => (lo <= hi ? Math.min(Math.max(c, lo), hi) : c);
    const halfW = CONTENT.w / base.scale / 2;
    const halfH = CONTENT.h / base.scale / 2;
    base = { ...base, cx: fit(base.cx, x1 + pad - halfW, x0 - pad + halfW), cy: fit(base.cy, y1 + pad - halfH, y0 - pad + halfH) };
  }
  const qc: Pt = quadImg
    ? [quadImg.reduce((s, q) => s + q[0], 0) / 4, quadImg.reduce((s, q) => s + q[1], 0) / 4]
    : [base.cx, base.cy];
  // During the dive the camera also drifts to the screen center.
  const p = { scale: base.scale, cx: base.cx + (qc[0] - base.cx) * diveT, cy: base.cy + (qc[1] - base.cy) * diveT };
  const z = interpolate(pushT, [0, 1], [1, scene.pushIn ?? 1.06]) * interpolate(diveT, [0, 1], [1, 1.8]);
  const map = (x: number, y: number): Pt => toContent(p, z, x, y);

  const { width: iw, height: ih } = imageSize(scene.image);
  const [left, top] = map(0, 0);
  const blur = interpolate(diveT, [0.3, 1], [0, 1], clamp);

  // Screenshot on the device screen
  const screenImg = scene.screen?.image ?? (dive && next ? next.image : undefined);
  let overlay: React.ReactNode = null;
  if (quadImg && screenImg) {
    const { width: sw, height: sh } = imageSize(screenImg);
    let quad = quadImg.map(([x, y]) => map(x, y)) as Pt[];
    if (dive && next) {
      const np = screenPlacement(next);
      const { width: nw, height: nh } = imageSize(next.image);
      const tl = toContent(np, 1, 0, 0);
      const br = toContent(np, 1, nw, nh);
      const target: Pt[] = [tl, [br[0], tl[1]], br, [tl[0], br[1]]];
      quad = quad.map((q, i) => lerpPt(q, target[i], flatT));
    }
    overlay = (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: sw,
          height: sh,
          transformOrigin: "0 0",
          transform: quadMatrix3d(sw, sh, quad),
          overflow: "hidden",
          borderRadius: interpolate(flatT, [0, 1], [8, 10 * U]), // lands on the screen scene's rounded corners
        }}
      >
        <Img src={staticFile(screenImg)} style={{ width: sw, height: sh }} />
        <AbsoluteFill
          style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 40%)", opacity: 1 - flatT }}
        />
      </div>
    );
  }

  return (
    <AbsoluteFill style={{ top: CONTENT.y, height: CONTENT.h, overflow: "hidden", backgroundColor: BRAND.background }}>
      {[0, 1, 2, 3].map((i) => {
        const k = 1 + i * 0.03 * blur; // stacked copies = radial zoom blur
        const cx = CONTENT.w / 2;
        const cy = CONTENT.h / 2;
        return (
          <Img
            key={i}
            src={staticFile(scene.image)}
            style={{
              position: "absolute",
              left: cx + (left - cx) * k,
              top: cy + (top - cy) * k,
              width: iw * p.scale * z * k,
              height: ih * p.scale * z * k,
              opacity: i === 0 ? 1 : 0.28 * blur,
              filter: `blur(${blur * (1.5 + i)}px)`,
            }}
          />
        );
      })}
      {overlay}
    </AbsoluteFill>
  );
};
