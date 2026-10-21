Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\yashs\.gemini\antigravity-ide\brain\b689af9a-6d23-412a-a11c-9668f0d66536\.user_uploaded\media_1792221751910.png"
$destPath = "c:\Users\yashs\Downloads\influencer\public\images\alex-hero.png"

$bmp = [System.Drawing.Bitmap]::FromFile($sourcePath)
# The photo in image 1 is around: x=166, y=113, width=273, height=285
$rect = [System.Drawing.Rectangle]::new(166, 113, 273, 285)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$cropped.Dispose()
$bmp.Dispose()
Write-Host "CROP_SUCCESS"
