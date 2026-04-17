# Converts all Chrome Web Store assets to 24-bit PNG without alpha channel.
# Required by Chrome Web Store upload validation.

Add-Type -AssemblyName System.Drawing

$files = @(
    'dashboard-store.png',
    'login-store.png',
    'matricula-store.png',
    'turmasMatricula-store.png',
    'promo-440x280.png',
    'promo-1400x560.png'
)

foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        Write-Host "Pulando (nao existe): $file"
        continue
    }
    $src = [System.Drawing.Bitmap]::new((Resolve-Path $file).Path)
    $dst = [System.Drawing.Bitmap]::new($src.Width, $src.Height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($dst)
    $g.Clear([System.Drawing.Color]::Black)
    $g.DrawImage($src, 0, 0, $src.Width, $src.Height)
    $g.Dispose()
    $src.Dispose()
    # Save as temp then replace original
    $tempPath = "$file.tmp"
    $dst.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dst.Dispose()
    Move-Item -Force $tempPath $file
    $verify = [System.Drawing.Bitmap]::new((Resolve-Path $file).Path)
    Write-Host ("{0,-32} {1,5}x{2,5}  format={3}" -f $file, $verify.Width, $verify.Height, $verify.PixelFormat)
    $verify.Dispose()
}

Write-Host "`nTodas as imagens convertidas para 24-bit PNG sem canal alfa."
