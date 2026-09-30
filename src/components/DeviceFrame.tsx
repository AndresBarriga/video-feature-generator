import type { CSSProperties } from "react";
import type { Device } from "../config";
import { FONT } from "./FontLoader";

// Frames drawn around a screenshot. Everything is sized relative to the
// screenshot as it appears on screen: (left, top) = its top-left corner,
// (w, h) = its size in video pixels. <DeviceBack> goes behind the image,
// <DeviceFront> (camera, island) on top of it.

const DARK = "#15161b";
const SHADOW = "0 18px 50px rgba(20, 30, 50, 0.28)";

type P = { device: Device; left: number; top: number; w: number; h: number; opacity?: number; url?: string };

/** Space the frame adds around the screenshot, in screenshot pixels (so layout can center the whole device). */
export const deviceExtent = (d: Device, w: number, h: number) => {
  const short = Math.min(w, h);
  switch (d) {
    case "phone": {
      const b = w * 0.035;
      return { top: b, bottom: b, left: b, right: b };
    }
    case "tablet-portrait":
    case "tablet-landscape": {
      const b = short * 0.045;
      return { top: b, bottom: b, left: b, right: b };
    }
    case "browser":
      return { top: w * 0.052, bottom: 0, left: 0, right: 0 };
    case "laptop": {
      const b = w * 0.016;
      return { top: b, bottom: b + w * 0.03, left: w * 0.07, right: w * 0.07 };
    }
    case "monitor": {
      const b = w * 0.014;
      return { top: b, bottom: b + w * 0.03 + w * 0.09 + w * 0.016, left: b, right: b };
    }
  }
};

/** CSS border-radius of the screenshot itself, so it sits inside the frame's screen. */
export const imageRadius = (d: Device | undefined, w: number, h: number, fallback: number): number | string => {
  switch (d) {
    case "phone":
      return w * 0.11;
    case "tablet-portrait":
    case "tablet-landscape":
      return Math.min(w, h) * 0.035;
    case "browser":
      return `0 0 ${w * 0.012}px ${w * 0.012}px`;
    case "laptop":
    case "monitor":
      return w * 0.004;
    default:
      return fallback;
  }
};

const box = (l: number, t: number, w: number, h: number, extra: CSSProperties): CSSProperties => ({
  position: "absolute",
  left: l,
  top: t,
  width: w,
  height: h,
  ...extra,
});

export const DeviceBack: React.FC<P> = ({ device, left, top, w, h, opacity = 1, url }) => {
  const short = Math.min(w, h);
  switch (device) {
    case "phone": {
      const b = w * 0.035;
      return <div style={box(left - b, top - b, w + b * 2, h + b * 2, { borderRadius: w * 0.11 + b, background: DARK, boxShadow: SHADOW, opacity })} />;
    }
    case "tablet-portrait":
    case "tablet-landscape": {
      const b = short * 0.045;
      return <div style={box(left - b, top - b, w + b * 2, h + b * 2, { borderRadius: short * 0.035 + b, background: DARK, boxShadow: SHADOW, opacity })} />;
    }
    case "browser": {
      const bh = w * 0.052;
      const r = w * 0.012;
      const dot = w * 0.0085;
      return (
        <div
          style={box(left, top - bh, w, h + bh, {
            borderRadius: r,
            background: "#eceef2",
            boxShadow: SHADOW,
            opacity,
            overflow: "hidden",
            fontFamily: FONT,
          })}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div key={c} style={box(w * 0.02 + i * dot * 2.8, bh / 2 - dot, dot * 2, dot * 2, { borderRadius: "50%", background: c })} />
          ))}
          <div
            style={box(w * 0.12, bh * 0.2, w * 0.62, bh * 0.6, {
              borderRadius: bh * 0.3,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              paddingLeft: bh * 0.3,
              fontSize: bh * 0.34,
              color: "#5b6070",
              whiteSpace: "nowrap",
            })}
          >
            {url ?? ""}
          </div>
        </div>
      );
    }
    case "laptop": {
      const b = w * 0.016;
      const baseH = w * 0.03;
      return (
        <>
          <div style={box(left - b, top - b, w + b * 2, h + b * 2, { borderRadius: w * 0.018, background: DARK, boxShadow: SHADOW, opacity })} />
          <div
            style={box(left - w * 0.07, top + h + b, w * 1.14, baseH, {
              borderRadius: `0 0 ${w * 0.03}px ${w * 0.03}px`,
              background: "linear-gradient(180deg, #dcdde3 0%, #b7b9c3 100%)",
              boxShadow: "0 14px 30px rgba(20,30,50,0.25)",
              opacity,
            })}
          />
          <div
            style={box(left + w / 2 - w * 0.07, top + h + b, w * 0.14, w * 0.008, {
              borderRadius: `0 0 ${w * 0.01}px ${w * 0.01}px`,
              background: "#9a9cab",
              opacity,
            })}
          />
        </>
      );
    }
    case "monitor": {
      const b = w * 0.014;
      const chin = w * 0.03;
      const neckH = w * 0.09;
      const y = top + h + b + chin;
      return (
        <>
          <div style={box(left - b, top - b, w + b * 2, h + b * 2 + chin, { borderRadius: w * 0.012, background: DARK, boxShadow: SHADOW, opacity })} />
          <div style={box(left + w / 2 - w * 0.05, y - 2, w * 0.1, neckH, { background: "linear-gradient(90deg, #b9bbc6, #e2e3e9, #b9bbc6)", opacity })} />
          <div
            style={box(left + w / 2 - w * 0.16, y + neckH - 2, w * 0.32, w * 0.016, {
              borderRadius: w * 0.01,
              background: "linear-gradient(180deg, #e2e3e9, #a9abb8)",
              boxShadow: "0 10px 24px rgba(20,30,50,0.25)",
              opacity,
            })}
          />
        </>
      );
    }
  }
};

export const DeviceFront: React.FC<P> = ({ device, left, top, w, h, opacity = 1 }) => {
  const short = Math.min(w, h);
  switch (device) {
    case "phone":
      return <div style={box(left + w / 2 - w * 0.14, top + w * 0.03, w * 0.28, w * 0.075, { borderRadius: 999, background: DARK, opacity })} />;
    case "tablet-portrait": {
      const b = short * 0.045;
      const d = short * 0.014;
      return <div style={box(left + w / 2 - d / 2, top - b / 2 - d / 2, d, d, { borderRadius: "50%", background: "#2c2e37", opacity })} />;
    }
    case "tablet-landscape": {
      const b = short * 0.045;
      const d = short * 0.014;
      return <div style={box(left - b / 2 - d / 2, top + h / 2 - d / 2, d, d, { borderRadius: "50%", background: "#2c2e37", opacity })} />;
    }
    case "laptop": {
      const b = w * 0.016;
      const d = w * 0.005;
      return <div style={box(left + w / 2 - d / 2, top - b / 2 - d / 2, d, d, { borderRadius: "50%", background: "#2c2e37", opacity })} />;
    }
    default:
      return null;
  }
};
