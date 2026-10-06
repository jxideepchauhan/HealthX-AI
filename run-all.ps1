# HealthX AI One-Click Launch Script for PowerShell
$Root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $Root

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting HealthX AI Microservices" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

Write-Host "[1/3] Starting Python ML Service (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root\apps\ml-service'; python main.py"

Write-Host "[2/3] Starting Express REST API Gateway (Port 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root'; npm run dev:api"

Write-Host "[3/3] Starting Next.js Web Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root'; npm run dev:web"

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "Services started! Open in your browser:" -ForegroundColor Green
Write-Host "  - Web App:    http://localhost:3000" -ForegroundColor White
Write-Host "  - Login:      http://localhost:3000/login" -ForegroundColor White
Write-Host "  - API Docs:   http://localhost:4000/docs" -ForegroundColor White
Write-Host "  - ML Engine:  http://localhost:8000/health" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Green
