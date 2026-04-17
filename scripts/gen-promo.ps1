Add-Type -AssemblyName System.Drawing

$w = 440
$h = 280
$dst = [System.Drawing.Bitmap]::new($w, $h)
$g = [System.Drawing.Graphics]::FromImage($dst)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'ClearTypeGridFit'
$g.InterpolationMode = 'HighQualityBicubic'

# Background gradient (matches login page style)
$bg1 = [System.Drawing.ColorTranslator]::FromHtml('#0C1E3D')
$bg2 = [System.Drawing.ColorTranslator]::FromHtml('#040C1A')
$rect = [System.Drawing.Rectangle]::new(0, 0, $w, $h)
$brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, $bg1, $bg2, 135)
$g.FillRectangle($brush, $rect)

# Subtle blue accent glow (top-right)
$glow = [System.Drawing.Drawing2D.GraphicsPath]::new()
$glow.AddEllipse(280, -80, 260, 260)
$glowBrush = [System.Drawing.Drawing2D.PathGradientBrush]::new($glow)
$glowBrush.CenterColor = [System.Drawing.Color]::FromArgb(60, 74, 144, 217)
$glowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 74, 144, 217))
$g.FillPath($glowBrush, $glow)

# Icon
$icon = [System.Drawing.Bitmap]::new('extension\icons\icon128.png')
$g.DrawImage($icon, 40, 95, 90, 90)

# Typography
$white = [System.Drawing.Brushes]::White
$blue = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#4a90d9'))
$muted = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#a8b8d0'))

$fontTitle = [System.Drawing.Font]::new('Segoe UI', 30, [System.Drawing.FontStyle]::Bold)
$fontSub = [System.Drawing.Font]::new('Segoe UI', 13, [System.Drawing.FontStyle]::Regular)
$fontTag = [System.Drawing.Font]::new('Segoe UI', 12, [System.Drawing.FontStyle]::Bold)
$fontFoot = [System.Drawing.Font]::new('Segoe UI', 10, [System.Drawing.FontStyle]::Regular)

$g.DrawString('SigaaUI', $fontTitle, $white, 145, 90)
$g.DrawString('Redesign moderno do SIGAA', $fontSub, $muted, 148, 142)
$g.DrawString([char]0x2022 + ' UFJ   ' + [char]0x2022 + ' UFG', $fontTag, $blue, 148, 168)

$footText = 'Interface moderna  ' + [char]0x2022 + '  100% client-side  ' + [char]0x2022 + '  Open source'
$g.DrawString($footText, $fontFoot, $muted, 40, 240)

$dst.Save('promo-440x280.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$dst.Dispose()
$icon.Dispose()
Write-Host "Gerado: promo-440x280.png"
