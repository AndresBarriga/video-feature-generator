// Click-to-place tool: a small page where you click on your screenshots to set
// where the cursor clicks, what gets highlighted, callouts, typed text, the
// camera focus and the screen corners in a photo. It writes the numbers into
// video.config.json for you.
//   npm run place            -> prints the address (default http://localhost:4173)
//   npm run place -- --open  -> also opens it in your browser
// Everything stays on this computer (the server only listens on localhost).
import { createServer } from "node:http";
import { createServer as netServer } from "node:net";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const cfgPath = path.join(root, "video.config.json");
const assets = path.join(root, "assets");
const flag = (n) => process.argv.includes(`--${n}`);
const flagVal = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

const TYPES = { ".html": "text/html; charset=utf-8", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
// Fields the tool is allowed to write, per scene type.
const FIELDS = { screen: ["clicks", "highlights", "callouts", "typing", "focus", "detail"], photo: ["screen"] };

// JSON in the same style as the hand-written configs: short arrays/objects on one line.
const inline = (v) =>
  Array.isArray(v) ? `[${v.map(inline).join(", ")}]` : v && typeof v === "object" ? `{ ${Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}: ${inline(x)}`).join(", ")} }` : JSON.stringify(v);
const depth = (v) => (v && typeof v === "object" ? 1 + Math.max(0, ...Object.values(v).map(depth)) : 0);
const fmt = (v, ind = "") => {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  const one = inline(v);
  if (depth(v) <= 3 && one.length + ind.length <= 96) return one;
  const pad = ind + "  ";
  if (Array.isArray(v)) return v.length ? `[\n${v.map((x) => pad + fmt(x, pad)).join(",\n")}\n${ind}]` : "[]";
  const e = Object.entries(v);
  return e.length ? `{\n${e.map(([k, x]) => `${pad}${JSON.stringify(k)}: ${fmt(x, pad)}`).join(",\n")}\n${ind}}` : "{}";
};

const readCfg = () => JSON.parse(readFileSync(cfgPath, "utf8"));
const send = (res, code, body, type = "application/json") => {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};
const body = (req) =>
  new Promise((resolve, reject) => {
    let s = "";
    req.on("data", (c) => {
      s += c;
      if (s.length > 1e6) reject(new Error("too large"));
    });
    req.on("end", () => resolve(s ? JSON.parse(s) : {}));
  });

let backedUp = false;
let port = 0;
const server = createServer(async (req, res) => {
  try {
    // Only answer requests addressed to localhost (blocks other sites from talking to it).
    if (!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.host ?? "")) return send(res, 403, { error: "forbidden" });
    const url = new URL(req.url, "http://localhost");
    if (req.method === "GET" && url.pathname === "/") return send(res, 200, readFileSync(path.join(root, "tools", "place.html")), TYPES[".html"]);
    if (req.method === "GET" && url.pathname === "/api/config") {
      const manifest = JSON.parse(readFileSync(path.join(assets, "manifest.json"), "utf8"));
      return send(res, 200, { config: readCfg(), manifest });
    }
    if (req.method === "GET" && url.pathname.startsWith("/assets/")) {
      const file = path.normalize(path.join(assets, decodeURIComponent(url.pathname.slice(8))));
      if (!file.startsWith(assets + path.sep) || !existsSync(file)) return send(res, 404, { error: "not found" });
      return send(res, 200, readFileSync(file), TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream");
    }
    if (req.method === "POST" && url.pathname === "/api/save") {
      const { index, fields } = await body(req);
      const cfg = readCfg();
      const scene = cfg.scenes?.[index];
      if (!scene || !FIELDS[scene.type]) return send(res, 400, { error: "that scene can't be edited here" });
      if (!backedUp) {
        mkdirSync(path.join(root, "out"), { recursive: true });
        copyFileSync(cfgPath, path.join(root, "out", "video.config.backup.json"));
        backedUp = true;
      }
      for (const [k, v] of Object.entries(fields ?? {})) {
        if (!FIELDS[scene.type].includes(k)) return send(res, 400, { error: `field "${k}" not allowed` });
        if (v === null || (Array.isArray(v) && v.length === 0)) delete scene[k];
        else scene[k] = v;
      }
      writeFileSync(cfgPath, fmt(cfg) + "\n");
      return send(res, 200, { ok: true });
    }
    if (req.method === "POST" && url.pathname === "/api/quit") {
      send(res, 200, { ok: true });
      console.log("\nDone — positions saved in video.config.json.");
      setTimeout(() => process.exit(0), 300);
      return;
    }
    send(res, 404, { error: "not found" });
  } catch (e) {
    send(res, 500, { error: String(e.message ?? e) });
  }
});

// first free port from 4173
const free = (p) =>
  new Promise((ok) => {
    const t = netServer();
    t.once("error", () => ok(false));
    t.once("listening", () => t.close(() => ok(true)));
    t.listen(p, "127.0.0.1");
  });
port = Number(flagVal("port") ?? 4173);
while (!(await free(port))) port++;
server.listen(port, "127.0.0.1", () => {
  const addr = `http://localhost:${port}`;
  console.log(`\nPlacement tool ready: ${addr}`);
  console.log("Click where things go; it saves as you go. Press Finish in the page (or Ctrl+C here) when done.\n");
  if (flag("open")) {
    const [cmd, args] = process.platform === "darwin" ? ["open", [addr]] : process.platform === "win32" ? ["cmd", ["/c", "start", "", addr]] : ["xdg-open", [addr]];
    spawn(cmd, args, { stdio: "ignore", detached: true }).unref();
  }
});
