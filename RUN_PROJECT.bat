@echo off
title LankaScape Tourism Project Launcher
color 0A
echo ========================================================
echo         LANKASCAPE - SRI LANKA TOURISM SYSTEM
echo ========================================================
echo.
echo [1/2] Starting Spring Boot Backend Server...
echo Please wait about 10-15 seconds...
echo.

set JAVA_HOME=C:\Program Files\Java\jdk-17
cd /d "F:\Tourism Project\backend\tourism-backend"

start /min cmd /c "mvnw.cmd spring-boot:run"

echo [2/2] Launching Website in your Browser...
timeout /t 10 >nul
start "" "F:\Tourism Project\frontend\index.html"

echo.
echo ========================================================
echo   SUCCESS! The Project is now RUNNING!
echo ========================================================
echo.
echo   * Website: Opened in your browser!
echo   * Backend: Running in the background (Port 8080).
echo.
echo   NOTE: Please keep this small window open while using 
echo         the website. Close it when you are done.
echo ========================================================
echo.
pause
