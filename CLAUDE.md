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
- Never put real customer data in videos. Never recreate a logo with text.
- Speak plainly. Don't ask the user to run commands you can run yourself.
- Windows: keep the repo in a short path (e.g. `C:\Users\<you>\feature-video-studio`);
  long paths break Node tooling.
