// "Is everything ready?" — checks the computer and explains, in plain words,
// what is missing and how to fix it. Run by the setup scripts; also: npm run doctor
import { existsSync, statfsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
let problems = 0;
const ok = (m) => console.log(`  ✓ ${m}`);
const warn = (m, fix) => console.log(`  ! ${m}${fix ? `\n      → ${fix}` : ""}`);
const bad = (m, fix) => {
  problems++;
  console.log(`  ✗ ${m}${fix ? `\n      → ${fix}` : ""}`);
};

console.log("\nChecking your computer…\n");

// Node
const major = Number(process.versions.node.split(".")[0]);
if (major >= 18) ok(`Node.js ${process.versions.node}`);
else bad(`Node.js ${process.versions.node} is too old (18 or newer needed)`, "Install the LTS version from nodejs.org, then run this again.");

// Project folder
const rootPath = root.replace(/[\\/]$/, "");
if (process.platform === "win32" && rootPath.length > 60)
  warn(`This folder path is long (${rootPath.length} characters): ${rootPath}`, "Long paths break some tools on Windows. Move the folder to something short like C:\\Users\\<you>\\feature-video-studio.");
else ok("Folder location");
if (/[^\x00-\x7F]/.test(rootPath)) warn("The folder path has special characters (accents, symbols)", "If something fails, move the folder to a plain path like C:\\videos\\studio.");

// Installed engine
if (existsSync(path.join(root, "node_modules", "remotion"))) ok("Video engine installed");
else bad("The video engine is not installed yet", "Run the setup file (setup-windows.bat / setup-mac.command), or ask Claude: \"install the video engine\".");

// Rendering browser
if (existsSync(path.join(root, "node_modules", "@remotion", "renderer"))) {
  try {
    const { ensureBrowser } = await import("@remotion/renderer");
    let downloading = false;
    await ensureBrowser({
      onBrowserDownload: () => {
        downloading = true;
        console.log("  … downloading the rendering browser (one time, about 90 MB)");
        return { version: null, onProgress: () => {} };
      },
    });
    ok(downloading ? "Rendering browser downloaded" : "Rendering browser ready");
  } catch (e) {
    bad("The rendering browser could not be prepared", `Check your internet connection and run "npm run doctor" again. (${String(e.message ?? e).split("\n")[0]})`);
  }
}

// Disk space
try {
  const s = statfsSync(root);
  const gb = (s.bavail * s.bsize) / 1e9;
  if (gb < 2) bad(`Only ${gb.toFixed(1)} GB free on this disk`, "Free some space (videos need about 1 GB while rendering).");
  else ok(`${gb.toFixed(0)} GB free`);
} catch {
  /* not available on this system — skip */
}

// Internet (fonts)
try {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 5000);
  const r = await fetch("https://fonts.googleapis.com/css2?family=Inter", { signal: c.signal });
  clearTimeout(t);
  if (r.ok) ok("Internet connection (fonts)");
  else warn("Google Fonts did not answer", "Videos will fall back to a default font until it is reachable.");
} catch {
  warn("No internet connection to Google Fonts", "Videos need it to load your brand font. Connect and try again before rendering.");
}

console.log(problems ? `\n${problems} thing(s) to fix — see the arrows above.\n` : "\nAll good. You can make videos.\n");
process.exit(problems ? 1 : 0);
