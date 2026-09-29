// Helpers shared by the render scripts.
import { bundle } from "@remotion/bundler";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../..", import.meta.url));
export const readConfig = () => JSON.parse(readFileSync(path.join(root, "video.config.json"), "utf8"));

export const slug = (s) =>
  String(s ?? "video")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "video";

export const FORMATS = ["portrait", "square", "landscape"];

/** "--name value" and "--name=value" flags; everything else is returned in `rest`. */
export const parseArgs = (argv) => {
  const flags = {};
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, inline] = a.slice(2).split("=");
      flags[k] = inline ?? (argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true);
    } else rest.push(a);
  }
  return { flags, rest };
};

/** Bundle the project once; format and variant are passed per render (see envFor). */
export const bundleOnce = () => bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "assets") });

/** Remotion "envVariables" that pick the format / variant for one render. */
export const envFor = ({ format, variant }) => ({ REMOTION_FORMAT: format ?? "", REMOTION_VARIANT: variant ?? "" });
