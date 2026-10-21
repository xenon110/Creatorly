Add-Type -AssemblyName System.Drawing

$img3Path = "C:\Users\yashs\.gemini\antigravity-ide\brain\b689af9a-6d23-412a-a11c-9668f0d66536\.user_uploaded\media_1792221779103.png"
$img6Path = "C:\Users\yashs\.gemini\antigravity-ide\brain\b689af9a-6d23-412a-a11c-9668f0d66536\.user_uploaded\media_1792221836242.png"

$b3 = [System.Drawing.Bitmap]::FromFile($img3Path)
Write-Host "Image 3 size: $($b3.Width) x $($b3.Height)"

$b6 = [System.Drawing.Bitmap]::FromFile($img6Path)
Write-Host "Image 6 size: $($b6.Width) x $($b6.Height)"

# In Image 3 (1024x481), the 3 video thumbnails are:
# Card 1: x: 175, y: 175, w: 211, h: 177
# Card 2: x: 397, y: 175, w: 211, h: 177
# Card 3: x: 620, y: 175, w: 211, h: 177
$c1 = $b3.Clone([System.Drawing.Rectangle]::new(175, 175, 211, 177), $b3.PixelFormat)
$c1.Save("c:\Users\yashs\Downloads\influencer\public\images\work-flagship.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$c1.Dispose()

$c2 = $b3.Clone([System.Drawing.Rectangle]::new(397, 175, 211, 177), $b3.PixelFormat)
$c2.Save("c:\Users\yashs\Downloads\influencer\public\images\work-settings.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$c2.Dispose()

$c3 = $b3.Clone([System.Drawing.Rectangle]::new(620, 175, 211, 177), $b3.PixelFormat)
$c3.Save("c:\Users\yashs\Downloads\influencer\public\images\work-desk.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$c3.Dispose()

$b3.Dispose()

# In Image 6 (1024x481), the 3 talent portraits are:
# Card 1: x: 175, y: 160, w: 210, h: 195
# Card 2: x: 397, y: 160, w: 210, h: 195
# Card 3: x: 618, y: 160, w: 210, h: 195
$t1 = $b6.Clone([System.Drawing.Rectangle]::new(175, 160, 210, 195), $b6.PixelFormat)
$t1.Save("c:\Users\yashs\Downloads\influencer\public\images\talent-aarohi.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$t1.Dispose()

$t2 = $b6.Clone([System.Drawing.Rectangle]::new(397, 160, 210, 195), $b6.PixelFormat)
$t2.Save("c:\Users\yashs\Downloads\influencer\public\images\talent-maya.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$t2.Dispose()

$t3 = $b6.Clone([System.Drawing.Rectangle]::new(618, 160, 210, 195), $b6.PixelFormat)
$t3.Save("c:\Users\yashs\Downloads\influencer\public\images\talent-jun.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$t3.Dispose()

$b6.Dispose()

Write-Host "All assets cropped successfully!"
