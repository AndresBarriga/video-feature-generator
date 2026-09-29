@echo off
title Feature Video Studio - setup
cd /d "%~dp0"
echo.
echo  Feature Video Studio - one-time setup
echo  ------------------------------------
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo  Node.js is not installed yet.
  echo  Opening nodejs.org - download the LTS version, install it,
  echo  then double-click this file again.
  start https://nodejs.org
  echo.
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODEV=%%v
echo  Node.js found: %NODEV%
echo  Installing the video engine (about 1-2 minutes)...
echo.
call npm install --no-fund --no-audit
if errorlevel 1 (
  echo.
  echo  Something went wrong during installation. Check your internet connection
  echo  and try again. If it keeps failing, open the Claude app in this folder
  echo  and ask: "setup failed, can you fix it?"
  pause
  exit /b 1
)
call node scripts\prepare-assets.mjs
echo.
echo  Checking that everything is ready (the first time it downloads a small
echo  rendering browser, about 90 MB)...
call node scripts\doctor.mjs
if errorlevel 1 (
  echo  Fix the points marked with an arrow above, then double-click this file again.
  echo  Or open the Claude app in this folder and ask: "the setup check failed, can you fix it?"
  pause
  exit /b 1
)
echo  All set!
echo  Next: open the Claude desktop app, Code tab, choose this folder,
echo  and type  /make-video
echo.
pause
