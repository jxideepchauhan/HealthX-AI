@echo off
setlocal enabledelayedexpansion
echo ===================================================
echo Starting HealthX AI Microservices (Local + Wi-Fi)
echo ===================================================

cd /d "%~dp0"

:: Detect Local IPv4
for /f "tokens=4" %%a in ('route print ^| findstr 0.0.0.0.*0.0.0.0') do (
    if not defined LOCAL_IP set LOCAL_IP=%%a
)

echo Detected Host IP: %LOCAL_IP%
echo.

echo [1/3] Starting Python ML Service on Port 8000 (0.0.0.0:8000)...
start "HealthX - ML Service (Port 8000)" cmd /k "cd apps\ml-service && python main.py"

echo [2/3] Starting Express REST API Gateway on Port 4000 (0.0.0.0:4000)...
start "HealthX - API Gateway (Port 4000)" cmd /k "npm --workspace=@healthx/api run start"

echo [3/3] Starting Next.js Web Application on Port 3000 (0.0.0.0:3000)...
start "HealthX - Web Frontend (Port 3000)" cmd /k "npm --workspace=@healthx/web run start"

echo.
echo ===================================================
echo All 3 services are launching in separate windows!
echo.
echo Local Computer Access:
echo   - Web App:       http://localhost:3000
echo   - Login:         http://localhost:3000/login
echo   - API Docs:      http://localhost:4000/docs
echo   - ML Status:     http://localhost:8000/health
echo.
echo Wi-Fi / Phone Access (Same Wi-Fi Network):
echo   - Web App:       http://%LOCAL_IP%:3000
echo   - Login:         http://%LOCAL_IP%:3000/login
echo ===================================================
pause
