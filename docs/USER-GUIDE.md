# User guide

For people who make the videos — no technical knowledge needed.

## 1. Before you start

Have ready (Claude will ask for them, but it goes faster if you have them):

- **The feature in one sentence** and **the problem it solves**.
- **Who will watch** and **where you'll post it** (LinkedIn, website, sales deck…).
- **Your logo** (PNG with transparent background or SVG exported to PNG) and
  **brand colors** — or your brand book PDF / website; Claude extracts them.
- **One real-world photo** of the product in use, ideally with the screen of the
  device visible (a laptop on a desk, a phone in someone's hand, a tablet at a shop counter…).
  Optional, but the opening looks much better with it.

## 2. The conversation, step by step

1. **Questions** — a few multiple-choice questions about the feature, audience,
   format and call to action.
2. **Script** — Claude proposes a short table: each beat, how long, what's on
   screen, the caption. Change anything. Nothing is built until you say OK.
3. **Screenshot list** — exactly which screens and states to capture.
4. **Build** — Claude puts it together (a few minutes).
5. **Test frames** — still images of every scene. Give feedback.
6. **Final video** — an MP4 in `videos/<your video>/`.

## 3. Taking good screenshots

- Use **fictional demo data** (fake names, numbers). Never real customer data.
- **Same window size** for all screenshots of the same screen — "before" and
  "after" must line up exactly.
- Close notifications, chat pop-ups, cookie banners.
- Browser zoom **100–125 %**; full window is fine (Claude crops).
- Capture **each state**: before, during (e.g. dialog open), after.
- **Mobile app?** Take phone screenshots and say so — Claude puts them in a phone frame.
- Windows: `Win + Shift + S`. Mac: `Cmd + Shift + 4`, then `Space` to capture a window.
- Attach them in the chat, or drop them into `assets/screens/` (photos into
  `assets/photos/`, logo into `assets/brand/`).

## 4. Asking for changes (examples that work)

- "Make the first caption shorter." / "Change 'sorted itself' to 'organizes itself'."
- "Hold the result screen one second longer."
- "Zoom in more on the results." / "The cursor should click the purple button."
- "Use the square format too." / "Make a 10-second version."
- "The start feels too fast." / "Remove the URL from the end card."

Be specific about *what* feels wrong; Claude handles the *how*.

## 5. Editing the text yourself (optional)

All texts live in `video.config.json` (open it with Notepad / TextEdit):

- `"caption"`: the text on top. Put `**` around words to highlight them
  (`"**Organize** your week."`). `\n` starts a new line.
- `"sub"`: the smaller line under a caption.
- `"seconds"`: how long a scene lasts.
- End card: `"headline"`, `"tagline"`, `"subline"`, `"cta"`, `"url"`.

Then ask Claude "render the video" — or double-click `render-video.bat`
(Windows) / run `npm run render`. If something is wrong, you'll get a clear
message like *"Scene 3: click (1400, 300) is outside the screenshot"*.

## 6. Previewing the timeline

Ask Claude to "open the preview", or run `npm run preview`: the video opens in
your browser (Remotion Studio) and you can scrub through it.

## 7. Starting a new video

Say "start a new video". Claude archives the current one in `videos/` and
starts fresh. Your previous videos stay there with their config, so you can
come back and change them later.

## FAQ

**Does it cost extra?** No per-video cost; it uses your Claude plan's usage.
Long sessions with many custom changes use more.

**Can I use real screenshots of our product?** Yes — that's the point. Just
use fictional data inside them.

**The video looks washed out on LinkedIn.** It shouldn't — the engine renders
with the right color settings. If you re-encode it elsewhere, keep "yuv420p".

**Render fails with "EPERM"** — the old video is open in a player. Close it or
ask Claude to render with a new name.
