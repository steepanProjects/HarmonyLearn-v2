@echo off
REM Windows Setup Script for HarmonyLearn-v2
REM Run this script in Command Prompt or double-click to run

echo Setting up HarmonyLearn-v2 for Windows development...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js v18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm is not available. Please ensure Node.js is properly installed.
    pause
    exit /b 1
)

echo Installing project dependencies...
npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies. Please check your internet connection and try again.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo Please edit .env file with your configuration.
    ) else (
        echo No .env.example found. Please create .env file manually.
    )
)

REM Set up Git configuration for Windows
echo Configuring Git for Windows development...
git config --global core.autocrlf true
git config --global core.safecrlf false

echo.
echo Setup complete! You can now run:
echo   npm run dev        # Cross-platform development
echo   npm run dev:win    # Windows-specific development
echo   npm run build      # Build for production
echo.
echo For the best development experience on Windows:
echo - Use Windows Terminal or PowerShell
echo - Consider using WSL2 for Unix-like environment
echo - Enable Windows Developer Mode in Settings
echo.
pause
