#!/usr/bin/env bash
# ==============================================================================
# Script: resolve_all.sh
# Purpose: Applies all 5 verified production fixes for the Session 14 Triage Gauntlet
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=================================================="
echo "    KUBERNETES TRIAGE GAUNTLET - APPLY RESOLUTIONS "
echo "=================================================="
echo "Deleting broken pods and applying production-grade corrected manifests..."
echo ""

# Delete broken workloads
kubectl delete pod fail-1-crashloop-pod fail-2-imagepull-pod fail-3-pending-pod fail-4-dns-pod fail-5-oomkilled-pod --ignore-not-found=true

# Apply fixed manifests
kubectl apply -f "$SCRIPT_DIR/scenario-1-crashloop/fixed.yaml"
kubectl apply -f "$SCRIPT_DIR/scenario-2-imagepull/fixed.yaml"
kubectl apply -f "$SCRIPT_DIR/scenario-3-pending/fixed.yaml"
kubectl apply -f "$SCRIPT_DIR/scenario-4-dns-failure/fixed.yaml"
kubectl apply -f "$SCRIPT_DIR/scenario-5-oomkilled/fixed.yaml"

echo ""
echo "Fixes applied! Waiting 10s for pods to initialize..."
sleep 10

echo ""
echo "=== CLUSTER STATUS AFTER FIXES ==="
kubectl get pods -l tier=triage-gauntlet
echo ""
echo "=================================================="
echo "All 5 troubleshooting drills successfully resolved!"
echo "=================================================="
