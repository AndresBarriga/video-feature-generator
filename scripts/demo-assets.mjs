// Maintainer tool: regenerates the fictional demo images in ./assets
// (demo app screenshots, desk photo, logo) from src/demo/*.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "assets") });
const jobs = [
  ["DemoScreen", { state: "empty" }, "assets/screens/demo-01-empty.png"],
  ["DemoScreen", { state: "scan" }, "assets/screens/demo-02-scan.png"],
  ["DemoScreen", { state: "filled" }, "assets/screens/demo-03-filled.png"],
  ["DemoDesk", {}, "assets/photos/demo-desk.png"],
  ["DemoLogo", {}, "assets/brand/demo-logo.png"],
];
for (const [id, inputProps, out] of jobs) {
  const composition = await selectComposition({ serveUrl, id, inputProps });
  await renderStill({ serveUrl, composition, inputProps, output: path.join(root, out), imageFormat: "png" });
  console.log("  " + out);
}
