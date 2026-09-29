import { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { BRAND } from "../config";

// Loads the brand font (any Google Fonts family) and holds rendering until
// it's ready, so no frame is rendered with a fallback font.
export const FONT = `"${BRAND.font}", "Segoe UI", Arial, sans-serif`;

export const FontLoader: React.FC = () => {
  const [handle] = useState(() => delayRender(`Loading font ${BRAND.font}`));
  useEffect(() => {
    const family = BRAND.font.replace(/ /g, "+");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;600;700;800&display=block`;
    document.head.appendChild(link);
    const done = () => continueRender(handle);
    link.onload = () => {
      Promise.all(["400", "700", "800"].map((w) => document.fonts.load(`${w} 40px "${BRAND.font}"`)))
        .then(done)
        .catch(done);
    };
    link.onerror = done; // offline: fall back to system font rather than hang
  }, [handle]);
  return null;
};
