#!/usr/bin/env bash
# ==============================================================================
# TaskBoard HPA Load Testing Generator (Session 21 Capstone)
# Generates high-concurrency requests to trigger CPU utilization above 60%
# Target URL can be overridden: URL="http://localhost:8000/api/tasks" ./load-test.sh
# ==============================================================================
set -euo pipefail

URL="${URL:-http://taskboard.local/api/tasks}"
REQUESTS="${REQUESTS:-1000}"
CONCURRENCY="${CONCURRENCY:-10}"

echo "=================================================================="
echo "Starting TaskBoard HPA Load Generator"
echo "Target: $URL | Total Requests: $REQUESTS | Concurrency: $CONCURRENCY"
echo "=================================================================="

# Function for worker thread
run_worker() {
  local count=$1
  for ((i=1; i<=count; i++)); do
    curl -s -o /dev/null "$URL" || true
  done
}

echo "Generating load... (watch 'kubectl get hpa -n taskboard -w' in another terminal)"
BATCH=$(( REQUESTS / CONCURRENCY ))

for ((c=1; c<=CONCURRENCY; c++)); do
  run_worker "$BATCH" &
done

wait
echo "Load test completed successfully. Check HPA scaling events with: kubectl get hpa -n taskboard"
