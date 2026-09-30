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

1. **Questions** — two short rounds of multiple-choice questions (every option has
   a recommended default, so you can just press on):
   - **The content:** the feature, who watches, what kind of video, which
     **format(s)** you need (4:5, square, wide — pick only what you'll use), the
     device it runs on, your call to action and your brand.
   - **Your brand** (asked once, then saved for every video): your logo, colors
     (from your website or brand guidelines, a suggested palette, or codes you
     type), font, tone (sober, friendly, technical) and anything to avoid. Claude
     shows you a preview image to approve.
   - **Look and framing:** how it opens (photo or straight to the screen), the
     pace (calm, standard, snappy), whether to show whole screens or crop to the
     part that matters, the background behind screenshots, what draws the eye
     (cursor clicks, highlight boxes, "look here" labels, zoom to a detail), how
     captions appear and how the end card looks.
2. **Script** — Claude proposes a short table: each beat, how long, what's on
   screen, the caption. Change anything. Nothing is built until you say OK.
3. **Screenshot list** — exactly which screens and states to capture.
4. **Build** — Claude puts it together (a few minutes).
5. **Test frames** — still images of every scene. Give feedback.
6. **Final video** — an MP4 in `videos/<your video>/`.

## 2b. Your brand kit

The first time, Claude asks for your brand and saves it in `brand.json`. After
that, every video uses it, and Claude only asks "use the saved brand?".

- **Logo:** send the file, or say none. Claude never draws a logo with text.
- **Colors:** give a website or brand-guidelines PDF and Claude reads the real
  colors; or pick a suggested palette; or type the hex codes.
- **Font:** any Google Fonts family (if yours isn't there, Claude picks the closest).
- **Tone and guidelines:** sober, friendly or technical, plus things to avoid
  ("no exclamation marks", words never to use). Claude follows them in the captions.
- **Preview:** Claude renders one image showing the caption band, a keyword, the
  button and your colors, so you can say "yes, that's us" before anything is built.

To change the brand later, say "update my brand" (for one video only: "use a
different accent for this video").

## 3. Taking good screenshots

- Use **fictional demo data** (fake names, numbers). Never real customer data.
- **Same window size** for all screenshots of the same screen — "before" and
  "after" must line up exactly.
- Close notifications, chat pop-ups, cookie banners.
- Browser zoom **100–125 %**; full window is fine (Claude crops).
- Capture **each state**: before, during (e.g. dialog open), after.
- **Mobile app or tablet?** Take portrait screenshots and say so — Claude puts
  them in a phone or iPad frame. Web app? Claude can put them in a browser
  window; laptop and desktop-monitor frames exist too.
- Claude checks your screenshots for you (same size, big enough, right
  orientation) and tells you in plain words if one should be retaken.
- Windows: `Win + Shift + S`. Mac: `Cmd + Shift + 4`, then `Space` to capture a window.
- Attach them in the chat, or drop them into `assets/screens/` (photos into
  `assets/photos/`, logo into `assets/brand/`).

## 3b. Clicking where things go

Instead of describing positions in words ("a bit to the left…"), Claude opens a
small page in the app: your screenshot, with tools to **click where the cursor
should press**, **drag a box** around what to highlight, **point a label** at a
spot, **box a field** for typed text, and **mark the screen** in your photo. You
click, it saves as you go, and every mark can be dragged, edited or deleted.
Press **Finish** when done, and tell Claude; it then shows you test frames.

## 4. Asking for changes (examples that work)

- "Make the first caption shorter." / "Change 'sorted itself' to 'organizes itself'."
- "Hold the result screen one second longer."
- "Zoom in more on the results." / "The cursor should click the purple button."
- "Use the square format too." / "Give me all three formats." / "Make a 10-second version."
- "Make a Spanish version." / "Make me a cover image for LinkedIn."
- "Put the app in a browser window." / "Use the laptop frame."
- "Point out the total with a label." / "Zoom in on that number."
- "Type the task name into the field." / "Give the background a soft look."
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
come back and change them later. Tell Claude what kind of video you want —
**launch announcement, quick tutorial, old way vs new way, before/after, mobile
app** — and it starts from a ready-made structure.

## 8. Exports: formats, languages, cover

When you're happy with the video, ask for extras:

- **"Give me another format"** → Claude asks which one(s) you need: 4:5
  (LinkedIn/Instagram), square, or wide (website, YouTube, slides). Only those are
  rendered, into `videos/<your video>/exports/`. Claude shows you the frames in
  that format first, because the framing changes between formats.
- **"Make a Spanish version"** (any language) → same video, translated texts.
  Claude shows you the frames first, since translated captions are often longer.
- **"Make a 10-second version"** → same video, shorter (for stories or ads).
- **"Make a cover image"** → a poster/thumbnail PNG with the headline and the
  app, in each format.

## 9. If something doesn't work

Run **`npm run doctor`** (or ask Claude "check my setup"): it checks Node, the
video engine, the rendering browser, disk space and internet, and says in plain
words what to fix.

## FAQ

**Does it cost extra?** No per-video cost; it uses your Claude plan's usage.
Long sessions with many custom changes use more.

**Can I use real screenshots of our product?** Yes — that's the point. Just
use fictional data inside them.

**The video looks washed out on LinkedIn.** It shouldn't — the engine renders
with the right color settings. If you re-encode it elsewhere, keep "yuv420p".

**Render fails with "EPERM"** — the old video is open in a player. Close it or
ask Claude to render with a new name.
