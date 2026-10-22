Add-Type -AssemblyName System.Drawing
[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = 'WindowsRuntime'] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = 'WindowsRuntime'] | Out-Null
[Windows.Storage.StorageFile, Windows.Foundation, ContentType = 'WindowsRuntime'] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($null -eq $engine) {
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new('es'))
}

$outputFile = "c:\2026\Juego Skull King\plan\ocr_results.txt"
"" | Out-File -FilePath $outputFile -Encoding utf8

for ($i = 1; $i -le 28; $i++) {
    $num = "{0:D2}" -f $i
    $imgPath = "c:\2026\Juego Skull King\plan\pages\page_$num.jpg"
    $file = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imgPath).GetAwaiter().GetResult()
    $stream = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
    $decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
    $bitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()
    $ocrResult = $engine.RecognizeAsync($bitmap).GetAwaiter().GetResult()
    
    "=== PAGINA $i ===" | Out-File -FilePath $outputFile -Append -Encoding utf8
    $ocrResult.Text | Out-File -FilePath $outputFile -Append -Encoding utf8
    "`n" | Out-File -FilePath $outputFile -Append -Encoding utf8
    Write-Host "Page $i done"
}
Write-Host "All done!"
