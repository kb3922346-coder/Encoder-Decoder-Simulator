# Lightweight Local HTTP Server for Digital Logic Simulator
$port = 8080
$folder = $PSScriptRoot
if (-not $folder) { $folder = (Get-Location).Path }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Digital Logic Simulator Server Running!        " -ForegroundColor Green
Write-Host "  URL: http://localhost:$port/                   " -ForegroundColor Yellow
Write-Host "  Serving: $folder                               " -ForegroundColor Gray
Write-Host "  Press Ctrl+C to stop the server                " -ForegroundColor Gray
Write-Host "=================================================" -ForegroundColor Cyan

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".txt"  = "text/plain; charset=utf-8"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path)) {
            $path = "index.html"
        }

        $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($folder, $path))

        # Basic security: ensure requested path is within project directory
        if (-not $fullPath.StartsWith($folder, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime
            $response.StatusCode = 200

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "[$([System.DateTime]::Now.ToString('HH:mm:ss'))] 200 GET /$path" -ForegroundColor Green
        } else {
            $response.StatusCode = 404
            $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $err.Length
            $response.OutputStream.Write($err, 0, $err.Length)
            Write-Host "[$([System.DateTime]::Now.ToString('HH:mm:ss'))] 404 GET /$path" -ForegroundColor Red
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}

