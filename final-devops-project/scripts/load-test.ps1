<#
.SYNOPSIS
    TaskBoard HPA Load Testing Generator (PowerShell for Windows)
.DESCRIPTION
    Generates high-concurrency requests to trigger CPU utilization above 60%
    so that the Horizontal Pod Autoscaler (HPA) triggers scaling events.
.EXAMPLE
    .\load-test.ps1 -Url "http://localhost:8000/api/tasks" -Requests 500 -Concurrency 5
#>

[CmdletBinding()]
param(
    [string]$Url = "http://taskboard.local/api/tasks",
    [int]$Requests = 1000,
    [int]$Concurrency = 10
)

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "Starting TaskBoard HPA Load Generator" -ForegroundColor Cyan
Write-Host "Target: $Url | Total Requests: $Requests | Concurrency: $Concurrency" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "Tip: In another terminal, watch scaling with: kubectl get hpa -n taskboard -w" -ForegroundColor Green

$batchSize = [math]::Floor($Requests / $Concurrency)
if ($batchSize -lt 1) { $batchSize = 1 }

$jobs = @()
for ($c = 1; $c -le $Concurrency; $c++) {
    $job = Start-Job -ScriptBlock {
        param($target, $count)
        $client = New-Object System.Net.Http.HttpClient
        for ($i = 1; $i -le $count; $i++) {
            try {
                $response = $client.GetAsync($target).GetAwaiter().GetResult()
            } catch {
                # Ignore transient connection errors during heavy scaling
            }
        }
        $client.Dispose()
    } -ArgumentList $Url, $batchSize
    $jobs += $job
}

Write-Host "Executing load generation across $Concurrency worker threads..."
$jobs | Wait-Job | Out-Null
$jobs | Remove-Job

Write-Host "==================================================================" -ForegroundColor Green
Write-Host "Load test completed! Check HPA status with:" -ForegroundColor Green
Write-Host "  kubectl get hpa -n taskboard" -ForegroundColor Yellow
Write-Host "  kubectl get pods -n taskboard -l app.kubernetes.io/name=backend" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Green
