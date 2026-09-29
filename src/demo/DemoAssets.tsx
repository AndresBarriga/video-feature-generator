import { AbsoluteFill } from "remotion";
import { quadMatrix3d } from "../components/perspective";
import type { Pt } from "../config";

// Fictional demo app "Taskly" used by the example video. These compositions
// only generate the PNGs in assets/ (npm run demo-assets); real users replace
// them with their own screenshots and photos.

const UI = {
  bg: "#f5f4fb",
  card: "#ffffff",
  border: "#e1def0",
  text: "#241f3d",
  muted: "#7a7594",
  brand: "#5b45e0",
  green: "#34c38f",
  coral: "#ff7a59",
  font: '"Segoe UI", Arial, sans-serif',
};

type State = "before" | "dialog" | "after";

type Priority = "High" | "Medium" | "Low";
const PRIORITY_COLOR: Record<Priority, string> = { High: "#e5484d", Medium: "#f0a020", Low: "#3b82f6" };

// The same 7 tasks in every screenshot, so the states line up.
const INBOX = [
  { title: "Reply to Dana about the Q3 budget", from: "Email", due: "Fri" },
  { title: "Prepare slides for Monday's review", from: "Docs", due: "Mon" },
  { title: "Fix the login bug reported by support", from: "Slack", due: "Today" },
  { title: "Book flights for the team offsite", from: "Notes", due: "—" },
  { title: "Send meeting notes to the team", from: "Calendar", due: "Today" },
  { title: "Update the onboarding checklist", from: "Docs", due: "Next week" },
  { title: "Renew the design tool license", from: "Email", due: "Oct 30" },
];

const COLUMNS: { name: string; cards: { title: string; due: string; priority: Priority }[] }[] = [
  {
    name: "Today",
    cards: [
      { title: "Fix the login bug reported by support", due: "Today", priority: "High" },
      { title: "Reply to Dana about the Q3 budget", due: "Today", priority: "High" },
      { title: "Send meeting notes to the team", due: "Today", priority: "Medium" },
    ],
  },
  {
    name: "This week",
    cards: [
      { title: "Prepare slides for Monday's review", due: "Mon", priority: "Medium" },
      { title: "Update the onboarding checklist", due: "Wed", priority: "Low" },
    ],
  },
  {
    name: "Later",
    cards: [
      { title: "Renew the design tool license", due: "Oct 30", priority: "Medium" },
      { title: "Book flights for the team offsite", due: "Nov 8", priority: "Low" },
    ],
  },
];

