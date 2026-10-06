Get-ChildItem -Path public\*.html | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $clean = $content -replace '[^\x00-\x7F]', ''
    Set-Content -Path $_.FullName -Value $clean -Encoding UTF8
}
Write-Host "Done stripping non-ASCII characters!"
