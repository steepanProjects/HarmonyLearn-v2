# Windows Development Guide

This guide provides specific instructions and tips for developing HarmonyLearn-v2 on Windows systems.

## Quick Start

1. **Run the setup script** (choose one):
   ```powershell
   # PowerShell (recommended)
   .\scripts\setup-windows.ps1
   
   # Command Prompt
   .\scripts\setup-windows.bat
   ```

2. **Start development**:
   ```bash
   npm run dev
   ```

## Windows-Specific Setup

### Prerequisites

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS version
   - Verify installation: `node --version`

2. **Git for Windows**
   - Download from [git-scm.com](https://git-scm.com/download/win)
   - Use default settings during installation
   - Verify installation: `git --version`

3. **Windows Terminal** (recommended)
   - Install from Microsoft Store
   - Provides better Unicode support and modern terminal features

### Development Environment Options

#### Option 1: Native Windows Development
- Use PowerShell or Command Prompt
- Run `npm run dev:win` for Windows-specific scripts
- Best for: Simple development, Windows-specific features

#### Option 2: Git Bash
- Provides Unix-like command line on Windows
- Run `npm run dev:unix` for Unix-style scripts
- Best for: Developers familiar with Unix commands

#### Option 3: WSL2 (Windows Subsystem for Linux)
- Install WSL2: `wsl --install`
- Access project: `cd /mnt/d/steepanProjects/HarmonyLearn-v2`
- Run `npm run dev:unix`
- Best for: Full Unix-like development experience

## Performance Optimization

### Windows Defender Exclusions
Add these folders to Windows Defender exclusions for better performance:

1. Open **Windows Security**
2. Go to **Virus & threat protection**
3. Click **Manage settings** under Virus & threat protection settings
4. Click **Add or remove exclusions**
5. Add these folders:
   - `node_modules`
   - `dist`
   - `.next` (if using Next.js)
   - Your project directory

### File System Optimization
1. **Enable Windows Developer Mode**:
   - Settings → Update & Security → For developers
   - Turn on Developer Mode

2. **Use SSD storage** for better file system performance

3. **Disable Windows Search indexing** for development folders:
   - Right-click project folder → Properties → Advanced
   - Uncheck "Allow files in this folder to have contents indexed"

## Common Issues and Solutions

### Issue: Permission Errors
**Solution**: Run PowerShell as Administrator
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Path Length Limitations
**Solution**: Enable long path support
1. Open Group Policy Editor (`gpedit.msc`)
2. Navigate to: Computer Configuration → Administrative Templates → System → Filesystem
3. Enable "Enable Win32 long paths"

### Issue: Git Line Ending Warnings
**Solution**: Configure Git properly
```bash
git config --global core.autocrlf true
git config --global core.safecrlf false
```

### Issue: Node.js Version Conflicts
**Solution**: Use Node Version Manager for Windows
```bash
# Install nvm-windows
# Download from: https://github.com/coreybutler/nvm-windows

# Install and use Node.js 18
nvm install 18
nvm use 18
```

### Issue: Port Already in Use
**Solution**: Kill process using the port or use a different port
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
npm run dev:port  # Uses port 3000
# Or set custom port
set PORT=3000&& npm run dev
```

### Issue: ENOTSUP Error (Operation Not Supported)
**Solution**: This is automatically handled by the server
- The server now automatically detects Windows and uses `localhost` instead of `0.0.0.0`
- If you still get this error, the server will automatically fallback to `localhost`
- This is a Windows networking limitation that's now handled gracefully

## Development Workflow

### Recommended Workflow
1. Use **Windows Terminal** with PowerShell
2. Use **VS Code** as your editor
3. Use **Git Bash** for Git operations
4. Run `npm run dev` for development

### VS Code Extensions for Windows Development
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**
- **Prettier - Code formatter**
- **ESLint**

### Terminal Configuration
For better development experience, configure your terminal:

**PowerShell Profile** (`$PROFILE`):
```powershell
# Set aliases
Set-Alias -Name ll -Value Get-ChildItem
Set-Alias -Name la -Value Get-ChildItem -Force

# Set default location
Set-Location "D:\steepanProjects\HarmonyLearn-v2"

# Custom prompt
function prompt {
    $currentPath = (Get-Location).Path
    $shortPath = $currentPath -replace [regex]::Escape($env:USERPROFILE), "~"
    Write-Host "PS " -NoNewline -ForegroundColor Blue
    Write-Host $shortPath -NoNewline -ForegroundColor Green
    Write-Host " > " -NoNewline -ForegroundColor White
    return " "
}
```

## Testing on Windows

### Browser Testing
Test your application in:
- **Microsoft Edge** (Chromium-based)
- **Google Chrome**
- **Firefox**
- **Internet Explorer 11** (if needed for legacy support)

### Cross-Platform Testing
1. Test on Windows (native)
2. Test in WSL2 (Linux environment)
3. Test on actual Linux/macOS if possible

## Deployment Considerations

### Windows Server Deployment
- Use **IIS** with **Node.js** or **PM2**
- Configure **Windows Firewall** for your application ports
- Set up **Windows Service** for automatic startup

### Docker on Windows
- Use **Docker Desktop for Windows**
- Enable **WSL2 backend** for better performance
- Use **Docker Compose** for multi-container applications

## Troubleshooting Commands

```powershell
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version

# Check available ports
netstat -ano | findstr :5000

# Check running Node.js processes
tasklist | findstr node

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## Additional Resources

- [Node.js on Windows](https://nodejs.org/en/download/package-manager/#windows)
- [Git for Windows](https://git-scm.com/download/win)
- [Windows Terminal](https://github.com/microsoft/terminal)
- [WSL2 Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [VS Code on Windows](https://code.visualstudio.com/docs/setup/windows)
