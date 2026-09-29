#!/bin/bash
# Feature Video Studio — one-time setup (double-click in Finder).
# If macOS says it can't be opened: right-click > Open, or run
#   chmod +x setup-mac.command
cd "$(dirname "$0")" || exit 1
echo
echo " Feature Video Studio - one-time setup"
echo " ------------------------------------"
echo
if ! command -v node >/dev/null 2>&1; then
  echo " Node.js is not installed yet."
  echo " Opening nodejs.org - download the LTS version, install it,"
  echo " then double-click this file again."
  open "https://nodejs.org"
  read -r -p " Press Enter to close…"
  exit 1
fi
echo " Node.js found: $(node -v)"
echo " Installing the video engine (about 1-2 minutes)..."
echo
if ! npm install --no-fund --no-audit; then
  echo
  echo " Something went wrong. Check your internet connection and try again,"
  echo " or open the Claude app in this folder and ask: \"setup failed, can you fix it?\""
  read -r -p " Press Enter to close…"
  exit 1
fi
node scripts/prepare-assets.mjs
echo
echo " Checking that everything is ready (the first time it downloads a small"
echo " rendering browser, about 90 MB)..."
if ! node scripts/doctor.mjs; then
  echo " Fix the points marked with an arrow above, then double-click this file again."
  echo " Or open the Claude app in this folder and ask: \"the setup check failed, can you fix it?\""
  read -r -p " Press Enter to close…"
  exit 1
fi
echo " All set!"
echo " Next: open the Claude desktop app, Code tab, choose this folder,"
echo " and type  /make-video"
echo
read -r -p " Press Enter to close…"
