# Nova Regime Daily Heartbeat — Claude Code Task Setup

## Updated Scheduled Task Instructions

Paste these instructions into the Claude Code scheduled task to replace the
current ones. The key changes:

1. **Runs the PowerShell script directly** instead of inline filesystem commands
2. **Falls back to inline logic** if the script isn't available locally
3. **No Desktop Commander dependency** — uses `execute_command` or native shell
4. **Better error handling** — partial results instead of full failure

---

### Instructions (copy this block)

```
You are Lyra Nova running the daily regime heartbeat for Chris Hicks
(case: Hicks v. Vigneau 500-04-079464-237).

PREFERRED: Run the heartbeat PowerShell script directly:

  powershell -ExecutionPolicy Bypass -File "C:\Users\Chris\repos\chrishicks-ca\nova-heartbeat.ps1"

If the script file is not available, run:

  powershell -ExecutionPolicy Bypass -Command "& { $date = Get-Date -Format 'yyyyMMdd'; $cutoff = (Get-Date).AddHours(-24); $logDir = 'G:\My Drive\01_Legal\09_TOOLS_AUTOMATION\logs'; $auditDir = 'G:\My Drive\01_Legal\.ai\audit'; Write-Host '# Nova Regime Heartbeat'; $optFiles = Get-ChildItem -Path $auditDir -Filter 'drive_optimize_safe_apply*.json' -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -ge $cutoff }; Write-Host \"## Drive Optimizer: $($optFiles.Count) runs\"; $newLogs = Get-ChildItem -Path $logDir -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -ge $cutoff -and !$_.PSIsContainer }; Write-Host \"## Agent Outputs: $($newLogs.Count) files\"; }"

Write the output to G:\My Drive\01_Legal\09_TOOLS_AUTOMATION\logs\daily_heartbeat_summary_{YYYYMMDD}.md using the current date.

Output format:
# Nova Regime Heartbeat — {DATE}
## Drive Optimizer: {N} runs, {bytes} deleted, {errors} errors
## Agent Outputs: {list or "none"}
## New Work Product: {list or "none"}
## New Evidence: {list or "none"}
## Scheduled Tasks: {status per task}
## Flags: {anything requiring attention, or "CLEAN"}

Use whatever tool is available (execute_command, bash, Desktop Commander) to run
the commands and write the file. If one tool fails, try the next.
```

---

## Fixing Skipped Runs

Runs get **skipped** when the computer is asleep/off at the scheduled time.
Options:

### Option A: Windows Task Scheduler (recommended)
Create a native Windows scheduled task as a backup:

```powershell
$action  = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument '-ExecutionPolicy Bypass -File "C:\Users\Chris\repos\chrishicks-ca\nova-heartbeat.ps1"'
$trigger = New-ScheduledTaskTrigger -Daily -At 9:00AM
$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName "Nova-DailyHeartbeat" `
    -Action $action -Trigger $trigger -Settings $settings `
    -Description "Nova regime daily heartbeat — runs even if machine wakes late"
```

The `-StartWhenAvailable` flag means if the PC was off at 9 AM, the task runs
as soon as it wakes up. This eliminates skipped runs.

### Option B: Adjust Claude Code schedule
Change the scheduled time to when the computer is reliably on (e.g., 10:30 AM
or 12:00 PM instead of 9:00 AM).

---

## Fixing the Apr 1 Error

The error was most likely caused by one of:
1. **Desktop Commander MCP not loaded** — the task instructions depend on it
2. **Google Drive not mounted** — G:\ wasn't available (Drive for Desktop
   sometimes takes a minute after login)
3. **Permission prompt not pre-approved** — task hit a permission it hadn't
   seen before

The updated instructions above fix (1) by not depending on Desktop Commander.
For (2), the PowerShell script handles missing paths gracefully with warnings
instead of hard errors.

For (3): Use **"Run now"** on the task to do a test run and pre-approve all
permission prompts. This stores the approvals for future automatic runs.
