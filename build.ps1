# Rec. Studio — Build Windows (.exe)
# Requires: Node.js, npm

param(
    [switch]$Clean
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$app  = Join-Path $root "installer-app"

Write-Host ""
Write-Host "Rec. — Build Windows" -ForegroundColor Red
Write-Host "=====================" -ForegroundColor DarkGray
Write-Host ""

# Clean
if ($Clean) {
    Write-Host "Nettoyage..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "$app\dist" -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force "$app\node_modules" -ErrorAction SilentlyContinue
}

# Install deps
Write-Host "Installation des dependances..." -ForegroundColor Cyan
Set-Location $app
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install echoue" }

# Generate icon
Write-Host "Generation icone..." -ForegroundColor Cyan
node generate-icon.js

# Build
Write-Host "Build Electron (Windows NSIS)..." -ForegroundColor Cyan
npm run build-win
if ($LASTEXITCODE -ne 0) { throw "Build echoue" }

# Result
$exe = Get-ChildItem "$app\dist\*.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($exe) {
    Write-Host ""
    Write-Host "  Build reussi !" -ForegroundColor Green
    Write-Host "  Fichier : $($exe.FullName)" -ForegroundColor White
    Write-Host "  Taille  : $([math]::Round($exe.Length / 1MB, 1)) MB" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "Build termine — verifiez installer-app/dist/" -ForegroundColor Yellow
}
