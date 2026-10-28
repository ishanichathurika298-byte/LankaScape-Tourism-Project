@echo off
title LankaScape Tourism Project Launcher
color 0A
echo ========================================================
echo         LANKASCAPE - SRI LANKA TOURISM SYSTEM
echo ========================================================
echo.

:: Auto-detect or set JAVA_HOME if missing
if not defined JAVA_HOME (
    if exist "C:\Program Files\Java\jdk-17" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-17"
    )
)

echo [1/2] Starting Spring Boot Backend Server (Port 8080)...
echo Please ensure MySQL is running on port 3306 with 'tourism_db'.
echo.

cd /d "%~dp0Backend\tourism-backend"

start "LankaScape Backend Server" cmd /k "mvnw.cmd spring-boot:run"

echo [2/2] Opening LankaScape Web Application in your Browser...
timeout /t 6 >nul
start "" "%~dp0Frontend\index.html"

echo.
echo ========================================================
echo   SUCCESS! The Project is now RUNNING!
echo ========================================================
echo.
echo   * Website: Opened in your browser!
echo   * Backend: Running in the 'LankaScape Backend Server' window (Port 8080).
echo.
echo   NOTE: Please keep the Backend Server window open while using 
echo         the website. Close it when you are done.
echo ========================================================
echo.
pause
