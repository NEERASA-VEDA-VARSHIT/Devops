# Kubernetes Troubleshooting: Failure Scenarios & Resolution Drills

This directory contains 5 real-world production failure scenarios used to practice systematic root-cause isolation and recovery.

Each scenario directory includes:
- `broken.yaml`: The broken starter manifest reproducing the cluster failure.
- `fixed.yaml`: The production-grade corrected manifest resolving the root cause.

---

## 🛠️ Scenario Summary & Triage Guide

| Scenario | Failure Mode | Observed Symptom | Root Cause | Solution (`fixed.yaml`) |
| :--- | :--- | :--- | :--- | :--- |
| **01. CrashLoopBackOff** | Container process crashes on startup | Pod restarts continuously with exponential backoff | Missing mandatory `DATABASE_URL` environment variable | Injected valid `DATABASE_URL` and ensured stable background loop |
| **02. ImagePullBackOff** | Kubelet cannot fetch image | Status `ErrImagePull` / `ImagePullBackOff` | Typo in image repository and invalid tag `yatri-api-service:v999...` | Updated image to verified production image `nginx:1.25-alpine` |
| **03. Pending Pods** | Pod unscheduled | Pod remains in `Pending` indefinitely | Unrealistic resource requests (`500` CPU cores, `1000Gi` memory) | Right-sized requests to realistic values (`100m` CPU, `128Mi` RAM) |
| **04. DNS / Network Failure** | In-cluster service unreachable | Curl exits with timeout or connection refused | Client querying invalid non-existent hostname `postgres-db-wrong-name...` | Configured resolvable CoreDNS service FQDN |
| **05. OOMKilled (Exit 137)** | Linux kernel terminates process | Container terminates with Exit Code 137 | Python memory leak consuming 200MB against strict `20Mi` limit | Increased memory limit to `256Mi` and constrained memory allocation |

---

## 🚀 Execution & Verification

Deploy the broken starter workloads:
```bash
bash triage_all.sh
```

Apply all production fixes and verify healthy cluster recovery:
```bash
bash resolve_all.sh
```
