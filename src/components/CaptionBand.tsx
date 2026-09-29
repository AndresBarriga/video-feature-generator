import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BRAND, imageSize } from "../config";
import { BAND, U, W } from "../layout";
import { CAPTION_IN, CAPTION_OUT, Cue } from "../timeline";
import { FONT } from "./FontLoader";

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// **keyword** -> bold, in the accent color
export const renderMarked = (text: string, accent: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <span key={i} style={{ color: accent, fontWeight: 800 }}>
        {part.slice(2, -2)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );

// Brand-colored band on top of the whole video with the caption track and the
// logo in the corner. Captions rise in from below and exit upwards.
export const CaptionBand: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const frame = useCurrentFrame();
  const cue = cues.find((c) => frame >= c.from && frame < c.to);
  const logoH = 40 * U;
  const logo = BRAND.logo ? imageSize(BRAND.logo) : null;
  const k = [cue?.from ?? 0, (cue?.from ?? 0) + CAPTION_IN, (cue?.to ?? 1) - CAPTION_OUT, cue?.to ?? 1];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={W} height={BAND + 50 * U} style={{ position: "absolute", top: 0, left: 0 }}>
        <path
          d={`M0 0 H${W} V${BAND + 4 * U} C ${W * 0.72} ${BAND + 40 * U}, ${W * 0.3} ${BAND}, 0 ${BAND + 26 * U} Z`}
          fill={BRAND.primary}
        />
        <path
          d={`M${W * 0.5} ${BAND + 27 * U} C ${W * 0.68} ${BAND + 38 * U}, ${W * 0.86} ${BAND + 27 * U}, ${W} ${BAND + 6 * U}`}
          stroke={BRAND.accent}
          strokeWidth={7 * U}
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {logo && BRAND.logo && (
        <Img
          src={staticFile(BRAND.logo)}
          style={{ position: "absolute", top: 18 * U, right: 26 * U, height: logoH, width: (logo.width / logo.height) * logoH }}
        />
      )}

      {cue && (
        <div
          style={{
            position: "absolute",
            top: logo ? logoH + 22 * U : 0,
            left: 0,
            width: W,
            height: BAND - (logo ? logoH + 36 * U : 16 * U),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10 * U,
            padding: `0 ${60 * U}px`,
            boxSizing: "border-box",
            textAlign: "center",
            fontFamily: FONT,
            color: "#fff",
            opacity: interpolate(frame, k, [0, 1, 1, 0], clamp),
            translate: `0px ${interpolate(frame, k, [40 * U, 0, 0, -26 * U], { ...clamp, easing: EASE })}px`,
          }}
        >
          <div style={{ fontSize: (cue.sub ? 46 : 52) * U, fontWeight: 700, lineHeight: 1.14, whiteSpace: "pre-line" }}>
            {renderMarked(cue.text, BRAND.accent)}
          </div>
          {cue.sub && <div style={{ fontSize: 28 * U, fontWeight: 400, opacity: 0.85 }}>{cue.sub}</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};
