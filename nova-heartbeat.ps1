<#
.SYNOPSIS
    Nova Regime Daily Heartbeat — standalone PowerShell script.

.DESCRIPTION
    Audits drive optimizer logs, agent outputs, work product, evidence intake,
    and Windows Task Scheduler status, then writes a Markdown summary to the
    logs directory.

    Designed to be invoked directly by Windows Task Scheduler or referenced
    by a Claude Code scheduled task, removing the dependency on Desktop
    Commander MCP.

.NOTES
    Case: Hicks v. Vigneau 500-04-079464-237
    Repository: chrishicks78/chrishicks-ca
#>

param(
    [string]$DriveRoot = "G:\My Drive\01_Legal",
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

$date       = Get-Date -Format "yyyyMMdd"
$datePretty = Get-Date -Format "yyyy-MM-dd"
$cutoff     = (Get-Date).AddHours(-24)

$logDir     = Join-Path $DriveRoot "09_TOOLS_AUTOMATION\logs"
$auditDir   = Join-Path $DriveRoot ".ai\audit"
$workDir    = Join-Path $DriveRoot "03_CASE_ANALYSIS\Work_Product"
$evidDir    = Join-Path $DriveRoot "02_EVIDENCE_MASTER"
$outFile    = Join-Path $logDir "daily_heartbeat_summary_${date}.md"

# ---------- helpers ----------

function Safe-GetChildItem {
    param([string]$Path, [string]$Filter = "*", [switch]$Recurse)
    if (-not (Test-Path $Path)) {
        Write-Warning "Path not found: $Path"
        return @()
    }
    $params = @{ Path = $Path; Filter = $Filter; ErrorAction = "SilentlyContinue" }
    if ($Recurse) { $params.Recurse = $true }
    Get-ChildItem @params
}

function Files-Since {
    param([string]$Path, [datetime]$Since, [string]$Filter = "*", [switch]$Recurse)
    Safe-GetChildItem -Path $Path -Filter $Filter -Recurse:$Recurse |
        Where-Object { $_.LastWriteTime -ge $Since -and -not $_.PSIsContainer }
}

function Format-Bytes {
    param([long]$Bytes)
    if ($Bytes -ge 1MB) { return "{0:N1} MB" -f ($Bytes / 1MB) }
    if ($Bytes -ge 1KB) { return "{0:N1} KB" -f ($Bytes / 1KB) }
    return "$Bytes B"
}

# ---------- 1. Drive Optimizer Audit ----------

$optimizerFiles = Files-Since -Path $auditDir -Since $cutoff -Filter "drive_optimize_safe_apply*.json" -Recurse
$optRunCount    = ($optimizerFiles | Measure-Object).Count
$optTotalBytes  = 0
$optErrors      = 0

foreach ($f in $optimizerFiles) {
    try {
        $json = Get-Content $f.FullName -Raw | ConvertFrom-Json
        if ($json.deletedBytes) { $optTotalBytes += $json.deletedBytes }
        if ($json.errors)       { $optErrors     += $json.errors.Count }
    } catch {
        $optErrors++
    }
}

$section1 = "## Drive Optimizer: $optRunCount runs, $(Format-Bytes $optTotalBytes) deleted, $optErrors errors"

# ---------- 2. Agent Outputs ----------

$agentFiles = Files-Since -Path $logDir -Since $cutoff
$section2lines = @()
foreach ($f in $agentFiles) {
    $section2lines += "- ``$($f.Name)`` ($(Format-Bytes $f.Length))"
}
$section2 = if ($section2lines.Count -gt 0) {
    "## Agent Outputs:`n" + ($section2lines -join "`n")
} else {
    "## Agent Outputs: none"
}

# ---------- 3. New Work Product ----------

$wpFiles = Files-Since -Path $workDir -Since $cutoff -Recurse
$section3lines = @()
foreach ($f in $wpFiles) {
    $rel = $f.FullName.Replace($workDir, "").TrimStart("\")
    $section3lines += "- ``$rel`` ($(Format-Bytes $f.Length))"
}
$section3 = if ($section3lines.Count -gt 0) {
    "## New Work Product:`n" + ($section3lines -join "`n")
} else {
    "## New Work Product: none"
}

# ---------- 4. New Evidence Intake ----------

$evFiles = Files-Since -Path $evidDir -Since $cutoff -Recurse
$section4lines = @()
foreach ($f in $evFiles) {
    $rel = $f.FullName.Replace($evidDir, "").TrimStart("\")
    $section4lines += "- ``$rel`` ($(Format-Bytes $f.Length))"
}
$section4 = if ($evFiles.Count -gt 0) {
    "## New Evidence:`n" + ($section4lines -join "`n")
} else {
    "## New Evidence: none"
}

# ---------- 5. Scheduled Tasks ----------

$taskNames = @("Nova-DailyLegalAnalyzer", "Nova-DailyGapFiller", "Nova-DailyRICOAnalyzer")
$section5lines = @()

foreach ($tn in $taskNames) {
    try {
        $info = schtasks /query /tn $tn /fo LIST 2>&1
        if ($LASTEXITCODE -ne 0) {
            $section5lines += "- **${tn}**: NOT FOUND"
        } else {
            $lastRun = ($info | Select-String "Last Run Time") -replace ".*:\s+", ""
            $result  = ($info | Select-String "Last Result")  -replace ".*:\s+", ""
            $status  = if ($result -eq "0") { "OK" } else { "RESULT=$result" }
            $section5lines += "- **${tn}**: last=$lastRun status=$status"
        }
    } catch {
        $section5lines += "- **${tn}**: QUERY ERROR"
    }
}

$section5 = "## Scheduled Tasks:`n" + ($section5lines -join "`n")

# ---------- 6. Flags ----------

$flags = @()
if ($optErrors -gt 0)        { $flags += "Drive optimizer reported $optErrors error(s)" }
if ($optRunCount -eq 0)      { $flags += "No drive optimizer runs in last 24h" }
if ($evFiles.Count -gt 0)    { $flags += "$($evFiles.Count) new evidence file(s) — review recommended" }

$section6 = if ($flags.Count -gt 0) {
    "## Flags:`n" + (($flags | ForEach-Object { "- $_" }) -join "`n")
} else {
    "## Flags: CLEAN"
}

# ---------- assemble ----------

$summary = @"
# Nova Regime Heartbeat - $datePretty
$section1
$section2
$section3
$section4
$section5
$section6
"@

if ($DryRun) {
    Write-Host $summary
} else {
    if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }
    $summary | Out-File -FilePath $outFile -Encoding utf8
    Write-Host "Heartbeat written to $outFile"
}
