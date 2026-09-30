// Tiny hex-color helpers for backdrops and tints.
const parse = (hex: string): [number, number, number] => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const withAlpha = (hex: string, a: number) => {
  const [r, g, b] = parse(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/** Mix two hex colors: t=0 -> a, t=1 -> b. */
export const mix = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${m(r1, r2)}, ${m(g1, g2)}, ${m(b1, b2)})`;
};
