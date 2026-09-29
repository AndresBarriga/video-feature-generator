# Craft rules — what makes these videos work

Learned the hard way over many review rounds on a real product video. Apply
them by default; break one only if the user asks.

## Story & pacing
- **Hook first, product second.** Open on the *problem* ("Still typing guest
  details by hand?") over a real-world photo with a slow push-in (~2–3 s), then
  dive into the device screen. Starting straight on the UI with a fast zoom felt
  rushed; the slow start was clearly preferred.
- **~12–20 s total** for social. Give each caption time to be read:
  ~0.4 s per word, minimum ~1.5 s per caption. Captions with a sub-line need more.
- **One idea per beat.** If a beat needs two captions, it's two beats.
- **The key moment gets the most time** (e.g. the scan itself), not the setup.
- **End card ~3 s**: headline, one supporting line, one CTA. Nothing else.

## Captions
- One caption band on top, always in the same place. Big enough for a phone
  (the engine handles size).
- **Never two captions on screen at once** (the engine guarantees it).
- **Same caption across connected beats** → it stays still (no flicker).
- 1–2 **keywords** per caption in the accent color. Not whole sentences.
- ≤ ~7 words per line, max 2 lines, plus an optional short sub-line.
- Be precise about claims. Example from production: "Only the phone number left
  to type" was wrong — mandatory fields vary per customer — so it became
  "Missing a **required field**? The app asks for it." + "Each property decides
  what's mandatory." Ask the user about exceptions before stating absolutes.

## Motion
- **No cross-fades between scenes** (they look muddy, especially with text).
  Use hard cuts, a quick slide-up when a dialog opens, slide-left for "next".
- **The cursor leads every click**: appears where the eye already is, moves in
  one straight line, clicks (ripple), pauses. Pure "look at this" moments use a
  highlight box instead of a cursor.
- **Slow push-ins** (zoomTo 1.05–1.12) keep static screens alive.
- Continuity: when the next scene shows the same screen in a new state, use
  `states` inside one scene instead of a new scene.

## Screens & data
- Crop to what matters (`focus`) — a full desktop screenshot shrunk into a phone
  frame is unreadable.
- Fictional data only. Keep it consistent across all screenshots (same person,
  same numbers, same date format as the app).
- Dates/names in the app's real format (e.g. "Mr. Novak Adam" if that's how
  the app shows names).
- If a document/object is shown, make it look like the real thing (a passport is
  a booklet page, not an ID card) — people notice.

## Brand
- Brand book = source of truth for the video chrome (colors, font, logo,
  rounded/wave elements). Product screenshots keep their real look.
- Logo only from real artwork. Never type the brand name in a font as a "logo".

## Process
- Always show test frames before the final render; expect 3–8 feedback rounds.
- Keep the first frame meaningful (caption visible, product visible) — it's the
  thumbnail in feeds.
- Render with correct color settings (the engine does: PNG frames + yuv420p).
