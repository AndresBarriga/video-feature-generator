# `video.config.json` reference

One file describes the whole video. Images are referenced by their path inside
`assets/` (e.g. `"screens/tasks-before.png"`). **All coordinates are in pixels
of the original image**; sizes are indexed in `assets/manifest.json` (generated
automatically). Times are in **seconds**.

## Top level

| Field | Required | Example | Notes |
|---|---|---|---|
| `title` | yes | `"Organize my week"` | Used for folder names |
| `format` | yes | `"portrait"` | `portrait` 1080×1350 (4:5), `square` 1080×1080, `landscape` 1920×1080. `npm run render:all` exports all three. |
| `fps` | no | `30` | |
| `captionStyle` | no | `"words"` | `words` (default): captions enter word by word and keywords get a self-drawing underline. `rise`: the whole caption slides up. |
| `brand.primary` | yes | `"#2b1d5c"` | Caption band, end card background |
| `brand.accent` | yes | `"#ff7a59"` | Keywords, CTA button, highlights, callouts, cursor ripple |
| `brand.success` | no | `"#34c38f"` | End-card wave |
| `brand.background` | no | `"#f5f4fb"` | Behind screenshots |
| `brand.backdrop` | no | `"soft"` | Look of the area behind screenshots: `plain` (default), `soft` (gentle gradient), `dots`, `grid`, `glow` (accent halo) |
| `brand.font` | no | `"Inter"` | Any Google Fonts family |
| `brand.logo` | no | `"brand/logo.png"` | Shown in the band corner and on the end card |
| `cover` | no | `{ "headline": "Organize my\n**week**", "sub": "…" }` | Poster image (`npm run cover`). Optional `image`, `device`, `url`. Defaults: the end card's texts and the last screen scene. |
| `scenes` | yes | `[...]` | In order. The `end` scene must be last. |
| `variants` | no | `{ "es": {...} }` | Other versions of the same video. See [Variants](#variants). |

## Common scene fields

| Field | Notes |
|---|---|
| `type` | `"photo"`, `"screen"` or `"end"` |
| `seconds` | Duration |
| `caption` | Top caption. `**word**` = highlighted keyword, `\n` = line break. Same caption on consecutive scenes = it stays on screen (no re-animation). |
| `sub` | Smaller supporting line under the caption |
| `transitionIn` | `"cut"` (default), `"slide-up"` (dialog opens), `"slide-left"` (next step). No cross-fades by design. |

## `screen` — a screenshot of your app

| Field | Example | Notes |
|---|---|---|
| `image` | `"screens/01-before.png"` | |
| `focus` | `{ "x": 640, "y": 470, "width": 1000, "height": 560 }` | Center + width (px) of the area to show. Add `"height"` to fit a whole rectangle — do it when you export several formats, so the area also fits the wide/square ones. Default: whole screenshot. Smaller `width` = bigger, more readable UI. |
| `zoomTo` | `1.1` | Slow push-in over the scene |
| `clicks` | `[{ "x": 1038, "y": 170, "at": 1.8 }]` | Cursor appears at the focus center, moves in a straight line, clicks at `at` seconds. Multiple clicks glide from one to the next. |
| `highlights` | `[{ "x": 908, "y": 144, "w": 260, "h": 52, "from": 0.5, "to": 1.9 }]` | Glowing accent box. `from`/`to` in seconds (default: whole scene). |
| `callouts` | `[{ "x": 205, "y": 381, "text": "**High** priority first", "side": "right", "from": 1.5 }]` | A label with an arrow pointing at (x, y): "look here". `side` = where the label sits (`top`, `bottom`, `left`, `right`); choose the side with empty space. `**keyword**` works. `from`/`to` in seconds. |
| `detail` | `{ "focus": { "x": 340, "y": 380, "width": 640 }, "from": 1 }` | The camera glides from the whole screen to a detail, starting at `from` seconds (`duration`, default 0.9 s). |
| `typing` | `[{ "x": 344, "y": 346, "text": "Renew the license", "from": 0.6, "size": 26, "clear": { "w": 620, "h": 44 } }]` | Text typed into a field, letter by letter, with a blinking caret. (x, y) = top-left of the text; `size` = font size in image px; `clear` covers the placeholder text under it (`color` defaults to white; match the field). Optional: `color`, `weight`, `cps` (characters per second, default 14). |
| `device` | `"browser"` | Draws a device frame around the screenshot: `phone`, `tablet-portrait`, `tablet-landscape`, `browser`, `laptop`, `monitor`. Use portrait screenshots for phone/tablet-portrait and wide ones for the rest. |
| `url` | `"app.example.com"` | Text in the address bar (`device: "browser"` only) |
| `states` | `[{ "image": "screens/01-after.png", "from": 1.5 }]` | Same screen, new state, swapped at `from` seconds (same size as `image`). |

## `photo` — a real-world photo (opening, context)

| Field | Example | Notes |
|---|---|---|
| `image` | `"photos/desk.jpg"` | Fills the frame (cover) |
| `focus` | `{ "x": 900, "y": 500, "width": 1000 }` | Optional crop (e.g. to hide a messy bottom) |
| `pushIn` | `1.08` | Slow push-in |
| `screen.quad` | `[[598,239],[1343,233],[1319,822],[520,773]]` | Corners of the device screen in the photo: top-left, top-right, bottom-right, bottom-left. Use `tools/picker.html`. In wide formats the framing keeps the whole screen in view. |
| `screen.image` | `"screens/01-empty.png"` | Screenshot shown on that screen (default with `diveIntoNext`: the next scene's image) |
| `diveIntoNext` | `true` | Ends by diving into the screen; lands exactly on the first frame of the next `screen` scene (invisible cut) |

## `end` — closing card

| Field | Example |
|---|---|
| `headline` | `"Organize my week"` (supports `**keyword**`, `\n`) |
| `tagline` | `"with Taskly"` |
| `subline` | `"One click.\nEvery task in its place."` |
| `cta` | `"Try it free"` |
| `url` | `"taskly.example/try"` (omit for none) |
| `backgroundImage` | `"photos/desk.jpg"` — blurred and tinted automatically |

## Variants

A **variant** is another version of the same video — another language, a shorter
cut, another format — described as *changes* to the main config, so you keep one
source of truth. Scene numbers start at **1** and refer to the original list.

```json
"variants": {
  "es": {
    "title": "Taskly (ES)",
    "scenes": {
      "1": { "caption": "¿Tareas repartidas en\n**cinco apps**?" },
      "4": { "headline": "Organiza mi semana", "cta": "Pruébalo gratis" }
    }
  },
  "short": { "drop": [3], "targetSeconds": 10 }
}
```

| Field | Notes |
|---|---|
| `title`, `format`, `captionStyle`, `brand` | Replace/merge the same top-level fields |
| `scenes` | Scene number → fields to change (a shallow merge, so a changed `callouts` list replaces the old one) |
| `seconds` | Scene number → new duration |
| `drop` | Scene numbers to leave out |
| `targetSeconds` | Fit the video to this length by scaling every scene except the end card (times of clicks, callouts, typing… scale with it). `npm run check` warns if a caption then becomes too short to read. |

Render them with `npm run render:all -- --variants es,short` (see below).
Variants are checked like the main video by `npm run check`.

## Commands

| Command | What it does |
|---|---|
| `npm run check` | Validates the config (friendly errors) and looks at your screenshots: different sizes, low resolution, wrong orientation for a device, screen corners in the wrong order, captions too short to read. Also type-checks. |
| `npm run stills` | Test frames → `out/stills/` (`npm run stills -- 40 120` for specific frames; add `--format landscape` or `--variant es`) |
| `npm run preview` | Opens the timeline in the browser (Remotion Studio) |
| `npm run place` | Click-to-place page on localhost: click where the cursor clicks, drag highlight/focus/typing boxes, place callouts, set the photo's screen corners. Saves into `video.config.json` as you go; **Finish** closes it. |
| `npm run render` | Final MP4 → `out/video.mp4` (the format in the config) |
| `npm run render:all` | All three formats in one go → `videos/<title>/exports/`. Options: `-- --formats portrait,landscape`, `-- --variants es,short`, `-- --variants all`, `-- --only-variants es` |
| `npm run cover` | Poster / thumbnail PNG per format → `videos/<title>/exports/` |
| `npm run doctor` | Checks the computer (Node, engine, rendering browser, disk, internet) and explains what to fix |
| `node scripts/new-video.mjs "Name"` | Archive current video, start a new one. `--template launch\|tutorial\|comparison\|before-after\|problem-solution\|mobile` starts from a ready-made structure; `--demo` restores the demo |
