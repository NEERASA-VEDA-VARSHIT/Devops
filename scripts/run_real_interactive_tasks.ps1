# Interactive Task Runner for Live Kubernetes Exercises
# Run this directly in your Windows Terminal: powershell -ExecutionPolicy Bypass -File .\scripts\run_real_interactive_tasks.ps1

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  DevOps Season 2: Live Cluster Interactive Task Runner   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose an option to execute commands live in your terminal:" -ForegroundColor Yellow
Write-Host " [1] Lecture 09: Minikube & Cluster Lifecycle"
Write-Host " [2] Lecture 10: Pods, Lifecycle & Controllers"
Write-Host " [3] Lecture 11: Services (ClusterIP, NodePort, LoadBalancer)"
Write-Host " [4] Lecture 12: Ingress, ConfigMaps & Secrets"
Write-Host " [Q] Quit"
Write-Host ""

$choice = Read-Host "Enter option (1-4 or Q)"

switch ($choice) {
    "1" {
        Set-Location "session9-k8s"
        Clear-Host
        Write-Host "--- TASK 1: Version Checks ---" -ForegroundColor Green
        Write-Host "PS $PWD> minikube version" -ForegroundColor White
        minikube version
        Write-Host "PS $PWD> kubectl version --client" -ForegroundColor White
        kubectl version --client
        Write-Host "`n>>> Press Win + Shift + S to take screenshot 01-version-check.png <<<" -ForegroundColor Yellow
        Pause

        Write-Host "`n--- TASK 2 & 3: Minikube Status & Nodes ---" -ForegroundColor Green
        Write-Host "PS $PWD> minikube status" -ForegroundColor White
        minikube status
        Write-Host "PS $PWD> kubectl get nodes -o wide" -ForegroundColor White
        kubectl get nodes -o wide
        Write-Host "`n>>> Press Win + Shift + S to take screenshot 03-minikube-status.png <<<" -ForegroundColor Yellow
        Pause
    }
    "2" {
        Set-Location "session10-k8s-core-objects"
        Clear-Host
        Write-Host "--- Running Session 10 Tasks ---" -ForegroundColor Green
        kubectl get nodes -o wide
        kubectl apply -f .\pod.yml
        Start-Sleep -Seconds 3
        kubectl get pods -o wide
        kubectl logs nginx-pod
        kubectl delete -f .\pod.yml
        Write-Host "`n>>> Ready for capture <<<" -ForegroundColor Yellow
        Pause
    }
    "3" {
        Set-Location "session-11-kubernetes-services"
        Clear-Host
        Write-Host "--- Running Session 11 Tasks ---" -ForegroundColor Green
        kubectl apply -f .\01-clusterip\app-deployment.yaml
        kubectl apply -f .\01-clusterip\service.yaml
        kubectl get svc,endpoints web-service-clusterip
        Write-Host "`n>>> Ready for capture <<<" -ForegroundColor Yellow
        Pause
    }
    "4" {
        Set-Location "session-12-ingress-configmaps-secrets"
        Clear-Host
        Write-Host "--- Running Session 12 Tasks ---" -ForegroundColor Green
        kubectl apply -f .\01-configmap\app-config.yaml
        kubectl describe configmap yatri-app-config
        Write-Host "`n>>> Ready for capture <<<" -ForegroundColor Yellow
        Pause
    }
    default {
        Write-Host "Exiting." -ForegroundColor Gray
    }
}
