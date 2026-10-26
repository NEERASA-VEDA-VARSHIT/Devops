#!/usr/bin/env bash
# ==============================================================================
# TaskBoard Cluster Prerequisites Installation Script
# Installs:
#   1. NGINX Ingress Controller (traffic routing for / and /api)
#   2. Kubernetes Metrics Server (required by HPA to read pod CPU utilization)
#   3. Prometheus Operator & Grafana Stack (kube-prometheus-stack)
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VALUES_FILE="$PROJECT_ROOT/monitoring/prometheus-values.yaml"

TARGET_ENV="${1:-eks}" # Options: 'eks' or 'minikube'

echo "========================================================================"
echo "Installing Cluster Prerequisites for Target Environment: $TARGET_ENV"
echo "========================================================================"

if [ "$TARGET_ENV" = "minikube" ]; then
  echo "--> Enabling Minikube Ingress addon..."
  minikube addons enable ingress

  echo "--> Enabling Minikube Metrics Server addon..."
  minikube addons enable metrics-server
else
  echo "--> [1/3] Installing NGINX Ingress Controller via Helm..."
  helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
  helm repo update ingress-nginx
  helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
    --namespace ingress-nginx --create-namespace \
    --set controller.service.type=LoadBalancer \
    --wait --timeout=300s

  echo "--> [2/3] Installing Kubernetes Metrics Server..."
  kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
fi

echo "--> [3/3] Installing Prometheus & Grafana (kube-prometheus-stack)..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update prometheus-community

if [ -f "$VALUES_FILE" ]; then
  helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
    --namespace monitoring --create-namespace \
    -f "$VALUES_FILE" \
    --wait --timeout=300s
else
  helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
    --namespace monitoring --create-namespace \
    --wait --timeout=300s
fi

echo "========================================================================"
echo "Cluster prerequisites installed and verified successfully!"
echo "Verify status with:"
echo "  kubectl get pods -n ingress-nginx"
echo "  kubectl get pods -n kube-system -l k8s-app=metrics-server"
echo "  kubectl get pods -n monitoring"
echo "========================================================================"
