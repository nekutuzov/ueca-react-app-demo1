# Deploy script - Copy build files to deployment folder
$deployPath = "..\ueca-react-app-demo1-deploy"
$repoUrl = "https://github.com/nekutuzov/ueca-react-app-demo1.git"

Write-Host "Building application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Deploying to $deployPath..." -ForegroundColor Cyan

# The deploy folder is a single-branch clone of gh-pages: the build is committed and pushed
# from there. Creating a bare directory instead leaves an unpushable folder while still
# reporting success, so clone when it is absent and refuse to guess when it is not a clone.
if (-not (Test-Path $deployPath)) {
    Write-Host "Deployment directory missing. Cloning gh-pages..." -ForegroundColor Yellow
    git clone --branch gh-pages --single-branch $repoUrl $deployPath
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Clone failed!" -ForegroundColor Red
        exit 1
    }
} elseif (-not (Test-Path (Join-Path $deployPath ".git"))) {
    Write-Host "$deployPath exists but is not a git clone, so the build cannot be pushed." -ForegroundColor Red
    Write-Host "Move it aside and re-run, or clone gh-pages there yourself:" -ForegroundColor Red
    Write-Host "  git clone --branch gh-pages --single-branch $repoUrl $deployPath" -ForegroundColor Red
    exit 1
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

# GitHub Pages is a static host with no SPA fallback, so a direct request for /charts has no file
# to serve and returns GitHub's own 404 page. Pages does serve 404.html for unmatched paths, and
# the app routes from window.location, so an identical copy makes deep links work.
Write-Host "Writing 404.html for SPA deep links..." -ForegroundColor Yellow
Copy-Item -Path (Join-Path $deployPath "index.html") -Destination (Join-Path $deployPath "404.html") -Force

# Ensure git remote is configured
Write-Host "Verifying git configuration..." -ForegroundColor Cyan
Push-Location $deployPath
$hasRemote = git remote | Select-String -Pattern "origin" -Quiet
if (-not $hasRemote) {
    Write-Host "Adding git remote..." -ForegroundColor Yellow
    git remote add origin $repoUrl
    Write-Host "Remote added successfully!" -ForegroundColor Green
} else {
    Write-Host "Git remote already configured." -ForegroundColor Green
}
Pop-Location

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Files copied to: $deployPath" -ForegroundColor Green