const Check: React.FC<{ size: number; color?: string }> = ({ size, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const Chip: React.FC<{ label: string; color: string; solid?: boolean }> = ({ label, color, solid }) => (
  <span
    style={{
      fontSize: 15,
      fontWeight: 700,
      color: solid ? "#fff" : color,
      background: solid ? color : `${color}22`,
      borderRadius: 999,
      padding: "4px 12px",
    }}
  >
    {label}
  </span>
);

// Geometry (image px) referenced by the demo video.config.json:
//   "Organize my week" button: x 908–1168, y 144–196  (click at 1038, 170)
//   the sorted board (after):  x 112–1168, y 240–770
export const DemoScreen: React.FC<{ state: State }> = ({ state }) => {
  const after = state === "after";
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
          gap: 14,
          fontSize: 26,
          fontWeight: 700,
        }}
      >
        <div style={{ width: 38, height: 38, borderRadius: 11, background: UI.brand, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={24} />
        </div>
        Taskly
        <span style={{ fontWeight: 400, color: UI.muted }}>· {after ? "My week" : "Inbox"}</span>
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
          borderRadius: 14,
        }}
      >
        <div style={{ position: "absolute", left: 32, top: 26 }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{after ? "This week" : "All tasks"}</div>
          <div style={{ fontSize: 18, color: UI.muted, marginTop: 4 }}>
            {after ? "7 tasks · sorted by priority" : "7 tasks · from 5 apps"}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 32,
            top: 24,
            width: 260,
            height: 52,
            borderRadius: 10,
            background: after ? UI.green : UI.brand,
            color: "#fff",
            fontSize: 21,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {after ? (
            <>
              <Check size={22} /> Organized
            </>
          ) : (
            "Organize my week"
          )}
        </div>

        {!after && (
          <div style={{ position: "absolute", left: 32, right: 32, top: 118 }}>
            {INBOX.map((t) => (
              <div
                key={t.title}
                style={{ height: 72, borderBottom: `1px solid ${UI.border}`, display: "flex", alignItems: "center", gap: 18 }}
              >
                <div style={{ width: 26, height: 26, borderRadius: "50%", border: `2.5px solid ${UI.border}` }} />
                <div style={{ flex: 1, fontSize: 24, fontWeight: 600 }}>{t.title}</div>
                <Chip label={t.from} color={UI.muted} />
                <div style={{ width: 110, textAlign: "right", fontSize: 19, color: UI.muted }}>{t.due}</div>
              </div>
            ))}
          </div>
        )}

        {after && (
          <div style={{ position: "absolute", left: 32, right: 32, top: 118, display: "flex", gap: 24 }}>
            {COLUMNS.map((col) => (
              <div key={col.name} style={{ flex: 1, background: UI.bg, borderRadius: 12, padding: 16, height: 498, boxSizing: "border-box" }}>
                <div style={{ fontSize: 21, fontWeight: 700, marginBottom: 14 }}>
                  {col.name} <span style={{ color: UI.muted, fontWeight: 500 }}>· {col.cards.length}</span>
                </div>
                {col.cards.map((c) => (
                  <div
                    key={c.title}
                    style={{
                      background: "#fff",
                      border: `1px solid ${UI.border}`,
                      borderRadius: 10,
                      padding: "14px 16px",
                      marginBottom: 12,
                      height: 112,
                      boxSizing: "border-box",
                    }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.25 }}>{c.title}</div>
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
                      <Chip label={c.priority} color={PRIORITY_COLOR[c.priority]} solid />
                      <span style={{ fontSize: 16, color: UI.muted }}>{c.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {state === "dialog" && (
        <AbsoluteFill style={{ background: "rgba(30, 24, 60, 0.5)" }}>
          <div
            style={{
              position: "absolute",
              left: 260,
              top: 150,
              width: 760,
              height: 600,
              background: "#fff",
              borderRadius: 16,
              padding: "32px 36px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700 }}>Organize my week</div>
            <div style={{ fontSize: 19, color: UI.muted, marginTop: 6 }}>Taskly sorts every task for you.</div>
            <div style={{ marginTop: 34 }}>
              {["Group by priority", "Use due dates", "Balance my workload"].map((o) => (
                <div
                  key={o}
                  style={{ height: 74, borderRadius: 12, border: `1.5px solid ${UI.border}`, marginBottom: 14, display: "flex", alignItems: "center", padding: "0 22px", gap: 18 }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: UI.brand, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={22} />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 600 }}>{o}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 26, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, background: `${UI.green}26`, color: "#12795a", fontWeight: 700, fontSize: 21, borderRadius: 999, padding: "10px 22px" }}>
                <Check size={20} color="#12795a" /> 7 tasks ready
              </span>
              <div style={{ background: UI.brand, color: "#fff", fontWeight: 700, fontSize: 22, borderRadius: 10, padding: "14px 34px" }}>
                Apply
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// Desk illustration with a laptop. The screen corners are in the demo config
// (photo scene "screen.quad") so the screenshot can be mapped onto it.
export const DEMO_DESK_QUAD: Pt[] = [
  [432, 186],
  [1168, 178],
  [1176, 698],
  [424, 704],
];
export const DemoDesk: React.FC = () => {
  const bezel: Pt[] = [
    [410, 164],
    [1190, 154],
    [1200, 720],
    [400, 728],
  ];
  const poly = (pts: Pt[]) => pts.map((p) => p.join(",")).join(" ");
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ece8f4 0%, #ddd6ea 64%, #8a6a52 64%, #6b4e3a 100%)" }}>
      <div style={{ position: "absolute", left: 80, top: 110, width: 190, height: 250, borderRadius: 10, background: "#cfc7e0" }} />
      <div style={{ position: "absolute", left: 1330, top: 90, width: 190, height: 190, borderRadius: "50%", background: "#f6efe0", opacity: 0.85 }} />
      <svg width={1600} height={1067} style={{ position: "absolute", inset: 0 }}>
        <ellipse cx={800} cy={860} rx={620} ry={46} fill="rgba(0,0,0,0.22)" />
        <polygon points={poly(bezel)} fill="#1c1b24" />
        <polygon points={poly(DEMO_DESK_QUAD)} fill="#e7e4f3" />
        <polygon points="330,738 1268,728 1370,862 236,876" fill="#c9c7d4" />
        <polygon points="330,738 1268,728 1272,742 326,752" fill="#a9a7b6" />
        <polygon points="640,806 960,802 976,846 626,850" fill="#b3b1c1" />
      </svg>
      {/* mug */}
      <div style={{ position: "absolute", left: 1330, top: 700, width: 96, height: 104, borderRadius: "8px 8px 22px 22px", background: "#ff7a59" }} />
      <div style={{ position: "absolute", left: 1416, top: 726, width: 36, height: 50, borderRadius: "0 24px 24px 0", border: "10px solid #ff7a59", borderLeft: "none", boxSizing: "border-box" }} />
      {/* plant */}
      <div style={{ position: "absolute", left: 130, top: 590, width: 150, height: 170, borderRadius: "50% 50% 14px 14px", background: "#5d9a6e" }} />
      <div style={{ position: "absolute", left: 160, top: 730, width: 90, height: 100, borderRadius: 12, background: "#b98a66" }} />
      {/* notebook */}
      <div style={{ position: "absolute", left: 1210, top: 850, width: 230, height: 130, borderRadius: 8, background: "#f4efe4", transform: "rotate(-6deg)" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1280,
          height: 900,
          transformOrigin: "0 0",
          transform: quadMatrix3d(1280, 900, DEMO_DESK_QUAD),
          background: "#f5f4fb",
        }}
      >
        <div style={{ height: 80, background: "#fff", borderBottom: "1px solid #e1def0" }} />
        <div style={{ position: "absolute", left: 80, top: 120, width: 1120, height: 740, background: "#fff", borderRadius: 14 }} />
      </div>
    </AbsoluteFill>
  );
};

// Logo: a purely graphic mark (no lettering), like a real logo file would be.
export const DemoLogo: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "#ffffff",
      borderRadius: 80,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 26,
    }}
  >
    <div style={{ width: 92, height: 92, borderRadius: 26, background: "#5b45e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Check size={60} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ width: 210, height: 18, borderRadius: 9, background: "#5b45e0" }} />
      <div style={{ width: 150, height: 18, borderRadius: 9, background: "#ff7a59" }} />
      <div style={{ width: 90, height: 18, borderRadius: 9, background: "#c9c2ee" }} />
    </div>
  </AbsoluteFill>
);
