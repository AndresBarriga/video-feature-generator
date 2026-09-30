// Renders out/brand-preview.png: the brand kit (brand.json + this video's overrides) as a video would show it.
//   npm run brand:preview
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { bundleOnce, envFor, root } from "./lib/common.mjs";

const out = path.join(root, "out", "brand-preview.png");
mkdirSync(path.dirname(out), { recursive: true });
const serveUrl = await bundleOnce();
const envVariables = envFor({});
const composition = await selectComposition({ serveUrl, id: "BrandPreview", envVariables });
await renderStill({ serveUrl, composition, envVariables, output: out, imageFormat: "png" });
console.log("  " + path.relative(root, out));
