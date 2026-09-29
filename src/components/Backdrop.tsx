import { AbsoluteFill } from "remotion";
import { BRAND } from "../config";
import { U } from "../layout";
import { mix, withAlpha } from "../lib/color";

// The area behind screenshots. brand.backdrop picks the look:
//   plain (default) · soft (gentle gradient) · dots · grid · glow (accent halo)
export const Backdrop: React.FC = () => {
  const bg = BRAND.background;
  const kind = BRAND.backdrop ?? "plain";
  let layers: string[] = [];
  let size: string | undefined;
  if (kind === "soft") {
    layers = [`linear-gradient(160deg, ${mix(bg, "#ffffff", 0.6)} 0%, ${bg} 45%, ${mix(bg, BRAND.primary, 0.12)} 100%)`];
  } else if (kind === "glow") {
    layers = [
      `radial-gradient(circle at 50% 42%, ${withAlpha(BRAND.accent, 0.2)} 0%, ${withAlpha(BRAND.accent, 0)} 58%)`,
      `linear-gradient(180deg, ${mix(bg, "#ffffff", 0.4)} 0%, ${mix(bg, BRAND.primary, 0.1)} 100%)`,
    ];
  } else if (kind === "dots") {
    layers = [`radial-gradient(${withAlpha(BRAND.primary, 0.16)} ${2.2 * U}px, transparent ${2.8 * U}px)`];
    size = `${30 * U}px ${30 * U}px`;
  } else if (kind === "grid") {
    const line = withAlpha(BRAND.primary, 0.07);
    layers = [
      `linear-gradient(${line} ${1.5 * U}px, transparent ${1.5 * U}px)`,
      `linear-gradient(90deg, ${line} ${1.5 * U}px, transparent ${1.5 * U}px)`,
    ];
    size = `${44 * U}px ${44 * U}px`;
  }
  return <AbsoluteFill style={{ backgroundColor: bg, backgroundImage: layers.join(", ") || undefined, backgroundSize: size }} />;
};
