# Deploy script - Copy build files to deployment folder
$deployPath = "..\ueca-react-app-demo1-deploy"

Write-Host "Building application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Deploying to $deployPath..." -ForegroundColor Cyan

# Create deploy directory if it doesn't exist
if (-not (Test-Path $deployPath)) {
    Write-Host "Creating deployment directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $deployPath -Force | Out-Null
} else {
    # Remove old files from deploy directory (except .git)
    Write-Host "Cleaning deployment directory..." -ForegroundColor Yellow
    Get-ChildItem -Path $deployPath -Force | Where-Object { $_.Name -ne ".git" } | ForEach-Object {
        Remove-Item $_.FullName -Force -Recurse
    }
}

# Copy all files from dist to deploy directory
Write-Host "Copying files..." -ForegroundColor Yellow
Get-ChildItem -Path "dist" -Force | Where-Object { $_.Name -ne ".git" } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $deployPath -Recurse -Force
}

# Ensure git remote is configured
Write-Host "Verifying git configuration..." -ForegroundColor Cyan
Push-Location $deployPath
$hasRemote = git remote | Select-String -Pattern "origin" -Quiet
if (-not $hasRemote) {
    Write-Host "Adding git remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/nekutuzov/ueca-react-app-demo1.git
    Write-Host "Remote added successfully!" -ForegroundColor Green
} else {
    Write-Host "Git remote already configured." -ForegroundColor Green
}
Pop-Location

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Files copied to: $deployPath" -ForegroundColor Green
