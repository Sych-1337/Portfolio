$url = 'https://sych-1337.github.io/Portfolio/'
$api = 'https://api.github.com/repos/Sych-1337/Portfolio/pages'
for ($i=0; $i -lt 12; $i++) {
  Write-Output "Attempt $($i+1): $(Get-Date -Format o)"
  try {
    $apiRespJson = curl.exe -s $api
    if ($apiRespJson -and $apiRespJson -ne '') {
      try { $apiResp = $apiRespJson | ConvertFrom-Json; Write-Output 'Pages API: OK'; $apiResp | ConvertTo-Json -Depth 2 | Write-Output } catch { Write-Output 'Pages API: not JSON or not found' }
    } else { Write-Output 'Pages API: empty' }
  } catch { Write-Output 'Pages API: error' }
  try {
    $head = curl.exe -I -s $url
    if ($head -match 'HTTP/1.1 200') { Write-Output 'HTTP: 200 OK'; break }
    elseif ($head -match 'HTTP/1.1 404') { Write-Output 'HTTP: 404' }
    else { Write-Output "HTTP: unknown`n$head" }
  } catch { Write-Output 'HTTP check failed' }
  Start-Sleep -Seconds 10
}
