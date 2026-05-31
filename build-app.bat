@echo off
echo.
echo  Rec. ? Build Windows .exe
echo  ============================
echo.

cd /d "%~dp0app"

echo  Installation des dependances...
call npm install
if errorlevel 1 ( echo ERREUR npm install & pause & exit /b 1 )

echo.
echo  Build Windows...
call npm run build-win
if errorlevel 1 ( echo ERREUR build & pause & exit /b 1 )

echo.
echo  Termine ! Fichier dans : app\dist\
explorer "%~dp0app\dist"
pause
