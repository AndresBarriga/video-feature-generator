# Feature Video Studio

**Turn screenshots of your app into a short, polished feature video — just by chatting with Claude.**

No video editing, no code. You describe the feature, Claude writes the script
with you, tells you exactly which screenshots to take, builds the video, shows
you test frames, and delivers an MP4 ready for LinkedIn, your website or a
presentation.

**Example 1 — a demo for a fictional task app:**

![Example frames: Taskly demo](docs/example-frames.png)

▶ [Watch the demo video](docs/demo-video.mp4) (14 s, 4:5)

**Example 2 — this repo's own intro, made with the tool itself:**

![Example frames: the intro video](docs/example-frames-intro.png)

▶ [How it works: from a GitHub link to a finished video](docs/feature-video-studio-intro.mp4) (18 s, 4:5 for LinkedIn)

It runs on **your own Claude subscription** (Claude Code in the Claude desktop
app) — no API keys, no per-video fees. Rendering happens on your computer.

---

## Contents

[Get started](#get-started) · [What happens, step by step](#what-happens-step-by-step) ·
[What you can do](#what-you-can-do) · [Your brand kit](#your-brand-kit) ·
[Asking for changes](#asking-for-changes) · [Commands](#commands) ·
[What's in the folder](#whats-in-the-folder) · [Good to know](#good-to-know) · [More](#more)

## Get started

**You need (once):**
1. **The Claude desktop app** with Claude Code (the **Code** tab), included in
   Claude Pro / Max / Team / Enterprise plans → [claude.ai/download](https://claude.ai/download)
2. **Node.js (LTS version)**, a free helper program that builds the video →
   [nodejs.org](https://nodejs.org) → download the **LTS** installer → next, next, finish.

**Then, either way:**

- **Let Claude install it.** In the Claude app, start a session and write:
  *"Install https://github.com/AndresBarriga/video-feature-generator and start /make-video"*.
  Claude downloads the folder, switches to it, installs what's needed (1–2 minutes the
  first time, plus a ~90 MB download of a small rendering browser) and starts the
  guided flow. Approve the permission prompts it shows.
- **Or do it by hand.** On GitHub click **Code → Download ZIP**, unzip it somewhere
  with a short path (e.g. `Documents\video-feature-generator`), double-click
  **`setup-windows.bat`** (Windows) or **`setup-mac.command`** (Mac), then open the
  folder in the Claude app (**Code** tab) and type **`/make-video`**.

> **Try the demo first:** type *"Render the demo video"* — you get a sample video for
> a fictional task app in a couple of minutes. A full first video takes **30–60
> minutes** (mostly script and screenshots), less after that.

Something wrong with the setup? Ask Claude *"check my setup"* (it runs `npm run doctor`,
which tells you in plain words what to fix). Step-by-step: [Quick start](docs/QUICKSTART.md).

## What happens, step by step

You talk; Claude does the work. There are **two approval points** — nothing is
rendered until you've said OK to the script and to the test frames.

1. **Setup check.** Node, the video engine and the rendering browser (silent unless
   something is wrong).
2. **Questions about the content** (multiple choice, every option has a recommended
   default): the feature and the problem it solves, who watches, the **kind of video**
   (problem → solution, launch, tutorial, old vs new way, before/after, mobile app),
   **which format(s) you need** (only those are rendered), the device the product
   runs on, other languages, the call to action, and whether you have a photo for
   the opening.
3. **Your brand — asked once, then saved.** Logo, colors, font, tone and things to
   avoid. Claude reads them from your website or brand guidelines if you give a link,
   saves them in `brand.json`, and shows **one preview image** to approve. Every later
   video reuses it. → [Your brand kit](#your-brand-kit)
4. **Look and framing.** How it opens (photo or straight to the screen), the pace
   (calm, standard, snappy), whole screens or cropped to the part that matters, the
   frame around the screenshots, the background, what draws the eye (cursor, highlight
   boxes, labels, zoom), how captions appear, and how the end card looks.
5. **The script — approval point 1.** A short table: each beat, how long, what's on
   screen, the caption. Change anything; nothing is built until you say OK.
6. **The screenshot list.** Exactly which screens and states to capture (fictional
   data only). Claude then **checks your images** and tells you in plain words if one
   should be retaken: different sizes, too small, wrong orientation for the device,
   captions too short to read.
7. **Build.** Claude puts the video together. To position things it opens a small
   **click-to-place page** (inside the Claude app's browser pane): you click where
   the cursor should press, draw a box around what to highlight, point a label, box
   a field for typed text, and mark the screen of a device in your photo. It saves
   as you click.
8. **Test frames — approval point 2.** Still images of every scene, in every format
   you chose. Ask for changes in plain words.
9. **Render and deliver.** Only the formats you picked, into `videos/<your video>/exports/`.
   Then, on request: a **cover image**, a version in **another language**, a
   **shorter cut**, or another format.

## What you can do

**Video kinds (ready-made structures):** problem → solution, launch announcement,
quick tutorial, old way vs new way, before/after, mobile app. Claude adapts the
structure to your feature.

**Scenes:**
- A **real-world photo** that slowly pushes in and dives into the device screen, landing
  on your first screenshot with no visible cut.
- **Screenshots** with a slow zoom, a crop to the part that matters, and state changes
  (before → after of the same screen).
- **End card** with logo, headline, tagline, call to action and URL.

**A frame around your screenshots:** browser window (with address bar), laptop,
desktop monitor, phone, iPad portrait, iPad landscape — or none.

**Looks:** backdrop behind the screenshots (plain, soft gradient, dots, grid, glow);
captions that enter word by word with a self-drawing underline on the keywords
(or slide up whole); a silent video of 12–20 s that reads well on a phone.

**What draws the eye** (one per scene reads best): a **cursor** that glides to each
click and ripples, **highlight boxes**, **"look here" labels** with an arrow, a
**glide to a detail**, and **text typed into a field** letter by letter.

**Formats:** portrait 4:5 (LinkedIn/Instagram feed), square 1:1, landscape 16:9
(website, YouTube, slides). Claude asks which you need.

**Variants of the same video:** other languages, or a shorter cut (drop scenes or fit
a target length) — described as changes to one config, never as copies.

**Cover image:** a poster/thumbnail with the headline and a hero screenshot, per format.

**Safety nets:** plain-language checks of your screenshots and settings (including
caption reading time and brand contrast), a setup doctor, and the two approval points.

## Your brand kit

The brand is saved once in **`brand.json`** and used by every video:

| | |
|---|---|
| **Logo** | Your real file in `assets/brand/` (never a logo typed in a font; none is fine) |
| **Colors** | `primary` (caption band, end card), `accent` (keywords, button, cursor), `success`, `background` |
| **Font** | Any Google Fonts family |
| **Backdrop** | plain · soft · dots · grid · glow |
| **Tone** | sober · friendly · technical — guides how Claude words the captions |
| **Notes** | Anything to avoid ("no exclamation marks", words never to use) |

Claude fills it in a short question round (from your website or brand guidelines, a
suggested palette, or hex codes you type), checks the contrast, and shows a preview
image (`npm run brand:preview`). A single video can override any field. Until a real
brand is saved, videos use a neutral default and `npm run check` tells you so.
Details: [Config reference → Brand kit](docs/CONFIG-REFERENCE.md#brand-kit-brandjson).

## Asking for changes

Be specific about *what* feels wrong; Claude handles the *how*. Examples that work:
"make the first caption shorter" · "hold the result screen one second longer" ·
"zoom in more on the numbers" · "give me a Spanish version" · "now the wide format" ·
"put the app in a browser window" · "point out the total with a label" ·
"type the task name into the field" · "update my brand" · "make me a cover image".

## Commands

Claude runs these for you; they're here if you want to use them yourself.

| Command | What it does |
|---|---|
| `npm run check` | Checks the config and your screenshots in plain language |
| `npm run stills` | Test frames → `out/stills/` (`-- --format landscape`, `-- --variant es`, `-- 40 120` for chosen frames) |
| `npm run place` | The click-to-place page |
| `npm run render:all -- --formats portrait` | Final video(s) for the formats you pick (`portrait`, `square`, `landscape`; add `--variants es,short`) → `videos/<title>/exports/` |
| `npm run render` | One video, in the format set in the config → `out/video.mp4` |
| `npm run cover` | Cover image per format |
| `npm run brand -- show` / `set` / `reset` | Your saved brand kit |
| `npm run brand:preview` | One image of the brand kit as a video uses it |
| `npm run preview` | Scrub the timeline in the browser (Remotion Studio) |
| `npm run doctor` | Check the computer (Node, engine, browser, disk, internet) |
| `node scripts/new-video.mjs "Name" --template tutorial` | Start a new video (archives the current one); `--demo` restores the demo |

## What's in the folder

| | |
|---|---|
| `brand.json` | Your saved brand kit |
| `video.config.json` | The video being worked on (texts, scenes, timing) |
| `assets/` | Screenshots (`screens/`), photos (`photos/`), logo (`brand/`) |
| `videos/<title>/` | Finished videos (`exports/`), the agreed script, archived configs |
| `templates/` | Ready-made structures for each kind of video |
| `examples/` | Demo, showcase of every feature, mobile example |
| `.claude/skills/make-video/` | The guided workflow Claude follows + craft rules + script patterns |
| `docs/` | Quick start, user guide, config reference, build guide |
| `scripts/`, `src/`, `tools/` | The engine (Remotion + React), checks, and the click-to-place page |
| `out/` | Temporary files (test frames, previews) |

## Good to know

- **Use fictional data in screenshots.** Never real customer data.
- **You take the screenshots** (Claude tells you exactly which). Capturing them
  automatically from a running app is not built yet.
- **Silent video, still images.** No voice-over or music, and no screen recordings
  (screenshots animated with cursor, zoom and highlights). Custom animations need
  custom code: possible, but slower and they use more of your Claude usage.
- **Photos:** use photos you have the rights to (AI-generated is fine if your plan
  allows commercial use).
- **Remotion license:** the video engine ([Remotion](https://remotion.dev)) is free
  for individuals and small companies; larger companies need a company license —
  check [remotion.dev/license](https://remotion.dev/license).
- **Usage:** each video uses part of your Claude plan's usage. Building from the
  ready-made scenes is light.
- **Everything stays on your computer:** the click-to-place page and the rendering
  only run locally.

## More

- [Quick start](docs/QUICKSTART.md) — from download to your first video in 10 minutes
- [User guide](docs/USER-GUIDE.md) — screenshots, brand kit, reviewing, exports, editing text yourself
- [Config reference](docs/CONFIG-REFERENCE.md) — every option in `video.config.json` and `brand.json`
- [Build guide](docs/BUILD-GUIDE.md) — how it works and how to extend it (for developers)
- [Craft rules](.claude/skills/make-video/references/craft-rules.md) — what makes these videos work

MIT licensed. Built with [Remotion](https://remotion.dev) and Claude Code.
