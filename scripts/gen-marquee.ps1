Add-Type -AssemblyName System.Drawing

$w = 1400
$h = 560
$dst = [System.Drawing.Bitmap]::new($w, $h)
$g = [System.Drawing.Graphics]::FromImage($dst)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'ClearTypeGridFit'
$g.InterpolationMode = 'HighQualityBicubic'
$g.PixelOffsetMode = 'HighQuality'

# Background gradient (deep navy, matches login)
$bg1 = [System.Drawing.ColorTranslator]::FromHtml('#0C1E3D')
$bg2 = [System.Drawing.ColorTranslator]::FromHtml('#040C1A')
$rect = [System.Drawing.Rectangle]::new(0, 0, $w, $h)
$brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, $bg1, $bg2, 135)
$g.FillRectangle($brush, $rect)

# Large blue glow top-right
$glow1 = [System.Drawing.Drawing2D.GraphicsPath]::new()
$glow1.AddEllipse(900, -200, 700, 700)
$glowBrush1 = [System.Drawing.Drawing2D.PathGradientBrush]::new($glow1)
$glowBrush1.CenterColor = [System.Drawing.Color]::FromArgb(70, 74, 144, 217)
$glowBrush1.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 74, 144, 217))
$g.FillPath($glowBrush1, $glow1)

# Subtle accent glow bottom-left
$glow2 = [System.Drawing.Drawing2D.GraphicsPath]::new()
$glow2.AddEllipse(-200, 300, 500, 500)
$glowBrush2 = [System.Drawing.Drawing2D.PathGradientBrush]::new($glow2)
$glowBrush2.CenterColor = [System.Drawing.Color]::FromArgb(40, 26, 79, 160)
$glowBrush2.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 26, 79, 160))
$g.FillPath($glowBrush2, $glow2)

# Icon (large)
$icon = [System.Drawing.Bitmap]::new('extension\icons\icon128.png')
$g.DrawImage($icon, 90, 110, 128, 128)

# Brushes
$white = [System.Drawing.Brushes]::White
$blue = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#4a90d9'))
$muted = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#a8b8d0'))
$mutedLight = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#8a9bb8'))

# Title
$fontTitle = [System.Drawing.Font]::new('Segoe UI', 72, [System.Drawing.FontStyle]::Bold)
$g.DrawString('SigaaUI', $fontTitle, $white, 230, 100)

# Subtitle
$fontSub = [System.Drawing.Font]::new('Segoe UI', 26, [System.Drawing.FontStyle]::Regular)
$g.DrawString('Redesign moderno do portal SIGAA', $fontSub, $muted, 236, 210)

# UFJ / UFG pill-like row
$fontTag = [System.Drawing.Font]::new('Segoe UI', 18, [System.Drawing.FontStyle]::Bold)
$g.DrawString([char]0x2022 + '  UFJ   ' + [char]0x2022 + '  UFG', $fontTag, $blue, 236, 265)

# Feature bullets (3 lines)
$fontFeat = [System.Drawing.Font]::new('Segoe UI Semibold', 16, [System.Drawing.FontStyle]::Regular)
$featY = 360
$g.DrawString([char]0x2713 + '  Dashboard, notas e matricula redesenhados', $fontFeat, $mutedLight, 90, $featY)
$g.DrawString([char]0x2713 + '  Modo claro e escuro  ' + [char]0x2022 + '  Sem tracking', $fontFeat, $mutedLight, 90, ($featY + 35))
$g.DrawString([char]0x2713 + '  100% client-side  ' + [char]0x2022 + '  Open source (MIT)', $fontFeat, $mutedLight, 90, ($featY + 70))

# Right-side decorative cards mock (simplified UI preview)
$cardBg = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(40, 255, 255, 255))
$cardBorder = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(30, 255, 255, 255), 1)

# Simulate three cards stacked
$cardX = 850
$cardW = 460

# Card 1 - header (profile-like)
$card1 = [System.Drawing.Rectangle]::new($cardX, 110, $cardW, 120)
$g.FillRectangle($cardBg, $card1)
$g.DrawRectangle($cardBorder, $card1)
$fontCardTitle = [System.Drawing.Font]::new('Segoe UI', 14, [System.Drawing.FontStyle]::Bold)
$fontCardSub = [System.Drawing.Font]::new('Segoe UI', 11, [System.Drawing.FontStyle]::Regular)
$g.DrawString('Bem-vindo, Estudante', $fontCardTitle, $white, $cardX + 24, 135)
$g.DrawString('Painel academico  ' + [char]0x2022 + '  2026.1', $fontCardSub, $muted, $cardX + 24, 160)
# Progress bar
$barBg = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(30, 255, 255, 255))
$barFg = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#4a90d9'))
$g.FillRectangle($barBg, ($cardX + 24), 195, 300, 6)
$g.FillRectangle($barFg, ($cardX + 24), 195, 210, 6)
$g.DrawString('70% concluido', $fontCardSub, $muted, $cardX + 334, 190)

# Card 2 - turmas
$card2 = [System.Drawing.Rectangle]::new($cardX, 250, $cardW, 120)
$g.FillRectangle($cardBg, $card2)
$g.DrawRectangle($cardBorder, $card2)
$g.DrawString('Turmas do Semestre', $fontCardTitle, $white, $cardX + 24, 270)
$g.DrawString('Arquitetura de Computadores', $fontCardSub, $muted, $cardX + 24, 300)
$g.DrawString('Engenharia de Software', $fontCardSub, $muted, $cardX + 24, 320)
$g.DrawString('Paradigmas de Programacao', $fontCardSub, $muted, $cardX + 24, 340)

# Card 3 - atividades
$card3 = [System.Drawing.Rectangle]::new($cardX, 390, $cardW, 120)
$g.FillRectangle($cardBg, $card3)
$g.DrawRectangle($cardBorder, $card3)
$g.DrawString('Atividades', $fontCardTitle, $white, $cardX + 24, 410)
$g.DrawString([char]0x23F1 + ' Questionario - Capitulo 2   [4 dias]', $fontCardSub, $muted, $cardX + 24, 440)
$g.DrawString([char]0x26A0 + ' Prova de ES   [Prazo encerrado]', $fontCardSub, $mutedLight, $cardX + 24, 465)

# Footer
$fontFoot = [System.Drawing.Font]::new('Segoe UI', 12, [System.Drawing.FontStyle]::Regular)
$g.DrawString('github.com/RubsNeto/SigaaUI', $fontFoot, $blue, 90, 495)

$dst.Save('promo-1400x560.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$dst.Dispose()
$icon.Dispose()
Write-Host "Gerado: promo-1400x560.png"
