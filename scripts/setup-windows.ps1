# Windows Setup Script for HarmonyLearn-v2
# Run this script in PowerShell as Administrator for best results

Write-Host "Setting up HarmonyLearn-v2 for Windows development..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js v18 or higher from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm is not available. Please ensure Node.js is properly installed." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing project dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies. Please check your internet connection and try again." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Please edit .env file with your configuration." -ForegroundColor Yellow
    } else {
        Write-Host "No .env.example found. Please create .env file manually." -ForegroundColor Yellow
    }
}

# Set up Git configuration for Windows
Write-Host "Configuring Git for Windows development..." -ForegroundColor Yellow
git config --global core.autocrlf true
git config --global core.safecrlf false

# Check if Windows Defender exclusions are needed
Write-Host "For better performance, consider excluding node_modules from Windows Defender:" -ForegroundColor Yellow
Write-Host "1. Open Windows Security" -ForegroundColor Cyan
Write-Host "2. Go to Virus & threat protection" -ForegroundColor Cyan
Write-Host "3. Click 'Manage settings' under Virus & threat protection settings" -ForegroundColor Cyan
Write-Host "4. Click 'Add or remove exclusions'" -ForegroundColor Cyan
Write-Host "5. Add exclusion for folder: $(Get-Location)\node_modules" -ForegroundColor Cyan

Write-Host "`nSetup complete! You can now run:" -ForegroundColor Green
Write-Host "  npm run dev        # Cross-platform development" -ForegroundColor Cyan
Write-Host "  npm run dev:win    # Windows-specific development" -ForegroundColor Cyan
Write-Host "  npm run build      # Build for production" -ForegroundColor Cyan

Write-Host "`nFor the best development experience on Windows:" -ForegroundColor Yellow
Write-Host "- Use Windows Terminal or PowerShell" -ForegroundColor Cyan
Write-Host "- Consider using WSL2 for Unix-like environment" -ForegroundColor Cyan
Write-Host "- Enable Windows Developer Mode in Settings" -ForegroundColor Cyan
