# HealthX AI One-Click Launch Script for PowerShell (Local + Wi-Fi)
$Root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $Root

# Detect Wi-Fi or primary IPv4
$WifiIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.InterfaceAlias -like "*Wi-Fi*" -or 
    $_.InterfaceAlias -like "*Wireless*" -or 
    $_.IPAddress -like "192.168.*" -or 
    $_.IPAddress -like "10.*" -or 
    $_.IPAddress -like "20.*" 
} | Select-Object -First 1).IPAddress

if (-not $WifiIP) {
    $WifiIP = "localhost"
}

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting HealthX AI Microservices (Local + Wi-Fi)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Detected Wi-Fi IP: $WifiIP" -ForegroundColor Green
Write-Host ""

Write-Host "[1/3] Starting Python ML Service (0.0.0.0:8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root\apps\ml-service'; python main.py"

Write-Host "[2/3] Starting Express REST API Gateway (0.0.0.0:4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root'; npm --workspace=@healthx/api run start"

Write-Host "[3/3] Starting Next.js Web Frontend (0.0.0.0:3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root'; npm --workspace=@healthx/web run start"

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "Services started! Open in your browser:" -ForegroundColor Green
Write-Host "Local Computer Access:" -ForegroundColor Cyan
Write-Host "  - Web App:      http://localhost:3000" -ForegroundColor White
Write-Host "  - Login Page:   http://localhost:3000/login" -ForegroundColor White
Write-Host "  - API Docs:     http://localhost:4000/docs" -ForegroundColor White
Write-Host "  - ML Engine:    http://localhost:8000/health" -ForegroundColor White
Write-Host ""
Write-Host "Wi-Fi / Mobile Access (Same Wi-Fi Network):" -ForegroundColor Cyan
Write-Host "  - Web App:      http://$WifiIP`:3000" -ForegroundColor Green
Write-Host "  - Login Page:   http://$WifiIP`:3000/login" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
