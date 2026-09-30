# Quick start — your first video in about 10 minutes

No technical knowledge needed. You will: install two free things, open the
folder in Claude, and render the demo video to see how it works.

## 1. Install (once)

1. **Claude desktop app** → [claude.ai/download](https://claude.ai/download).
   Sign in with your Claude plan (Pro, Max, Team or Enterprise).
2. **Node.js, the LTS version** → [nodejs.org](https://nodejs.org). Download the
   big green "LTS" button, open the file, click next until it finishes.
3. **This folder**: on the GitHub page click **Code → Download ZIP** and unzip it
   somewhere with a **short path**:
   - Windows: `C:\Users\<you>\feature-video-studio`
   - Mac: your home folder, e.g. `~/feature-video-studio`

## 2. Set up (once, ~2 minutes)

Double-click **`setup-windows.bat`** (Windows) or **`setup-mac.command`** (Mac).

- It installs the video engine and downloads a small rendering browser (about
  90 MB). At the end it runs a check that says **"All set"** or tells you what
  to fix, with an arrow (→) under each problem.
- **Mac says it can't open the file?** Right-click it → **Open** → **Open**.
- **Something failed?** Open the Claude app in this folder and ask
  *"the setup check failed, can you fix it?"*. You can also run the check again
  any time by asking Claude *"check my setup"*.

## 3. Open the folder in Claude

1. Open the Claude desktop app and click the **Code** tab.
2. Choose this folder as the project folder.

## 4. Try the demo

Type: **Render the demo video**. In a couple of minutes you get a 13-second
example (a fictional task app: photo of a laptop → click → result → end card).
Ask for changes in plain words to see what is possible:

- "Show me the wide (landscape) version too."
- "Put the app in a browser window."
- "Make a cover image."

## 5. Make your own

Type **`/make-video`** (or *"I want to make a video for my new feature"*). Claude:

1. asks a few questions: the feature, who watches, the kind of video, **which
   format(s) you need**, the device it runs on, and how it should look and open;
2. sets up **your brand once** (logo, colors, font, tone) and shows a preview to
   approve: every later video reuses it;
3. proposes the script — **you approve it before anything is built**;
4. tells you exactly which screenshots to take (use fictional data!);
5. checks your screenshots and builds the video (you click where things go on a small page);
6. shows you test frames — **you approve them before the final render**;
7. renders only the formats you picked (and, if you ask, other languages and a cover).

Your videos end up in the **`videos`** folder.

## If you get stuck

- Ask Claude in plain words what you see; paste the message if there is one.
- **"EPERM" when rendering** → the old video is open in a player. Close it.
- **Long or strange folder path on Windows** → move the folder to a short path
  like `C:\Users\<you>\feature-video-studio`.
