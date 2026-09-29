@echo off
title Feature Video Studio - render
cd /d "%~dp0"
echo.
echo  Rendering the video described in video.config.json ...
echo.
call npm run render
if errorlevel 1 (
  echo.
  echo  The render stopped. Read the message above - it says what to fix.
  echo  If it mentions EPERM, close the old video in your player and try again.
  pause
  exit /b 1
)
echo.
echo  Done: out\video.mp4
start "" "%~dp0out"
pause
