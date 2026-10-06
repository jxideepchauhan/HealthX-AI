@echo off
echo ===================================================
echo Starting HealthX AI Microservices
echo ===================================================

cd /d "%~dp0"

echo [1/3] Starting Python ML Service on Port 8000...
start "HealthX - ML Service (Port 8000)" cmd /k "cd apps\ml-service && python main.py"

echo [2/3] Starting Express REST API Gateway on Port 4000...
start "HealthX - API Gateway (Port 4000)" cmd /k "npm run dev:api"

echo [3/3] Starting Next.js Web Application on Port 3000...
start "HealthX - Web Frontend (Port 3000)" cmd /k "npm run dev:web"

echo.
echo ===================================================
echo All 3 services are launching in separate windows!
echo - Web App:    http://localhost:3000
echo - Login Page: http://localhost:3000/login
echo - API Docs:   http://localhost:4000/docs
echo - ML Health:  http://localhost:8000/health
echo ===================================================
pause
