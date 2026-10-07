#!/usr/bin/env bash
# ==============================================================================
# Script: security/trivy-scan.sh
# Purpose: DevSecOps automated image vulnerability gate
# ==============================================================================

set -euo pipefail

IMAGE_NAME="${1:-taskboard-backend:latest}"
SEVERITY_LEVEL="${2:-HIGH,CRITICAL}"

echo "=================================================="
echo "    DEVSECOPS TRIVY CONTAINER VULNERABILITY GATE   "
echo "=================================================="
echo "Scanning Target Image: $IMAGE_NAME"
echo "Enforced Severity Threshold: $SEVERITY_LEVEL"
echo ""

if ! command -v trivy &> /dev/null; then
    echo "Trivy CLI is required. Please install Trivy."
    exit 1
fi

trivy image \
  --exit-code 1 \
  --severity "$SEVERITY_LEVEL" \
  --no-progress \
  "$IMAGE_NAME"

echo ""
echo "[SECURITY GATE PASSED]: Zero $SEVERITY_LEVEL vulnerabilities detected."
