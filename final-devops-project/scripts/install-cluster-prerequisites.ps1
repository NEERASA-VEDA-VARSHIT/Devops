<#
.SYNOPSIS
    TaskBoard Cluster Prerequisites Installation Script (PowerShell for Windows)
.DESCRIPTION
    Installs:
      1. NGINX Ingress Controller (traffic routing for / and /api)
      2. Kubernetes Metrics Server (required by HPA to read pod CPU utilization)
      3. Prometheus Operator & Grafana Stack (kube-prometheus-stack)
.EXAMPLE
    .\install-cluster-prerequisites.ps1 -TargetEnv "eks"
    .\install-cluster-prerequisites.ps1 -TargetEnv "minikube"
#>

[CmdletBinding()]
param(
    [ValidateSet("eks", "minikube")]
    [string]$TargetEnv = "eks"
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$ValuesFile = Join-Path $ProjectRoot "monitoring\prometheus-values.yaml"

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "Installing Cluster Prerequisites for Target Environment: $TargetEnv" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan

if ($TargetEnv -eq "minikube") {
    Write-Host "--> Enabling Minikube Ingress addon..." -ForegroundColor Yellow
    minikube addons enable ingress

    Write-Host "--> Enabling Minikube Metrics Server addon..." -ForegroundColor Yellow
    minikube addons enable metrics-server
} else {
    Write-Host "--> [1/3] Installing NGINX Ingress Controller via Helm..." -ForegroundColor Yellow
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update ingress-nginx
    helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx `
        --namespace ingress-nginx --create-namespace `
        --set controller.service.type=LoadBalancer `
        --wait --timeout=300s

    Write-Host "--> [2/3] Installing Kubernetes Metrics Server..." -ForegroundColor Yellow
    kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
}

Write-Host "--> [3/3] Installing Prometheus & Grafana (kube-prometheus-stack)..." -ForegroundColor Yellow
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update prometheus-community

if (Test-Path $ValuesFile) {
    helm upgrade --install monitoring prometheus-community/kube-prometheus-stack `
        --namespace monitoring --create-namespace `
        -f $ValuesFile `
        --wait --timeout=300s
} else {
    helm upgrade --install monitoring prometheus-community/kube-prometheus-stack `
        --namespace monitoring --create-namespace `
        --wait --timeout=300s
}

Write-Host "========================================================================" -ForegroundColor Green
Write-Host "Cluster prerequisites installed and verified successfully!" -ForegroundColor Green
Write-Host "Verify status with:" -ForegroundColor Green
Write-Host "  kubectl get pods -n ingress-nginx" -ForegroundColor White
Write-Host "  kubectl get pods -n kube-system -l k8s-app=metrics-server" -ForegroundColor White
Write-Host "  kubectl get pods -n monitoring" -ForegroundColor White
Write-Host "========================================================================" -ForegroundColor Green
