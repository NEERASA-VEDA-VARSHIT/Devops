# Session 21 — Kubernetes Troubleshooting Lab

This directory contains deliberately broken manifests designed to practice diagnosing and resolving production Kubernetes failures per **Session 21 Capstone Rubric (Troubleshooting Exercises)**.

---

## Lab 1: ImagePullBackOff / ErrImagePull (`broken-image.yaml`)

### 1. Symptom & Reproduction
Deploy the broken deployment into the `taskboard` namespace:
```bash
kubectl apply -f troubleshooting/broken-image.yaml
```

Check pod status:
```bash
kubectl get pods -n taskboard -l app=broken-image
```
*Observed Status:* `ErrImagePull` or `ImagePullBackOff`.

### 2. Diagnosis & Triage Steps
Inspect pod details and event logs:
```bash
kubectl describe pod -n taskboard -l app=broken-image
kubectl get events -n taskboard --sort-by=.lastTimestamp
```

*Expected Diagnostic Output:*
```text
Events:
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  45s                default-scheduler  Successfully assigned taskboard/taskboard-broken-image-xxx to node-1
  Normal   Pulling    12s (x3 over 44s)  kubelet            Pulling image "ghcr.io/example/taskboard-backend:does-not-exist"
  Warning  Failed     10s (x3 over 42s)  kubelet            Failed to pull image "ghcr.io/example/taskboard-backend:does-not-exist": rpc error: code = NotFound desc = failed to pull and unpack image: not found
  Warning  Failed     10s (x3 over 42s)  kubelet            Error: ErrImagePull
  Normal   BackOff    2s (x4 over 41s)   kubelet            Back-off pulling image "ghcr.io/example/taskboard-backend:does-not-exist"
  Warning  Failed     2s (x4 over 41s)   kubelet            Error: ImagePullBackOff
```

*Root Cause:* 
The deployment references a non-existent image tag `ghcr.io/example/taskboard-backend:does-not-exist` or has unauthorized registry access.

### 3. Remediation
Update the container image to a valid verified image (e.g., `ghcr.io/neerasa-veda-varshit/taskboard-backend:latest`):
```bash
kubectl set image deployment/taskboard-broken-image backend=ghcr.io/neerasa-veda-varshit/taskboard-backend:latest -n taskboard
```
Verify the pod transitions to `Running (1/1 Ready)`:
```bash
kubectl get pods -n taskboard -l app=broken-image
```

Cleanup:
```bash
kubectl delete -f troubleshooting/broken-image.yaml
```

---

## Lab 2: Broken Service / Endpoint Disconnect (`broken-service.yaml`)

### 1. Symptom & Reproduction
Deploy the broken service:
```bash
kubectl apply -f troubleshooting/broken-service.yaml
```

Attempt to query the service from within the cluster:
```bash
curl -I http://broken-service.taskboard.svc.cluster.local:8080
```
*Observed Symptom:* Request hangs or returns `502 Bad Gateway` / `Connection refused`.

### 2. Diagnosis & Triage Steps
Inspect the service and its registered endpoints:
```bash
kubectl get svc broken-service -n taskboard
kubectl get endpoints broken-service -n taskboard
```

*Observed Output:*
```text
NAME             ENDPOINTS
broken-service   <none>
```

Compare Service selector with actual Pod labels:
```bash
# View Service selector:
kubectl get svc broken-service -n taskboard -o jsonpath='{.spec.selector}'
# Output: {"app":"label-that-does-not-exist"}

# View actual pod labels in the namespace:
kubectl get pods -n taskboard --show-labels
```

*Root Cause:* 
A Service discovers backends via label selectors. The service selector `app: label-that-does-not-exist` matches zero pods, resulting in `ENDPOINTS <none>`. No traffic can be forwarded.

### 3. Remediation
Patch the Service selector to match the running backend pods (`app.kubernetes.io/name: backend` or `app: taskboard-backend`):
```bash
kubectl patch svc broken-service -n taskboard -p '{"spec":{"selector":{"app":"taskboard-backend"},"ports":[{"port":8000,"targetPort":8000}]}}'
```

Verify endpoints are now populated with pod IP addresses:
```bash
kubectl get endpoints broken-service -n taskboard
```
*Observed Output:*
```text
NAME             ENDPOINTS
broken-service   10.244.0.14:8000,10.244.0.15:8000
```

Cleanup:
```bash
kubectl delete -f troubleshooting/broken-service.yaml
```
