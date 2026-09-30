---
name: make-video
description: Guided workflow that turns screenshots of an app into a short, polished feature video (LinkedIn / website / presentation). Interviews the user, writes the script with them, tells them exactly which screenshots to take, builds video.config.json, shows test frames and renders the MP4. Use when the user wants to create, make or edit a feature video, product clip, launch video or demo video in this repo, or types /make-video.
---

# Make a feature video

You are guiding a person who is probably **not technical** (marketing, product,
sales). They talk to you; you do everything else. Never ask them to edit code,
open a terminal or understand JSON. Speak plainly, in their language. On-screen
text in the video is in the language they choose (default English).

The engine is already built. A video = `video.config.json` + images in
`assets/`. You only write config and place images. Full field list:
`docs/CONFIG-REFERENCE.md`. Craft rules: `references/craft-rules.md` (read it
before writing the script). Script patterns: `references/script-patterns.md`.

## Golden rules (from real production experience)
1. **Gates.** Never skip ahead. Get an explicit OK after the script (step 3)
   and after test frames (step 6). Rendering the final video comes last.
2. **Show, don't tell.** After any change, render stills and SHOW them (read the
   PNGs and summarize what's in them), don't just describe what you changed.
3. **One feature per video, ~12–20 s.** Propose splitting if they list many.
4. **Fictional data only** in screenshots — never real customer or user data.
   Remind them before they take screenshots.
5. **Never recreate a logo with text.** Use their logo file; if missing, leave
   it out and say so.
6. **Ask when unsure** — a 10-second question beats a wrong render.

## Step 0 — Setup check (silent unless something is wrong)
- Run `node -v` (needs 18+). If missing: tell them to run `setup-windows.bat`
  (Windows) or `setup-mac.command` (Mac) from the repo folder, or install Node
  LTS from nodejs.org. Stop until fixed.
- If `node_modules/` is missing, run `npm install` (takes ~1 min; say so).
- If anything about setup looks off (first run, an error about the browser,
  fonts, disk), run `npm run doctor`: it checks everything and says in plain
  words what to fix.
- If they want to start fresh, run `node scripts/new-video.mjs <name>` — it
  archives the current config to `videos/<old title>/` and starts a blank one.
  After the script is agreed (Step 3) use `--template <kind>` to start from the
  matching ready-made structure instead.

## Step 1 — Interview (short, friendly; use AskUserQuestion with options)
Ask only what you can't infer. Group into 1–2 rounds:
- **What feature** and **what problem it solves** (one sentence each).
- **Who watches** (e.g. team leads, IT buyers, existing customers).
- **What kind of video** → picks the template: `problem-solution` (default),
  `launch` (announcement), `tutorial` (how to), `comparison` (old vs new way),
  `before-after` (short), `mobile` (phone app). See `references/script-patterns.md`.
- **Where it's posted** → format: LinkedIn/Instagram feed = `portrait` (4:5,
  default); `square`; website/YouTube/slides = `landscape`. Offer "all three
  formats" — it's one command (Step 7).
- **Other languages?** (optional) → a `variants` entry per language (Step 7).
- **What device is the product used on** → decides the frame: none (plain
  screenshot), `browser`, `laptop`, `monitor`, `phone`, `tablet-portrait`,
  `tablet-landscape`.
- **Call to action** for the end card ("Try it free", "Book a demo", "Available now", URL?).
- **Brand**: logo file? colors? font? A brand-book PDF or website is fine —
  extract colors/fonts/logo from it (see "Brand kit" below).
- **A real-world photo** for the opening (optional but recommended): a
  photo of the product in use (a laptop on a desk, a phone in hand, a shop
  counter, a workshop) — ideally with the device screen visible. AI-generated is fine if they have the rights.

## Step 2 — Brand kit
- Colors → `brand.primary` (band + end card, usually the darkest brand color),
  `brand.accent` (keywords, CTA button, cursor ripple — the most vivid brand
  color), `brand.success` (checks/success glows), `brand.background` (light).
- Font → any Google Fonts family name (`brand.font`). If their font isn't on
  Google Fonts, pick the closest one and say so.
- Logo → copy into `assets/brand/`, set `brand.logo`. From a PDF brand book you
  may export the logo artwork (e.g. with PyMuPDF at 300 dpi, transparent) —
  that is using their artwork, not recreating it.
- Brand colors are for the video "chrome" (band, highlights, end card). The
  app screenshots stay exactly as they are.

## Step 3 — Script together (GATE)
Propose a table: beat, seconds, what's on screen, caption (with **keywords**),
optional sub-line. Use the pattern in `references/script-patterns.md`:
hook (problem) → action → result → (optional objection/fit) → payoff → end card.
Rules: captions ≤ ~7 words per line, max 2 lines, one idea per beat, keywords
in `**bold**` (1–2 per caption), same caption across connected beats (it stays
on screen without re-animating). Ask: "Does this story work? What would you
change?" Iterate until they say OK. Write the agreed script to
`videos/<slug>/script.md` for reference.

## Step 4 — Screenshot checklist
Tell them EXACTLY what to capture, per beat, as a numbered list, e.g.:
"1. The list BEFORE (messy, nothing set up yet). 2. The dialog or step in
progress. 3. The result AFTER (everything filled in)." Tips to give:
- Same window size for all screenshots of the same screen (states must line up).
- Fictional demo data. Close notifications. Browser zoom 100–125%.
- Full window screenshots are fine — you'll crop.
- Drop files into `assets/screens/` (photo into `assets/photos/`, logo into
  `assets/brand/`) — or just attach them in the chat and you copy them there.
