import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BRAND, EndScene as EndSceneT, imageSize } from "../config";
import { H, U, W } from "../layout";
import { FONT } from "../components/FontLoader";
import { renderMarked } from "../components/CaptionBand";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// Staggered rise-in once the card has slid up.
const rise = (frame: number, from: number) => ({
  opacity: interpolate(frame, [from, from + 14], [0, 1], { ...clamp, easing: EASE }),
  translate: `0px ${interpolate(frame, [from, from + 14], [36 * U, 0], { ...clamp, easing: EASE })}px`,
});

// Closing card: optional blurred background photo, logo, headline, tagline,
// subline, CTA button and URL. Brand waves at the bottom.
export const EndScene: React.FC<{ scene: EndSceneT }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const logo = BRAND.logo ? imageSize(BRAND.logo) : null;
  const logoH = 110 * U;
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.primary, overflow: "hidden", fontFamily: FONT }}>
      {scene.backgroundImage && (
        <>
          <Img
            src={staticFile(scene.backgroundImage)}
            style={{ position: "absolute", height: H * 1.15, left: "50%", top: -H * 0.07, translate: "-50% 0", filter: "blur(28px)" }}
          />
          <AbsoluteFill style={{ backgroundColor: BRAND.primary, opacity: 0.8 }} />
        </>
      )}

      <svg width={W} height={260 * U} style={{ position: "absolute", left: 0, bottom: 0 }}>
        <path d={`M0 ${120 * U} C ${W * 0.35} ${30 * U}, ${W * 0.62} ${170 * U}, ${W} ${70 * U} V${260 * U} H0 Z`} fill={BRAND.accent} />
        <path d={`M0 ${170 * U} C ${W * 0.3} ${110 * U}, ${W * 0.7} ${230 * U}, ${W} ${150 * U} V${260 * U} H0 Z`} fill={BRAND.success} />
        <path d={`M0 ${215 * U} C ${W * 0.4} ${175 * U}, ${W * 0.66} ${255 * U}, ${W} ${205 * U} V${260 * U} H0 Z`} fill={BRAND.primary} />
      </svg>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 160 * U,
          color: "#fff",
          textAlign: "center",
          gap: 18 * U,
        }}
      >
        {logo && BRAND.logo && (
          <div style={{ ...rise(frame, 10), marginBottom: 40 * U }}>
            <Img src={staticFile(BRAND.logo)} style={{ height: logoH, width: (logo.width / logo.height) * logoH }} />
          </div>
        )}
        <div style={{ ...rise(frame, 16), fontSize: 84 * U, fontWeight: 800, lineHeight: 1.1, padding: `0 ${50 * U}px`, whiteSpace: "pre-line" }}>
          {renderMarked(scene.headline, BRAND.accent)}
        </div>
        {scene.tagline && (
          <div style={{ ...rise(frame, 20), fontSize: 46 * U, fontWeight: 700, opacity: 0.85 }}>{scene.tagline}</div>
        )}
        {scene.subline && (
          <div style={{ ...rise(frame, 26), marginTop: 26 * U, fontSize: 36 * U, lineHeight: 1.35, opacity: 0.9, whiteSpace: "pre-line" }}>
            {scene.subline}
          </div>
        )}
        {scene.cta && (
          <div
            style={{
              ...rise(frame, 34),
              marginTop: 44 * U,
              padding: `${24 * U}px ${64 * U}px`,
              borderRadius: 999,
              background: BRAND.accent,
              color: BRAND.primary,
              fontSize: 44 * U,
              fontWeight: 800,
              boxShadow: "0 14px 34px rgba(0,0,0,0.3)",
              scale: String(interpolate(frame, [58, 64, 72], [1, 1.05, 1], clamp)),
            }}
          >
            {scene.cta}
          </div>
        )}
        {scene.url && <div style={{ ...rise(frame, 40), marginTop: 10 * U, fontSize: 32 * U, fontWeight: 700 }}>{scene.url}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
