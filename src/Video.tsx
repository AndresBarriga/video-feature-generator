import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { BRAND, ScreenScene as ScreenSceneT } from "./config";
import { H } from "./layout";
import { CUES, END, END_START, MAIN, MAIN_END, SLIDE, frames } from "./timeline";
import { CaptionBand } from "./components/CaptionBand";
import { FontLoader } from "./components/FontLoader";
import { ScreenScene } from "./scenes/ScreenScene";
import { PhotoScene } from "./scenes/PhotoScene";
import { EndScene } from "./scenes/EndScene";

const SlideUpIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, SLIDE], [H, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });
  return <AbsoluteFill style={{ translate: `0px ${y}px` }}>{children}</AbsoluteFill>;
};

// The whole video, built from video.config.json:
//   scenes (cut or quick slide — never a cross-fade) + one caption band on top
//   + the end card sliding up over everything.
export const Video: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BRAND.background }}>
    <FontLoader />
    <Sequence durationInFrames={MAIN_END}>
      <TransitionSeries>
        {MAIN.flatMap((scene, i) => {
          const enter = i === 0 ? "cut" : scene.transitionIn ?? "cut";
          const next = MAIN[i + 1]?.type === "screen" ? (MAIN[i + 1] as ScreenSceneT) : undefined;
          return [
            enter !== "cut" ? (
              <TransitionSeries.Transition
                key={`t${i}`}
                presentation={slide({ direction: enter === "slide-up" ? "from-bottom" : "from-right" })}
                timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE })}
              />
            ) : null,
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={frames(scene.seconds)}>
              {scene.type === "screen" && <ScreenScene scene={scene} />}
              {scene.type === "photo" && <PhotoScene scene={scene} next={next} />}
            </TransitionSeries.Sequence>,
          ].filter(Boolean) as React.ReactElement[];
        })}
      </TransitionSeries>
      <CaptionBand cues={CUES} />
    </Sequence>
    {END && END.type === "end" && (
      <Sequence from={END_START} durationInFrames={frames(END.seconds)}>
        <SlideUpIn>
          <EndScene scene={END} />
        </SlideUpIn>
      </Sequence>
    )}
  </AbsoluteFill>
);
