const { chromium } = require('playwright');
const path = require('path');
const { buildWindowsPowerShellTerminalHtml, renderScreenshot, baseDir } = require('./screenshot_helper');

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1536, height: 864 },
    deviceScaleFactor: 1
  });

  const outDir = path.join(baseDir, 'session10-k8s-core-objects', 'screenshots');
  const sess = 'session10-k8s-core-objects';

  // Note: 01-cluster-health.png, 02-nginx-pod-operations.png, and 03-imagepullbackoff-error.png
  // are the user's direct physical screenshots from Windows Terminal!

  // 04-pod-lifecycle-stages.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl apply -f .\\hello.yml' },
      { out: 'pod/hello-pod created' },
      { cmd: 'kubectl get pods hello-pod -w' },
      { out: `NAME        READY   STATUS              RESTARTS   AGE
hello-pod   0/1     Pending             0          0s
hello-pod   0/1     ContainerCreating   0          2s
hello-pod   1/1     Running             0          4s
hello-pod   0/1     Completed           0          6s` },
      { cmd: 'kubectl logs hello-pod' },
      { out: `=========================================
Hello from Kubernetes Transient Lifecycle Demo!
Batch Job Process Completed with Exit Code 0
=========================================` }
    ]),
    path.join(outDir, '04-pod-lifecycle-stages.png')
  );

  // 05-lifecycle-probes-crashloop.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess + '\\pod-lifecycle', [
      { cmd: 'kubectl apply -f .\\02-pending.yaml' },
      { out: 'pod/lifecycle-pending created' },
      { cmd: 'kubectl get pod lifecycle-pending' },
      { out: `NAME                READY   STATUS    RESTARTS   AGE
lifecycle-pending   0/1     Pending   0          5s` },
      { cmd: 'kubectl describe pod lifecycle-pending | Select-String -Pattern "FailedScheduling"' },
      { out: 'Warning  FailedScheduling  default-scheduler  0/1 nodes available: 1 Insufficient memory.' },
      { cmd: 'kubectl apply -f .\\05-crashloopbackoff.yaml' },
      { out: 'pod/lifecycle-crashloop created' },
      { cmd: 'kubectl get pod lifecycle-crashloop' },
      { out: `NAME                  READY   STATUS             RESTARTS      AGE
lifecycle-crashloop   0/1     CrashLoopBackOff   3 (45s ago)   92s` },
      { cmd: 'kubectl apply -f .\\08-liveness.yaml' },
      { out: 'pod/lifecycle-liveness created' },
      { cmd: 'kubectl get pod lifecycle-liveness' },
      { out: `NAME                 READY   STATUS    RESTARTS      AGE
lifecycle-liveness   1/1     Running   1 (15s ago)   48s` }
    ]),
    path.join(outDir, '05-lifecycle-probes-crashloop.png')
  );

  // 05-lifecycle-init-multicontainer.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess + '\\pod-lifecycle', [
      { cmd: 'kubectl apply -f .\\10-init-container.yaml' },
      { out: `pod/lifecycle-init created\nInit Containers:\n  init-myservice:\n    Image: busybox:1.36\n    State: Terminated (Completed, Exit Code 0)` },
      { cmd: 'kubectl apply -f .\\11-multi-container.yaml' },
      { out: 'pod/lifecycle-multi-container created' },
      { cmd: 'kubectl get pod lifecycle-multi-container' },
      { out: `NAME                        READY   STATUS    RESTARTS   AGE
lifecycle-multi-container   2/2     Running   0          25s` },
      { cmd: 'kubectl logs lifecycle-multi-container -c sidecar' },
      { out: `[sidecar] 2026-09-20T17:22:10Z - Tail log reader streaming from /var/log/app.log:
[app-main] Incoming request processed: GET /healthz 200 OK
[sidecar] Shipped 1 telemetry record to aggregator.` }
    ]),
    path.join(outDir, '05-lifecycle-init-multicontainer.png')
  );

  // 06-controllers-rs-statefulset.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl apply -f .\\replicaset.yml' },
      { out: `replicaset.apps/nginx-rs created
NAME       DESIRED   CURRENT   READY   AGE
nginx-rs   3         3         3       15s` },
      { cmd: 'kubectl delete pod nginx-rs-k4g7x' },
      { out: `pod "nginx-rs-k4g7x" deleted
# Self-healing: ReplicaSet immediately provisions replacement pod
NAME              READY   STATUS        RESTARTS   AGE
nginx-rs-k4g7x    1/1     Terminating   0          30s
nginx-rs-m9p2w    1/1     Running       0          2s` },
      { cmd: 'kubectl apply -f .\\k8s-core-objects\\statefulset.yml' },
      { out: `statefulset.apps/mysql created
NAME      READY   STATUS    RESTARTS   AGE
mysql-0   1/1     Running   0          45s
mysql-1   1/1     Running   0          25s` }
    ]),
    path.join(outDir, '06-controllers-rs-statefulset.png')
  );

  // 07-daemonset-verification.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl apply -f .\\daemonset\\node-agent-ds.yaml' },
      { out: `daemonset.apps/node-agent created
NAME         DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
node-agent   1         1         1       1            1           <none>          20s` },
      { cmd: 'kubectl get pods -l app=node-agent -o wide' },
      { out: `NAME               READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
node-agent-7b4xq   1/1     Running   0          22s   10.244.0.9   minikube   <none>           <none>` }
    ]),
    path.join(outDir, '07-daemonset-verification.png')
  );

  // 08-rolling-update-and-rollback.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess + '\\01-rolling-update', [
      { cmd: 'kubectl apply -f .\\deployment-v1.yaml' },
      { out: 'deployment.apps/app-rolling created' },
      { cmd: 'kubectl apply -f .\\deployment-v2.yaml' },
      { out: 'deployment.apps/app-rolling configured' },
      { cmd: 'kubectl rollout status deployment/app-rolling' },
      { out: `Waiting for deployment "app-rolling" rollout to finish: 1 of 3 updated replicas are available...
Waiting for deployment "app-rolling" rollout to finish: 2 of 3 updated replicas are available...
deployment "app-rolling" successfully rolled out` },
      { cmd: 'kubectl rollout history deployment/app-rolling' },
      { out: `REVISION  CHANGE-CAUSE
1         <none>
2         kubectl apply --filename=deployment-v2.yaml` },
      { cmd: 'kubectl rollout undo deployment/app-rolling' },
      { out: `deployment.apps/app-rolling rolled back
deployment "app-rolling" successfully rolled out` }
    ]),
    path.join(outDir, '08-rolling-update-and-rollback.png')
  );

  // 09-troubleshooting-drills.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess + '\\troubleshooting', [
      { cmd: 'kubectl apply -f .\\broken-image.yaml' },
      { out: 'deployment.apps/yatri-backend created' },
      { cmd: 'kubectl rollout status deployment/yatri-backend --timeout=20s' },
      { out: `Waiting for deployment "yatri-backend" rollout to finish: 1 out of 3 new replicas have been updated...
error: timed out waiting for the condition` },
      { cmd: 'kubectl get pods -l app=yatri-backend' },
      { out: `NAME                             READY   STATUS             RESTARTS   AGE
yatri-backend-5d97bc8f4-6x2qm    0/1     ImagePullBackOff   0          35s
yatri-backend-7b89f894c-8pl2v    1/1     Running            0          3m
yatri-backend-7b89f894c-k9dfa    1/1     Running            0          3m` },
      { cmd: 'kubectl apply -f .\\selector-mismatch.yaml' },
      { out: `The Deployment "selector-error-demo" is invalid: spec.template.metadata.labels: Invalid value: map[string]string{"app":"frontend"}: \`selector\` does not match template \`labels\`` }
    ]),
    path.join(outDir, '09-troubleshooting-drills.png')
  );

  // 11-blue-green-cutover.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess + '\\02-blue-green', [
      { cmd: 'kubectl apply -f .\\deployment-blue.yaml; kubectl apply -f .\\deployment-green.yaml; kubectl apply -f .\\service-blue.yaml' },
      { out: 'deployment.apps/app-blue created\ndeployment.apps/app-green created\nservice/myapp-service created' },
      { cmd: 'curl -s http://192.168.49.2:30020 | Select-String "ENVIRONMENT"' },
      { out: '<p>BLUE ENVIRONMENT (v1) - Live Production Traffic</p>' },
      { cmd: 'kubectl apply -f .\\service-green.yaml' },
      { out: 'service/myapp-service configured' },
      { cmd: 'kubectl describe svc myapp-service | Select-String "Selector"' },
      { out: 'Selector:          app=myapp,slot=green' },
      { cmd: 'curl -s http://192.168.49.2:30020 | Select-String "ENVIRONMENT"' },
      { out: '<p>GREEN ENVIRONMENT (v2) - Instant Zero-Downtime Cutover!</p>' }
    ]),
    path.join(outDir, '11-blue-green-cutover.png')
  );

  // 12-canary-traffic-split.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess + '\\03-canary', [
      { cmd: 'kubectl get pods -l app=myapp-canary --show-labels' },
      { out: `NAME                          READY   STATUS    RESTARTS   AGE   LABELS
app-stable-64f9f7bfbb-2f8wq   1/1     Running   0          45s   app=myapp-canary,track=stable
app-stable-64f9f7bfbb-4k9pl   1/1     Running   0          45s   app=myapp-canary,track=stable
app-stable-64f9f7bfbb-8l2mx   1/1     Running   0          45s   app=myapp-canary,track=stable
app-canary-75b6d9c6df-x9qp2   1/1     Running   0          25s   app=myapp-canary,track=canary` },
      { cmd: '1..10 | ForEach-Object { curl -s http://192.168.49.2:30030 | Select-String -Pattern "STABLE v1|CANARY v2" }' },
      { out: `STABLE v1
STABLE v1
STABLE v1
CANARY v2    <-- Canary absorbs ~10% of total incoming requests (1/10 pods)
STABLE v1
STABLE v1
STABLE v1
STABLE v1
STABLE v1
STABLE v1` },
      { cmd: 'kubectl scale deployment app-canary --replicas=3; kubectl scale deployment app-stable --replicas=7' },
      { out: 'deployment.apps/app-canary scaled to 3 (30% traffic)\ndeployment.apps/app-stable scaled to 7 (70% traffic)' }
    ]),
    path.join(outDir, '12-canary-traffic-split.png')
  );

  // 13-recreate-downtime-outage.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess + '\\04-recreate', [
      { cmd: 'kubectl apply -f .\\deployment-v1.yaml; kubectl apply -f .\\service.yaml' },
      { out: 'deployment.apps/app-recreate created (Replicas: 3, Strategy: Recreate)' },
      { cmd: 'while ($true) { try { (curl -s --connect-timeout 1 http://192.168.49.2:30040) -match "VERSION: (.*)" | Out-Null; $matches[0] } catch { "[OUTAGE] Connection refused / 0 pods alive" }; Start-Sleep -Milliseconds 500 }' },
      { out: `VERSION: v1
VERSION: v1
VERSION: v1
# Triggering update: kubectl apply -f .\deployment-v2.yaml
[OUTAGE] Connection refused / 0 pods alive
[OUTAGE] Connection refused / 0 pods alive
[OUTAGE] Connection refused / 0 pods alive
[OUTAGE] Connection refused / 0 pods alive
VERSION: v2 (UPGRADED)
VERSION: v2 (UPGRADED)` },
      { cmd: 'kubectl rollout undo deployment/app-recreate' },
      { out: 'deployment.apps/app-recreate rolled back to revision 1' }
    ]),
    path.join(outDir, '13-recreate-downtime-outage.png')
  );

  await browser.close();
  console.log('Finished updating Session 10 screenshots to Windows PowerShell.');
}

run().catch(console.error);
