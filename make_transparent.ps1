Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("d:\Sites&Apps\ProfilePic\brain-line-art.png")
$bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.DrawImage($img, 0, 0)
$graphics.Dispose()
$img.Dispose()

# Fast pixel manipulation using LockBits
$rect = New-Object System.Drawing.Rectangle(0, 0, $bmp.Width, $bmp.Height)
$bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, $bmp.PixelFormat)

$bytes = [Math]::Abs($bmpData.Stride) * $bmp.Height
$rgbValues = New-Object byte[] $bytes
[System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $rgbValues, 0, $bytes)

for ($counter = 0; $counter -lt $rgbValues.Length; $counter += 4) {
    # Format32bppArgb: B G R A
    $b = $rgbValues[$counter]
    $g = $rgbValues[$counter + 1]
    $r = $rgbValues[$counter + 2]
    
    # Calculate luminance
    $lum = [int](0.299 * $r + 0.587 * $g + 0.114 * $b)
    
    # We want black to be opaque (A=255), white to be transparent (A=0)
    $newAlpha = 255 - $lum
    
    # Set to black with new alpha
    $rgbValues[$counter] = 0
    $rgbValues[$counter + 1] = 0
    $rgbValues[$counter + 2] = 0
    $rgbValues[$counter + 3] = $newAlpha
}

[System.Runtime.InteropServices.Marshal]::Copy($rgbValues, 0, $bmpData.Scan0, $bytes)
$bmp.UnlockBits($bmpData)

$bmp.Save("d:\Sites&Apps\ProfilePic\brain-line-art-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
