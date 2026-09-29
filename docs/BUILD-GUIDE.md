# Build guide — how it works and how to extend it

For developers (or Claude) maintaining or extending the studio.

## Design goals

1. **Non-technical users only talk.** Everything they need is a conversation
   (`/make-video` skill) + dropping images. No terminal, no code.
2. **Config, not code, for 90 % of videos.** A video is `video.config.json` +
   images. New videos don't touch `src/`.
3. **Subscription, not API.** All AI work happens inside Claude Code, on the
   user's plan. The repo never calls an AI API. Rendering is local.
4. **Show before render.** Cheap test frames (`npm run stills`) at every step;
   the full render is last.
5. **Opinionated craft.** The engine enforces the rules that made the original
   videos work (see `craft-rules.md`): one caption track that never overlaps,
   cuts/slides instead of cross-fades, cursor that leads clicks, first frame
   as thumbnail, correct color encoding.

## Architecture

```
video.config.json ─┐
assets/*.png ──────┼─> prepare-assets.mjs ─> assets/manifest.json (image sizes)
                   │
                   └─> src/config.ts (types + load) ─> src/timeline.ts (frames, caption cues)
                                                      src/layout.ts   (format, fit/crop math)
                                                            │
src/Video.tsx ── TransitionSeries of scenes ── ScreenScene / PhotoScene
             ├─ CaptionBand (one global caption track on top)
             └─ EndScene (slides up over everything)
                                                            │
Remotion (React → headless Chrome frames → FFmpeg) ─> out/video.mp4
```

| File | Role |
|---|---|
| `.claude/skills/make-video/SKILL.md` | The guided workflow Claude follows (interview → script → screenshots → build → stills → render) |
| `.claude/skills/make-video/references/` | Craft rules and script patterns the skill uses |
| `CLAUDE.md` | Project rules for any Claude session in this repo |
| `src/config.ts` | Config schema (TypeScript types) + image-size lookup |
| `src/layout.ts` | Formats, caption band height, `placeImage` (contain/cover/focus), `toContent` (image px → screen px) |
| `src/timeline.ts` | Seconds → frames, scene starts (slides overlap 12 frames, cuts don't), caption cues (merged, non-overlapping, first cue visible on frame 0) |
| `src/components/CaptionBand.tsx` | Brand band, wave, logo, caption with `**keywords**` + sub-line |
| `src/components/Cursor.tsx` | Cursor rules: fade in at focus center, straight decelerating moves, ripple, fade out |
| `src/components/perspective.ts` | `quadMatrix3d` — maps a rectangle onto 4 corners (screenshot on a device in a photo) |
| `src/scenes/ScreenScene.tsx` | Screenshot + focus/zoom + states + highlights + clicks |
| `src/scenes/PhotoScene.tsx` | Photo + push-in + screenshot on device + dive into the next scene |
| `src/scenes/EndScene.tsx` | Closing card |
| `src/demo/DemoAssets.tsx` | Generates the fictional demo images (`npm run demo-assets`) |
| `scripts/check-config.mjs` | Plain-language validation before rendering |
| `scripts/stills.mjs` | Bundles once, renders key frames (scene middles + clicks) |
| `scripts/new-video.mjs` | Archive current video → `videos/`, start a new one |
| `tools/picker.html` | Click on an image to get pixel coordinates / device-screen corners |

## Key techniques (and why)

- **Image-pixel coordinates everywhere.** Users and Claude read positions off
  the screenshot; `toContent()` converts at render time, so crops/zooms never
  break click positions.
- **The invisible dive.** `PhotoScene` maps the screenshot onto the device
  screen with a projective transform, zooms toward it, and interpolates the
  quad to the exact rectangle where the next `ScreenScene` draws its image on
  frame 0 (`screenPlacement()`). Same image, same rectangle → a hard cut nobody
  sees.
- **Caption track outside the scenes.** Scenes slide and cut; captions live in
  one global layer with back-to-back time windows, so they never overlap and
  identical consecutive captions don't flicker.
- **Colors:** render with PNG frames + `yuv420p` (set in `remotion.config.ts`).
  JPEG frames produce full-range `yuvj420p`, which looks washed out on social.
- **Fonts:** `FontLoader` injects the Google Fonts CSS and blocks rendering
  (`delayRender`) until loaded — no frames with fallback fonts.

## Custom scenes (when config isn't enough)

Some videos need an animated UI that screenshots can't show (fields filling one
by one, a chart drawing itself). Rebuilding the UI in React looks best but
costs far more effort/usage. Recipe:

1. Create `src/scenes/custom/MyScene.tsx`. Lay it out in a fixed "UI space"
   (e.g. 1280×960) using colors sampled from the real screenshots.
2. Drive every animation from `useCurrentFrame()` + `interpolate()` (CSS
   animations don't render).
3. Add a new scene type in `src/config.ts` (`type: "custom"`, `component: "MyScene"`)
   and render it in `Video.tsx` inside `<AbsoluteFill style={{ top: CONTENT.y, height: CONTENT.h }}>`.
4. Verify with `npm run stills -- <frame>`; check clicks land on targets.
5. Follow the Remotion skills' best practices (`npx skills add remotion-dev/skills`).

## Maintaining

- `npm run check` must pass (config + TypeScript).
- Regenerate demo images after changing `src/demo/`: `npm run demo-assets`.
- Keep `SLIDE` in `src/timeline.ts` and `scripts/stills.mjs` in sync.
- Upgrading Remotion: bump all `@remotion/*` + `remotion` to the same exact
  version (`npm view remotion version`), never mixed versions.
- Update the craft rules when review feedback reveals a new pattern — the skill
  reads them every time.

## Ideas for later

- Background music track (optional, off by default: feed videos autoplay muted).
- Batch export of all three formats in one command.
- `custom` scene type with a small library of animated UI primitives
  (typing text, field fill, toast, progress).
- A simple local form UI for editing captions without opening JSON.
