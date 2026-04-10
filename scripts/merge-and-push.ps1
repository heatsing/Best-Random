# Merge remote main into local main and push (no PR needed)
# Run when network is available: .\scripts\merge-and-push.ps1

Set-Location $PSScriptRoot\..

Write-Host "Fetching origin/main..." -ForegroundColor Cyan
git fetch origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "Fetch failed. Check network and try again." -ForegroundColor Red
  exit 1
}

Write-Host "Merging origin/main into main..." -ForegroundColor Cyan
git merge origin/main --no-edit
if ($LASTEXITCODE -ne 0) {
  Write-Host "Merge failed. If you see 'unrelated histories', run: git merge origin/main --allow-unrelated-histories --no-edit" -ForegroundColor Yellow
  Write-Host "Then fix any conflicts (git add . ; git commit), and: git push origin main" -ForegroundColor Yellow
  exit 1
}

Write-Host "Pushing main to origin..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "Push failed. Check network / permissions and try again." -ForegroundColor Red
  exit 1
}

Write-Host "Done. main is up to date and pushed." -ForegroundColor Green
