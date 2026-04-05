$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Lydia's Depanneur helper pack" -ForegroundColor Cyan
Write-Host "This installs the local helper layer after the PWA is already running well." -ForegroundColor DarkGray
Write-Host ""

$heartbeatsPath = Join-Path $PSScriptRoot "lydias-heartbeats.ics"
$liveAppUrl = "https://skill-deploy-sg0zb7ncya-codex-agent-deploys.vercel.app/zh-Hans"

try {
    Write-Host "Checking WSL availability..." -ForegroundColor Cyan
    $null = & wsl.exe -l -q 2>$null
    Write-Host "WSL is available." -ForegroundColor Green
}
catch {
    Write-Warning "WSL is not ready on this machine. OpenClaw works best with WSL2 on Windows."
}

Write-Host ""
Write-Host "Installing LM Studio from the official installer..." -ForegroundColor Cyan
Invoke-RestMethod -Uri "https://lmstudio.ai/install.ps1" | Invoke-Expression

Write-Host ""
Write-Host "Installing OpenClaw from the official Windows installer..." -ForegroundColor Cyan
$openClawInstaller = Invoke-WebRequest -Uri "https://openclaw.ai/install.ps1"
& ([scriptblock]::Create($openClawInstaller.Content)) -NoOnboard

Write-Host ""
Write-Host "Opening the OpenClaw onboarding and hooks docs..." -ForegroundColor Cyan
Start-Process "https://docs.openclaw.ai/start/wizard"
Start-Process "https://docs.openclaw.ai/automation/hooks"

if (Test-Path -LiteralPath $heartbeatsPath) {
    Write-Host "Opening the Lydia's heartbeat calendar file..." -ForegroundColor Cyan
    Start-Process -FilePath $heartbeatsPath
}
else {
    Write-Warning "lydias-heartbeats.ics was not found next to this script. Download it from the app docs panel."
}

if ($liveAppUrl -and $liveAppUrl -ne "LIVE_APP_URL") {
    Write-Host "Opening the live Lydia's app..." -ForegroundColor Cyan
    Start-Process $liveAppUrl
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Pin the Lydia's app in Chrome or Edge."
Write-Host "2. Import the heartbeat calendar into the calendar Defei actually uses."
Write-Host "3. Launch LM Studio once and confirm the local server is reachable."
Write-Host "4. Run 'openclaw onboard' only after the machine feels stable."
Write-Host ""
