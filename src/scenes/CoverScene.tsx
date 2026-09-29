import { AbsoluteFill, Img, staticFile } from "remotion";
import { BRAND, CONFIG, Device, ScreenScene, imageSize } from "../config";
import { H, U, W } from "../layout";
import { withAlpha } from "../lib/color";
import { renderMarked } from "../components/CaptionBand";
import { DeviceBack, DeviceFront, imageRadius } from "../components/DeviceFrame";
import { FONT, FontLoader } from "../components/FontLoader";

// Poster / thumbnail: big headline, a sub-line and a hero screenshot in a device frame.
// Defaults come from the video itself (end card texts, last screen scene); config "cover" overrides.
const end = CONFIG.scenes.find((s) => s.type === "end");
const screens = CONFIG.scenes.filter((s): s is ScreenScene => s.type === "screen");
const lastScreen = screens[screens.length - 1];

export const COVER = {
  headline: CONFIG.cover?.headline ?? (end && end.type === "end" ? end.headline : CONFIG.title),
  sub: CONFIG.cover?.sub ?? (end && end.type === "end" ? end.tagline : undefined),
  image: CONFIG.cover?.image ?? (lastScreen ? (lastScreen.states?.[lastScreen.states.length - 1]?.image ?? lastScreen.image) : undefined),
  device: (CONFIG.cover?.device ?? lastScreen?.device) as Device | undefined,
  url: CONFIG.cover?.url ?? lastScreen?.url,
};

export const CoverScene: React.FC = () => {
  const wide = W > H;
  const logo = BRAND.logo ? imageSize(BRAND.logo) : null;
  const logoH = 60 * U;

  let hero: React.ReactNode = null;
  if (COVER.image) {
    const { width: iw, height: ih } = imageSize(COVER.image);
    const portraitImg = ih > iw;
    // target width of the screenshot
    let tw = portraitImg ? (wide ? 0.22 * W : 0.5 * W) : wide ? 0.44 * W : 0.84 * W;
    if (wide && (tw * ih) / iw > 0.8 * H) tw = (0.8 * H * iw) / ih;
    const th = (tw * ih) / iw;
    const left = wide ? W * 0.52 + (W * 0.44 - tw) / 2 : (W - tw) / 2;
    const top = wide ? (H - th) / 2 : H * 0.5;
    const p = { left, top, w: tw, h: th };
    hero = (
      <>
        {COVER.device && <DeviceBack device={COVER.device} url={COVER.url} {...p} />}
        <Img
          src={staticFile(COVER.image)}
          style={{
            position: "absolute",
            ...p,
            width: tw,
            height: th,
            borderRadius: imageRadius(COVER.device, tw, th, 14 * U),
            boxShadow: COVER.device ? undefined : "0 24px 60px rgba(0,0,0,0.35)",
          }}
        />
        {COVER.device && <DeviceFront device={COVER.device} {...p} />}
      </>
    );
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.primary,
        backgroundImage: `radial-gradient(circle at ${wide ? "75%" : "50%"} ${wide ? "50%" : "70%"}, ${withAlpha(BRAND.accent, 0.28)} 0%, ${withAlpha(BRAND.accent, 0)} 55%)`,
        fontFamily: FONT,
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <FontLoader />
      {logo && BRAND.logo && (
        <Img
          src={staticFile(BRAND.logo)}
          style={{ position: "absolute", top: 50 * U, left: wide ? 80 * U : (W - (logo.width / logo.height) * logoH) / 2, height: logoH, width: (logo.width / logo.height) * logoH }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: wide ? 80 * U : 0,
          top: wide ? H * 0.28 : H * 0.12,
          width: wide ? W * 0.44 : W,
          padding: wide ? 0 : `0 ${60 * U}px`,
          boxSizing: "border-box",
          textAlign: wide ? "left" : "center",
        }}
      >
        <div style={{ fontSize: (wide ? 92 : 96) * U, fontWeight: 800, lineHeight: 1.05, whiteSpace: "pre-line" }}>
          {renderMarked(COVER.headline, BRAND.accent)}
        </div>
        {COVER.sub && <div style={{ fontSize: 40 * U, opacity: 0.85, marginTop: 24 * U }}>{COVER.sub}</div>}
      </div>
      {hero}
    </AbsoluteFill>
  );
};
