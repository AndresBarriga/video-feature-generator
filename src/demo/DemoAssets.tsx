import { AbsoluteFill } from "remotion";
import { quadMatrix3d } from "../components/perspective";
import type { Pt } from "../config";

// Fictional demo app "Acme Stays" used by the example video. These
// compositions only generate the PNGs in assets/ (npm run demo-assets);
// real users replace them with their own screenshots and photos.

const UI = {
  bg: "#f3f6fb",
  card: "#ffffff",
  border: "#d8dee9",
  text: "#1f2a3d",
  muted: "#6b778c",
  blue: "#2563eb",
  green: "#8ac926",
  font: '"Segoe UI", Arial, sans-serif',
};

type State = "empty" | "scan" | "filled";

const Field: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 17, color: UI.muted, marginBottom: 8 }}>{label}</div>
    <div
      style={{
        fontSize: 24,
        color: value ? UI.text : UI.muted,
        fontWeight: value ? 600 : 400,
        padding: "10px 14px",
        borderRadius: 8,
        background: value ? "rgba(138, 201, 38, 0.18)" : "transparent",
        marginLeft: -14,
      }}
    >
      {value ?? "Not specified"}
    </div>
  </div>
);

const Button: React.FC<{ label: string; top: number; primary?: boolean }> = ({ label, top, primary }) => (
  <div
    style={{
      position: "absolute",
      left: 32,
      right: 32,
      top,
      height: 56,
      borderRadius: 8,
      border: `1.5px solid ${primary ? UI.blue : UI.border}`,
      background: primary ? UI.blue : "#fff",
      color: primary ? "#fff" : UI.text,
      fontSize: 22,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {label}
  </div>
);

// Card geometry (image px) — referenced by the demo video.config.json:
//   "Scan ID document" button: x 112–1168, y 240–296  (click at 400, 268)
//   fields grid: x 112–1168, y 430–700
export const DemoScreen: React.FC<{ state: State }> = ({ state }) => {
  const filled = state === "filled";
  return (
    <AbsoluteFill style={{ background: UI.bg, fontFamily: UI.font, color: UI.text }}>
      <div
        style={{
          height: 80,
          background: "#fff",
          borderBottom: `1px solid ${UI.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          fontSize: 26,
          fontWeight: 700,
        }}
      >
        Acme Stays <span style={{ fontWeight: 400, color: UI.muted, marginLeft: 14 }}>· Guest check-in</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 120,
          width: 1120,
          height: 740,
          background: UI.card,
          border: `1px solid ${UI.border}`,
          borderRadius: 12,
        }}
      >
        <div style={{ position: "absolute", left: 32, top: 30, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: UI.blue,
                color: "#fff",
                fontWeight: 800,
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              NA
            </div>
            {filled && (
              <div
                style={{
                  position: "absolute",
                  right: -8,
                  bottom: -6,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: UI.green,
                  border: "3px solid #fff",
                  color: "#1d2b53",
                  fontWeight: 900,
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✓
              </div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700 }}>Mr. Novak Adam</div>
            <div style={{ fontSize: 18, color: UI.muted }}>Adult · Room 412</div>
          </div>
        </div>
        <Button label="Scan ID document" top={120} />
        <div style={{ position: "absolute", top: 184, left: 0, right: 0, textAlign: "center", color: UI.muted, fontSize: 17 }}>
          or
        </div>
        <Button label="Enter details manually" top={214} />
        <div
          style={{
            position: "absolute",
            left: 32,
            right: 32,
            top: 310,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            rowGap: 40,
            columnGap: 40,
          }}
        >
          <Field label="Nationality" value={filled ? "Czechia" : undefined} />
          <Field label="Date of birth" value={filled ? "1987-06-21" : undefined} />
          <Field label="Document" value={filled ? "ID card · CZ482193" : undefined} />
          <Field label="Expiry date" value={filled ? "2031-02-11" : undefined} />
        </div>
      </div>

      {state === "scan" && (
        <AbsoluteFill style={{ background: "rgba(20, 28, 45, 0.45)" }}>
          <div
            style={{
              position: "absolute",
              left: 190,
              top: 110,
              width: 900,
              height: 710,
              background: "#fff",
              borderRadius: 12,
              padding: "26px 30px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700 }}>Scan document</div>
            <div style={{ fontSize: 18, color: UI.muted, marginTop: 6 }}>Hold the ID inside the frame</div>
            <div
              style={{
                position: "absolute",
                left: 30,
                right: 30,
                top: 110,
                bottom: 30,
                borderRadius: 10,
                background: "radial-gradient(ellipse at 50% 55%, #2a2d33 0%, #0b0c0e 75%)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 150,
                  top: 110,
                  width: 540,
                  height: 340,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #cfe6f5, #f7dcc2)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ position: "absolute", left: 28, top: 24, fontSize: 15, fontWeight: 800, color: "#1d3b7a", letterSpacing: 2 }}>
                  IDENTITY CARD
                </div>
                <div style={{ position: "absolute", left: 28, top: 60, width: 120, height: 150, borderRadius: 8, background: "#9fb7d9" }} />
                <div style={{ position: "absolute", left: 170, top: 66, fontSize: 18, fontWeight: 700, color: "#111", lineHeight: 1.7 }}>
                  NOVAK
                  <br />
                  ADAM
                  <br />
                  21 JUN 1987
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 22,
                    right: 22,
                    bottom: 22,
                    fontFamily: "Consolas, monospace",
                    fontSize: 17,
                    color: "#111",
                    background: "rgba(138, 201, 38, 0.45)",
                    borderRadius: 4,
                    padding: "4px 8px",
                    lineHeight: 1.5,
                  }}
                >
                  IDCZECZ482193&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  <br />
                  8706211M3102118CZE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 40,
                  right: 40,
                  top: 330,
                  height: 140,
                  border: `3px solid ${UI.green}`,
                  borderRadius: 12,
                  boxShadow: `0 0 24px ${UI.green}`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 40,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                }}
              >
                <span style={{ background: UI.green, color: "#1d2b53", fontWeight: 800, fontSize: 20, borderRadius: 999, padding: "8px 20px" }}>
                  ✓ Document captured
                </span>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// Desk illustration with a tablet. The screen corners are in the demo config
// (photo scene "screen.quad") so the screenshot can be mapped onto it.
export const DEMO_DESK_QUAD: Pt[] = [
  [520, 300],
  [1150, 290],
  [1140, 740],
  [505, 735],
];
export const DemoDesk: React.FC = () => {
  const bezel: Pt[] = [
    [494, 272],
    [1178, 262],
    [1167, 768],
    [478, 764],
  ];
  const poly = (pts: Pt[]) => pts.map((p) => p.join(",")).join(" ");
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #e9dccb 0%, #d9c7b1 62%, #7a5a43 62%, #5e4332 100%)" }}>
      <div style={{ position: "absolute", left: 90, top: 120, width: 260, height: 420, borderRadius: 16, background: "#c9b59c" }} />
      <div style={{ position: "absolute", left: 1290, top: 90, width: 200, height: 200, borderRadius: "50%", background: "#f5e6c8", opacity: 0.8 }} />
      <div style={{ position: "absolute", left: 1330, top: 470, width: 150, height: 200, borderRadius: "50% 50% 12px 12px", background: "#5d8a4a" }} />
      <div style={{ position: "absolute", left: 1370, top: 640, width: 70, height: 120, borderRadius: 10, background: "#8a6a50" }} />
      <svg width={1600} height={1067} style={{ position: "absolute", inset: 0 }}>
        <polygon points={poly(bezel)} fill="#1b1d22" />
        <polygon points={poly(DEMO_DESK_QUAD)} fill="#dfe6f0" />
        <polygon points="700,768 960,766 1000,840 660,842" fill="#2a2c31" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1280,
          height: 900,
          transformOrigin: "0 0",
          transform: quadMatrix3d(1280, 900, DEMO_DESK_QUAD),
          background: "#f3f6fb",
        }}
      >
        <div style={{ height: 80, background: "#fff", borderBottom: "1px solid #d8dee9" }} />
        <div style={{ position: "absolute", left: 80, top: 120, width: 1120, height: 740, background: "#fff", borderRadius: 12 }} />
      </div>
    </AbsoluteFill>
  );
};

export const DemoLogo: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "#1d2b53",
      borderRadius: 80,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      fontFamily: '"Segoe UI", Arial, sans-serif',
      color: "#fff",
      fontSize: 60,
      fontWeight: 800,
      letterSpacing: 4,
    }}
  >
    ACME
    <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#ffb703", display: "inline-block" }} />
  </AbsoluteFill>
);