Wait until you have every image. Check each one visually and say if one is
wrong (wrong state, real data visible, cropped too tight) before building.
Then run `npm run check`: it is also the screenshot assistant — it reports
screenshots of different sizes, low resolution, portrait/landscape mismatches
with the chosen device, photo-screen corners in the wrong order or a different
shape than the screenshot, and captions too short to be read. Fix or ask for a
retake before continuing; explain each warning in plain words.

## Step 5 — Build
1. Run `node scripts/prepare-assets.mjs` (indexes image sizes).
2. Write `video.config.json` scene by scene:
   - `photo` scene first if they gave a photo: set `screen.quad` to the 4
     corners of the device screen in the photo (TL, TR, BR, BL, in photo
     pixels) and `diveIntoNext: true` so it lands on the first screen scene.
     Measure corners by viewing the photo; for precision the user (or you) can
     use `tools/picker.html`. Keep `pushIn` ~1.06–1.1, 2.5–3 s.
   - `screen` scenes: pick `focus` to crop to the part that matters (bigger UI
     = readable on a phone). Add `clicks` where the user would click (cursor
     leads every click), `highlights` for what to notice, `states` for
     before/after of the same screen, `zoomTo` 1.05–1.12 for slow push-ins.
   - `device` draws a frame around the screenshot: `phone` (portrait shots;
     see `examples/mobile.config.json`), `tablet-portrait`, `tablet-landscape`,
     `browser` (add `url`), `laptop`, `monitor`. Use the same device on all
     screens of a video. Don't use `focus` to crop the frame away.
   - `callouts` ("look here" label + arrow at a point), `detail` (camera glides
     to a small part of the screen) and `typing` (text typed into a field; use
     `clear` to hide the placeholder) — see `examples/showcase.config.json`.
     Use them sparingly: one per scene at most; the cursor still leads every click.
   - `brand.backdrop` (`soft`, `dots`, `grid`, `glow`) gives the area behind
     screenshots a designed look. `soft` is a safe default.
   - Exporting several formats? Give every `focus` a `height` too, so the area
     also fits square and landscape.
   - `transitionIn`: `cut` by default; `slide-up` when a dialog/modal opens;
     `slide-left` for "next step". Never cross-fades.
   - `end` scene last: headline, tagline, subline, cta, optional url,
     `backgroundImage` = the opening photo (it's blurred automatically).
3. Run `npm run check` and fix every error it reports.

Coordinates are always in **pixels of the original image**. Get sizes from
`assets/manifest.json`.

**Let the user place things by clicking (preferred).** Once the scenes exist in
`video.config.json` with their `image` and captions, don't guess positions:
1. Run `npm run place` in the background. It serves the placement page on
   localhost (prints the address, normally http://localhost:4173) and stays
   running until the user presses **Finish**.
2. Open that address in the built-in browser pane (or give it to the user).
3. Tell them, per scene, what to click: the button the cursor should press, a
   box around what to notice, the exact spot a label points at, a box over a
   field for typed text, the crop, and the 4 corners of the device screen in
   the photo (top-left, top-right, bottom-right, bottom-left). It saves as they
   go and every mark can be dragged, edited or deleted.
4. When they say they're done (or press Finish), re-read `video.config.json`:
   the tool wrote `clicks`, `highlights`, `callouts`, `typing`, `focus`, `detail`
   and `screen.quad`. Then run `npm run check` and `npm run stills`.
Fall back to estimating from the image yourself only for small tweaks, or if
the page can't be opened; then verify carefully with stills and correct.

## Step 6 — Test frames (GATE)
Run `npm run stills` → PNGs in `out/stills/` (middle of each scene + every
click). Read them yourself first and fix obvious problems (cursor not on the
button, highlight misplaced, caption too long, UI too small). Then show them to
the user (send the files if you can) with a one-line description each, and ask
for feedback. Specific frames: `npm run stills -- 40 120`.
Offer `npm run preview` if they want to scrub the timeline themselves
(opens Remotion Studio in the browser).

## Step 7 — Render and deliver
`npm run render` → `out/video.mp4` (H.264, yuv420p — correct colors on social).
Copy it to `videos/<slug>/<slug>.mp4` with a clear name. Tell them where it is,
its length and size, and offer the extras (all are one command):
- **All formats at once:** `npm run render:all` → portrait + square + landscape in
  `videos/<slug>/exports/`. Show `npm run stills -- --format landscape` first if
  they haven't seen the wide version.
- **Poster / thumbnail:** `npm run cover` → a PNG per format (headline + hero
  screenshot). Set `cover` in the config to change its texts.
- **Other language or a shorter cut:** add a `variants` entry (translate the
  captions/end card in `scenes`; or `drop` scenes / `targetSeconds` for a short
  version), run `npm run check` and `npm run stills -- --variant <name>`, show
  the frames, then `npm run render:all -- --variants <name>` (or `--only-variants`).
If a render fails with EPERM/rename, the old MP4 is open in a player — close it
or render to a new name.

## Editing an existing video
Read `video.config.json`, apply the change, run `npm run stills` for the
affected scenes, show, then render. Common asks and where they live:
caption/sub → `caption`/`sub`; timing → `seconds`; slower zoom → `zoomTo`;
different crop → `focus`; click position → `clicks`; end text → end scene.

## When the engine can't do it
If they need something the config can't express (e.g. a UI that must animate
field by field, a custom illustration, a chart that draws itself), explain the
trade-off and offer to build a custom scene following `docs/BUILD-GUIDE.md`
(section "Custom scenes"). That takes much longer and uses more of their Claude
usage — say so before starting.
