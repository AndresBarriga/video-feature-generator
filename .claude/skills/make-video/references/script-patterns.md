# Script patterns

Pick one, adapt to the feature. Durations are for 30 fps social cuts.
All of them work with the current engine (photo, screen, end scenes) — no
custom code needed. Captions below are placeholders in [brackets].

Each pattern has a ready-made starting config in `templates/`:
`node scripts/new-video.mjs "My video" --template <name>` —
A = `problem-solution`, B = `before-after`, C/E = `tutorial`, D = `launch`,
F = `comparison`, G = `mobile`. The templates use the demo images as
placeholders, so they render immediately; replace the images and the text in
[brackets].

## A. Problem → solution (default, ~15–20 s)
| # | s | On screen | Caption |
|---|---|---|---|
| 1 | 2.8 | Real-world photo, slow push-in, dive into the device | Still **[doing the painful thing]**? |
| 2 | 2.5 | Screen before; highlight + click the feature button | **[Verb]** the [thing]. |
| 3 | 2.5 | The feature in action (slide-up if it's a dialog) | (same caption — stays on screen) |
| 4 | 3.0 | Result screen, slow zoom, highlight what changed | The [thing] **[does itself]**. + sub-line |
| 5 | 2.5 | Edge case / fit ("works with X", "asks only what's missing") | Built around your **[system]** + sub-line |
| 6 | 3.2 | End card | headline / tagline / subline / CTA |

## B. Before → after (~10–12 s, very short)
| # | s | On screen | Caption |
|---|---|---|---|
| 1 | 3 | Before state (messy, manual) | **[Old way]** takes ages. |
| 2 | 3.5 | After state (states swap inside one scene) | Now it takes **seconds**. |
| 3 | 3 | End card | |

## C. Step-by-step (~20 s, "how it works")
| # | s | On screen | Caption |
|---|---|---|---|
| 1 | 2.5 | Photo hook | **[Outcome]** in 3 steps. |
| 2–4 | 3 each | Step screens, slide-left between them | **1.** … / **2.** … / **3.** … |
| 5 | 3 | End card | |

## D. Launch / announcement (~15 s)
| # | s | On screen | Caption |
|---|---|---|---|
| 1 | 2.5 | Hero screen of the new feature, slow zoom | **[Feature name]** is here. |
| 2 | 3 | The headline benefit in action (highlight or one click) | [Do the main thing] in **[one step]**. |
| 3 | 3 | A second screen: the detail that makes it different | Built for **[who it's for]**. |
| 4 | 2.5 | Where to find it (menu / settings screen, click on the entry) | Find it under **[menu > item]**. |
| 5 | 3.2 | End card | headline = feature name, CTA = "Available now" / "Try it free" |
Tip: announce ONE headline benefit; put the rest in the post text, not the video.

## E. Quick tutorial / tip (~15–18 s)
| # | s | On screen | Caption |
|---|---|---|---|
| 1 | 2.5 | The starting screen (no photo needed) | How to **[get result]** |
| 2 | 3 | Step 1: cursor clicks the entry point | **1.** [Open / click X] |
| 3 | 3 | Step 2: dialog or form (slide-up), highlight the key field | **2.** [Choose / fill Y] |
| 4 | 3 | Step 3: confirm, then the result (`states` swap) | **3.** [Confirm] — done. |
| 5 | 3 | End card | "More tips" / link to the docs |
Tip: one click per step, and the cursor always shows it. Never more than 3–4 steps.

## F. Comparison: old way vs. new way (~14 s)
The engine has no split screen: show the two halves one after the other, with
the SAME structure and framing so the eye compares them.
| # | s | On screen | Caption |
|---|---|---|---|
| 1 | 3 | The old way (spreadsheet, email, previous tool) — highlight the pain | **[Before]:** [X steps / X minutes] |
| 2 | 3 | Same framing, the new way (`slide-left` = "and now…") | **[Now]:** [1 step / seconds] |
| 3 | 3 | Result side (`focus` on the number or outcome that changed) | [Concrete proof, e.g. **50 % less** time] + sub-line |
| 4 | 3 | End card | |
Tip: only claim numbers you can back up; ask the user where they come from.
For a shorter version with two screenshots of the same screen, use pattern B.

## G. Mobile app (~12–15 s)
Same as A or B, but the `screen` scenes use `"device": "phone"` with portrait
screenshots (a phone frame is drawn around them). Skip the photo hook unless
they have a photo of a phone in hand with the screen corners visible. Keep
captions to 2 short lines: a phone-shaped frame leaves less room for text.

## Caption checklist
- Could someone understand the video with the sound off from the captions alone?
- Is every claim true for every customer? (Ask about exceptions.)
- 1–2 keywords per caption, not more.
- The first caption is a question or a sharp statement about the viewer's pain.
