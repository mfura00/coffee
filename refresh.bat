@echo off
cd /d "%~dp0"
echo Killing stale node processes...
taskkill /f /im node.exe 2>nul

echo.
echo Step 1: Fix Rwandan Drip price...
cd backend
node utils\fixPrice.js

echo.
echo Step 2: Upload Cloudinary images...
node utils\seedAttractiveImages.js

echo.
echo Step 3: Build frontend...
cd ..\frontend
call npm run build

echo.
echo Step 4: Commit and deploy...
cd ..
git add -A
git commit -m "seed Cloudinary images, RWF prices, clean items"
git push

echo.
echo Done! Press any key to exit.
pause
