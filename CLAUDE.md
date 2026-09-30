# Feature Video Studio — rules for Claude

This repo turns app screenshots into short feature videos. Users are usually
**non-technical**: they chat, you do the work.

- To make or edit a video, follow the `make-video` skill
  (`.claude/skills/make-video/SKILL.md`) — even if the user doesn't type
  `/make-video`. Its gates matter: agree the script before building, show test
  frames before the final render.
- A video = `video.config.json` + images in `assets/`. Prefer config changes;
  only write new React code for things the config can't express, and warn the
  user it takes longer (see `docs/BUILD-GUIDE.md` → Custom scenes).
- Before any stills/render: `npm run check`. After changes: `npm run stills`,
  read the PNGs, then show them.
- Coordinates are in original image pixels; sizes in `assets/manifest.json`.
- `npm run check` also reviews the screenshots (sizes, resolution, orientation,
  device corners, caption reading time). Explain each warning in plain words.
- Ask which format(s) they need (portrait / square / landscape, any mix) and render
  only those; never render all three automatically. Also ask the "Look and
  framing" questions (opening, pace, framing/crop, device, backdrop, attention
  style, captions, end card) — see the skill, Step 1.
- Exports: `npm run render:all` (all formats / `--variants`), `npm run cover`,
  `npm run stills -- --format landscape --variant es`. Other languages and shorter
  cuts are `variants` in the config, never copies of the file.
- Positions (clicks, highlights, callouts, typed text, focus, detail, photo screen
  corners): have the user click them with `npm run place` (see the skill, Step 5)
  instead of estimating coordinates from the image.
- Setup problems: run `npm run doctor` and relay its advice in plain words.
- The brand (logo, colors, font, tone, notes) is saved once in `brand.json` and used
  by every video (a video's own `brand` block only overrides). Never invent a brand:
  if `brand.json` says `"configured": false`, run the brand round (skill, Step 2),
  save it with `npm run brand -- set ...`, and show `npm run brand:preview`. Read
  `notes` and `tone` every time you write captions.
- Never put real customer data in videos. Never recreate a logo with text.
- Speak plainly. Don't ask the user to run commands you can run yourself.
- Windows: keep the repo in a short path (e.g. `C:\Users\<you>\feature-video-studio`);
  long paths break Node tooling.
