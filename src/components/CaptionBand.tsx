import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BRAND, CONFIG, imageSize } from "../config";
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

type Word = { text: string; kw: boolean; glue?: boolean } | "br";

// "Your week,\n**sorted itself.**" -> words with a keyword flag, and line breaks
const tokenize = (text: string): Word[] => {
  const out: Word[] = [];
  let prevRaw = "";
  text.split(/(\*\*[^*]+\*\*)/g).forEach((part) => {
    if (!part) return;
    const kw = part.startsWith("**");
    const body = kw ? part.slice(2, -2) : part;
    body.split("\n").forEach((line, li) => {
      if (li > 0) out.push("br");
      // a word that touches the previous part (e.g. "**apps**?") stays glued to it
      const glue = li === 0 && out.length > 0 && out[out.length - 1] !== "br" && !/^\s/.test(line) && !/\s$/.test(prevRaw);
      line.split(/\s+/).filter(Boolean).forEach((w, wi) => out.push({ text: w, kw, glue: glue && wi === 0 }));
    });
    prevRaw = kw ? "x" : part;
  });
  return out;
};

const STEP = 3; // frames between words
const WORD_IN = 10;

// Word-by-word caption: each word rises in, keywords get an accent underline that draws itself.
// A caption that is already on screen at frame 0 (the feed thumbnail) is shown complete.
const WordsCaption: React.FC<{ text: string; from: number; accent: string }> = ({ text, from, accent }) => {
  const frame = useCurrentFrame();
  const tokens = tokenize(text);
  const total = tokens.filter((t) => t !== "br" && !t.glue).length;
  const step = Math.min(STEP, 14 / Math.max(1, total));
  let n = 0;
  return (
    <>
      {tokens.map((t, i) => {
        if (t === "br") return <br key={i} />;
        if (!t.glue) n++;
        const delay = (n - 1) * step;
        const next = tokens[i + 1];
        const joinsNext = t.kw && !!next && next !== "br" && next.kw && !next.glue;
        const local = from < 0 ? 999 : frame - from - delay;
        const o = interpolate(local, [0, WORD_IN], [0, 1], clamp);
        const y = interpolate(local, [0, WORD_IN], [24 * U, 0], { ...clamp, easing: EASE });
        const line = interpolate(local, [WORD_IN - 2, WORD_IN + 10], [0, 1], { ...clamp, easing: EASE });
        return (
          <span key={i}>
            {i > 0 && !t.glue && tokens[i - 1] !== "br" ? " " : ""}
            <span
              style={{
                position: "relative",
                display: "inline-block",
                opacity: o,
                translate: `0px ${y}px`,
                color: t.kw ? accent : undefined,
                fontWeight: t.kw ? 800 : undefined,
              }}
            >
              {t.text}
              {t.kw && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: -2 * U,
                    height: 4 * U,
                    width: `calc(${line * 100}% + ${joinsNext ? 0.3 * line : 0}em)`,
                    borderRadius: 4 * U,
                    background: accent,
                    opacity: 0.85,
                  }}
                />
              )}
            </span>
          </span>
        );
      })}
    </>
  );
};

// Brand-colored band on top of the whole video with the caption track and the
// logo in the corner. Captions rise in from below and exit upwards.
export const CaptionBand: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const frame = useCurrentFrame();
  const cue = cues.find((c) => frame >= c.from && frame < c.to);
  const logoH = 40 * U;
  const logo = BRAND.logo ? imageSize(BRAND.logo) : null;
  const k = [cue?.from ?? 0, (cue?.from ?? 0) + CAPTION_IN, (cue?.to ?? 1) - CAPTION_OUT, cue?.to ?? 1];
  const words = (CONFIG.captionStyle ?? "words") === "words";

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
            opacity: words ? interpolate(frame, [k[2], k[3]], [1, 0], clamp) : interpolate(frame, k, [0, 1, 1, 0], clamp),
            translate: words
              ? `0px ${interpolate(frame, [k[2], k[3]], [0, -26 * U], { ...clamp, easing: EASE })}px`
              : `0px ${interpolate(frame, k, [40 * U, 0, 0, -26 * U], { ...clamp, easing: EASE })}px`,
          }}
        >
          <div style={{ fontSize: (cue.sub ? 46 : 52) * U, fontWeight: 700, lineHeight: 1.14, whiteSpace: "pre-line" }}>
            {words ? <WordsCaption text={cue.text} from={cue.from} accent={BRAND.accent} /> : renderMarked(cue.text, BRAND.accent)}
          </div>
          {cue.sub && (
            <div
              style={{
                fontSize: 28 * U,
                fontWeight: 400,
                opacity: words && cue.from >= 0 ? interpolate(frame, [cue.from + 14, cue.from + 24], [0, 0.85], clamp) : 0.85,
              }}
            >
              {cue.sub}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
