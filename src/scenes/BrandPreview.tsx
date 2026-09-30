import { AbsoluteFill, Img, staticFile } from "remotion";
import brandFile from "../../brand.json";
import { BRAND, imageSize } from "../config";
import { BAND, U, W } from "../layout";
import { Backdrop } from "../components/Backdrop";
import { CaptionBand } from "../components/CaptionBand";
import { FONT, FontLoader } from "../components/FontLoader";

// One image that shows the brand kit as a video would use it: caption band with a
// keyword, the CTA button, the success color, the backdrop, the logo and the font.
// (npm run brand:preview -> out/brand-preview.png)
const CUE = [{ text: "Your **key words** in the brand color", sub: "A supporting line in the brand font", from: -20, to: 1_000_000 }];

const Swatch: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ width: 120 * U, height: 120 * U, borderRadius: 24 * U, background: color, border: "2px solid rgba(0,0,0,0.12)", margin: "0 auto" }} />
    <div style={{ fontSize: 22 * U, marginTop: 10 * U, fontWeight: 700 }}>{label}</div>
    <div style={{ fontSize: 20 * U, opacity: 0.65 }}>{color}</div>
  </div>
);

export const BrandPreview: React.FC = () => {
  const logo = BRAND.logo ? imageSize(BRAND.logo) : null;
  const cardW = W * 0.84;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: "#1d2233" }}>
      <FontLoader />
      <Backdrop />
      <CaptionBand cues={CUE} />
      <div style={{ position: "absolute", left: (W - cardW) / 2, top: BAND + 90 * U, width: cardW, display: "flex", flexDirection: "column", gap: 34 * U }}>
        <div style={{ background: "#fff", borderRadius: 26 * U, boxShadow: "0 18px 50px rgba(20,30,50,0.18)", padding: 34 * U }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 * U, marginBottom: 22 * U }}>
            {logo && BRAND.logo && (
              <Img src={staticFile(BRAND.logo)} style={{ height: 64 * U, width: (logo.width / logo.height) * 64 * U }} />
            )}
            <div style={{ fontSize: 34 * U, fontWeight: 800 }}>{brandFile.name || "Your product"}</div>
          </div>
          {[0.9, 0.7, 0.8].map((w, i) => (
            <div key={i} style={{ height: 18 * U, width: `${w * 100}%`, borderRadius: 9 * U, background: "#e6e9f0", marginBottom: 16 * U }} />
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 20 * U, marginTop: 26 * U }}>
            <div style={{ background: BRAND.accent, color: BRAND.primary, fontWeight: 800, fontSize: 30 * U, padding: `${14 * U}px ${36 * U}px`, borderRadius: 999 }}>
              Call to action
            </div>
            <div style={{ background: BRAND.success, color: "#10231a", fontWeight: 700, fontSize: 24 * U, padding: `${10 * U}px ${22 * U}px`, borderRadius: 999 }}>
              ✓ Done
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Swatch color={BRAND.primary} label="Main" />
          <Swatch color={BRAND.accent} label="Accent" />
          <Swatch color={BRAND.success} label="Success" />
          <Swatch color={BRAND.background} label="Background" />
        </div>
        <div style={{ textAlign: "center", fontSize: 26 * U, opacity: 0.75 }}>
          Font: <b>{BRAND.font}</b> · Backdrop: <b>{BRAND.backdrop ?? "plain"}</b> · Tone: <b>{brandFile.tone || "friendly"}</b>
        </div>
      </div>
    </AbsoluteFill>
  );
};
