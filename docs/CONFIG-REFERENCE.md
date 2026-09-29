# `video.config.json` reference

One file describes the whole video. Images are referenced by their path inside
`assets/` (e.g. `"screens/tasks-before.png"`). **All coordinates are in pixels
of the original image**; sizes are indexed in `assets/manifest.json` (generated
automatically). Times are in **seconds**.

## Top level

| Field | Required | Example | Notes |
|---|---|---|---|
| `title` | yes | `"Organize my week"` | Used for folder names |
| `format` | yes | `"portrait"` | `portrait` 1080×1350 (4:5), `square` 1080×1080, `landscape` 1920×1080 |
| `fps` | no | `30` | |
| `brand.primary` | yes | `"#2b1d5c"` | Caption band, end card background |
| `brand.accent` | yes | `"#ff7a59"` | Keywords, CTA button, highlights, cursor ripple |
| `brand.success` | no | `"#34c38f"` | End-card wave |
| `brand.background` | no | `"#f5f4fb"` | Behind screenshots |
| `brand.font` | no | `"Inter"` | Any Google Fonts family |
| `brand.logo` | no | `"brand/logo.png"` | Shown in the band corner and on the end card |
| `scenes` | yes | `[...]` | In order. The `end` scene must be last. |

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
| `focus` | `{ "x": 640, "y": 470, "width": 1000 }` | Center + width (px) of the area to show. Add `"height"` to fit a whole rectangle. Default: whole screenshot. Smaller `width` = bigger, more readable UI. |
| `zoomTo` | `1.1` | Slow push-in over the scene |
| `clicks` | `[{ "x": 1038, "y": 170, "at": 1.8 }]` | Cursor appears at the focus center, moves in a straight line, clicks at `at` seconds. Multiple clicks glide from one to the next. |
| `highlights` | `[{ "x": 908, "y": 144, "w": 260, "h": 52, "from": 0.5, "to": 1.9 }]` | Glowing accent box. `from`/`to` in seconds (default: whole scene). |
| `device` | `"phone"` | Draws a phone frame around the screenshot. For portrait (mobile app) screenshots; see `examples/mobile.config.json`. |
| `states` | `[{ "image": "screens/01-after.png", "from": 1.5 }]` | Same screen, new state, swapped at `from` seconds (same size as `image`). |

## `photo` — a real-world photo (opening, context)

| Field | Example | Notes |
|---|---|---|
| `image` | `"photos/desk.jpg"` | Fills the frame (cover) |
| `focus` | `{ "x": 900, "y": 500, "width": 1000 }` | Optional crop (e.g. to hide a messy bottom) |
| `pushIn` | `1.08` | Slow push-in |
| `screen.quad` | `[[598,239],[1343,233],[1319,822],[520,773]]` | Corners of the device screen in the photo: top-left, top-right, bottom-right, bottom-left. Use `tools/picker.html`. |
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

## Commands

| Command | What it does |
|---|---|
| `npm run check` | Validates the config (friendly errors) + type-checks |
| `npm run stills` | Test frames → `out/stills/` (`npm run stills -- 40 120` for specific frames) |
| `npm run preview` | Opens the timeline in the browser (Remotion Studio) |
| `npm run render` | Final MP4 → `out/video.mp4` |
| `node scripts/new-video.mjs "Name"` | Archive current video, start a new one (`--demo` restores the demo) |
