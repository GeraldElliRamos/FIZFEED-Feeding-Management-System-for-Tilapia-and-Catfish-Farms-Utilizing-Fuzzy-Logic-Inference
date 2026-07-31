Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $projectRoot "backend"
$webDir = Join-Path $projectRoot "web"
$backendVenv = Join-Path $backendDir ".venv\Scripts\Activate.ps1"

if (-not (Test-Path $backendDir)) {
  throw "Backend folder not found: $backendDir"
}

if (-not (Test-Path $webDir)) {
  throw "Web folder not found: $webDir"
}

if (-not (Test-Path $backendVenv)) {
  throw "Backend virtual environment not found at $backendVenv. Create it first with: python -m venv .venv"
}

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$backendDir'; .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
) | Out-Null

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$webDir'; npm run dev"
) | Out-Null

Write-Host "Started backend on port 8000 and web app on port 5173."
Write-Host "Backend: http://localhost:8000/health"
Write-Host "Web: http://localhost:5173/"
