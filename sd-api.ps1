#requires -Version 5.1
<#
.SYNOPSIS
  Quote-safe helper for calling the SuiteDash Secure API.

.DESCRIPTION
  Credentials are read from environment variables (or a .env file in this folder),
  NEVER hard-coded inline. This avoids the PowerShell double-quote interpolation bug
  that mangles bcrypt-style secrets ($2y$13$... gets parsed as $2y / $13 / $BQVv...
  variable references inside a double-quoted string). Env vars sidestep that entirely.

  Required vars:
    SUITEDASH_PUBLIC_ID    e.g. 339de287-...
    SUITEDASH_SECRET_KEY   the bcrypt-style secret ($2y$13$...)
  Optional:
    SUITEDASH_BASE         default https://secure.aitaxadvisers.com (white-label host)

.EXAMPLE
  # one-time, current shell only:
  $env:SUITEDASH_PUBLIC_ID  = '339de287-...'
  $env:SUITEDASH_SECRET_KEY = '$2y$13$...'
  . .\sd-api.ps1
  Invoke-SDApi '/secure-api/company/meta'

.EXAMPLE
  # or drop a .env file next to this script (see .env.example), then:
  . .\sd-api.ps1
  Invoke-SDApi '/secure-api/contacts' -Query @{ page = 1 }
#>

# --- Load .env (KEY=VALUE, # comments, no interpolation) if present ---------
function Import-SDEnv {
    param([string]$Path = (Join-Path $PSScriptRoot '.env'))
    if (-not (Test-Path $Path)) { return }
    foreach ($line in Get-Content -LiteralPath $Path) {
        $t = $line.Trim()
        if (-not $t -or $t.StartsWith('#')) { continue }
        $eq = $t.IndexOf('=')
        if ($eq -lt 1) { continue }
        $k = $t.Substring(0, $eq).Trim()
        $v = $t.Substring($eq + 1).Trim()
        # strip a single layer of surrounding quotes if the user added them
        if ($v.Length -ge 2 -and (($v[0] -eq '"' -and $v[-1] -eq '"') -or ($v[0] -eq "'" -and $v[-1] -eq "'"))) {
            $v = $v.Substring(1, $v.Length - 2)
        }
        # Set only if not already present in the process environment
        if (-not [Environment]::GetEnvironmentVariable($k, 'Process')) {
            [Environment]::SetEnvironmentVariable($k, $v, 'Process')
        }
    }
}
Import-SDEnv

function Get-SDHeaders {
    Import-SDEnv
    $pub = $env:SUITEDASH_PUBLIC_ID
    $sec = $env:SUITEDASH_SECRET_KEY
    if (-not $pub -or -not $sec) {
        throw "Missing credentials. Set SUITEDASH_PUBLIC_ID and SUITEDASH_SECRET_KEY (env vars or .env)."
    }
    if ($sec.Length -lt 50) {
        Write-Warning "SUITEDASH_SECRET_KEY is only $($sec.Length) chars - a full bcrypt secret is ~60. It may have been truncated by shell interpolation; use single quotes or a .env file."
    }
    @{
        'X-Public-ID'  = $pub
        'X-Secret-Key' = $sec
        'Accept'       = 'application/json'
    }
}

function Get-SDBase {
    if ($env:SUITEDASH_BASE) { return $env:SUITEDASH_BASE.TrimEnd('/') }
    return 'https://app.virtuallaunch.pro'
}

<#
.SYNOPSIS  Call any SuiteDash Secure API path and return the parsed object.
.PARAMETER Path    e.g. /secure-api/company/meta
.PARAMETER Method  GET (default), POST, PUT, DELETE
.PARAMETER Query   hashtable -> querystring, e.g. @{ page = 1 }
.PARAMETER Body    hashtable -> JSON body for POST/PUT
.PARAMETER Raw     return the raw response object instead of pretty JSON to host
#>
function Invoke-SDApi {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Path,
        [ValidateSet('GET','POST','PUT','DELETE')][string]$Method = 'GET',
        [hashtable]$Query,
        [hashtable]$Body,
        [switch]$Raw
    )
    $headers = Get-SDHeaders
    $uri = (Get-SDBase) + $Path
    if ($Query -and $Query.Count) {
        $pairs = $Query.GetEnumerator() | ForEach-Object {
            [Uri]::EscapeDataString($_.Key) + '=' + [Uri]::EscapeDataString([string]$_.Value)
        }
        $uri += '?' + ($pairs -join '&')
    }

    $params = @{ Uri = $uri; Headers = $headers; Method = $Method; ErrorAction = 'Stop' }
    if ($Body) {
        $params.Body        = ($Body | ConvertTo-Json -Depth 12)
        $params.ContentType = 'application/json'
    }

    try {
        $resp = Invoke-RestMethod @params
        if ($Raw) { return $resp }
        return $resp
    } catch {
        $code = $null
        if ($_.Exception.Response) { $code = $_.Exception.Response.StatusCode.value__ }
        Write-Host ("HTTP {0}  {1} {2}" -f $code, $Method, $uri) -ForegroundColor Red
        if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message }
        return $null
    }
}

Write-Host "SuiteDash helper loaded. Base: $(Get-SDBase)" -ForegroundColor Green
Write-Host "Usage: Invoke-SDApi '/secure-api/company/meta'   |   Invoke-SDApi '/secure-api/contacts' -Query @{ page = 1 }"
