// Maintainer tool: regenerates the fictional demo images in ./assets
// (demo app screenshots, desk photo, logo) from src/demo/*.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "assets") });
const jobs = [
  ["DemoScreen", { state: "before" }, "assets/screens/demo-01-before.png"],
  ["DemoScreen", { state: "dialog" }, "assets/screens/demo-02-dialog.png"],
  ["DemoScreen", { state: "after" }, "assets/screens/demo-03-after.png"],
  ["DemoPhoneScreen", { state: "before" }, "assets/screens/demo-phone-before.png"],
  ["DemoPhoneScreen", { state: "after" }, "assets/screens/demo-phone-after.png"],
  ["DemoDesk", {}, "assets/photos/demo-desk.png"],
  ["DemoLogo", {}, "assets/brand/demo-logo.png"],
];
for (const [id, inputProps, out] of jobs) {
  const composition = await selectComposition({ serveUrl, id, inputProps });
  await renderStill({ serveUrl, composition, inputProps, output: path.join(root, out), imageFormat: "png" });
  console.log("  " + out);
}
