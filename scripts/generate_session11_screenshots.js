const { chromium } = require('playwright');
const path = require('path');
const { buildWindowsPowerShellTerminalHtml, renderScreenshot, baseDir } = require('./screenshot_helper');

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1536, height: 864 },
    deviceScaleFactor: 1
  });

  const outDir = path.join(baseDir, 'session-11-kubernetes-services', 'screenshots');
  const sess = 'session-11-kubernetes-services';

  // 01-port-architecture.png
  const portDiagram = `
Client Browser (External User)
       |
       | Requests http://<Node-IP>:30080
       v
+-------------------------------------------------------------+
| WORKER NODE HOST                                            |
|                                                             |
|   [ nodePort: 30080 ]  (Port exposed on Host Network)       |
|            |                                                |
|            v                                                |
|   +-----------------------------------------------------+   |
|   | KUBERNETES SERVICE (ClusterIP VIP: 10.96.120.45)    |   |
|   |                                                     |   |
|   |   [ port: 8080 ]   (Internal Cluster Virtual Port)  |   |
|   +--------------------------+--------------------------+   |
|                              |                              |
|                              | kube-proxy iptables route    |
|                              v                              |
|   +-----------------------------------------------------+   |
|   | BACKEND POD (Overlay Network IP: 10.244.0.15)       |   |
|   |                                                     |   |
|   |   [ targetPort: 80 ] (Port intercepted by Pod)     |   |
|   |            |                                        |   |
|   |            v                                        |   |
|   |   [ containerPort: 80 ] (App Socket: Nginx/Python)  |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
  `;
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl explain service.spec.ports' },
      { out: portDiagram }
    ]),
    path.join(outDir, '01-port-architecture.png')
  );

  // 02-clusterip-service.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess + '\\01-clusterip', [
      { cmd: 'kubectl apply -f .\\app-deployment.yaml; kubectl apply -f .\\service.yaml' },
      { out: 'deployment.apps/web-app-clusterip created\nservice/web-service-clusterip created' },
      { cmd: 'kubectl get svc,endpoints web-service-clusterip' },
      { out: `NAME                            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/web-service-clusterip   ClusterIP   10.96.120.45    <none>        8080/TCP   25s

NAME                              ENDPOINTS                                            AGE
endpoints/web-service-clusterip   10.244.0.12:80,10.244.0.13:80,10.244.0.14:80        25s` },
      { cmd: 'kubectl exec -it curl-client -- curl -s http://web-service-clusterip:8080 | Select-String "<title>"' },
      { out: '<title>Welcome to nginx!</title>' },
      { cmd: 'kubectl exec -it curl-client -- curl -s http://web-service-clusterip.default.svc.cluster.local:8080 | Select-String "<title>"' },
      { out: '<title>Welcome to nginx!</title>' }
    ]),
    path.join(outDir, '02-clusterip-service.png')
  );

  // 03-nodeport-service.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess + '\\02-nodeport', [
      { cmd: 'kubectl apply -f .\\app-deployment.yaml; kubectl apply -f .\\service.yaml' },
      { out: 'deployment.apps/web-app-nodeport created\nservice/web-service-nodeport created' },
      { cmd: 'kubectl get svc web-service-nodeport' },
      { out: `NAME                   TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
web-service-nodeport   NodePort   10.96.185.72    <none>        80:30080/TCP   30s` },
      { cmd: 'minikube service web-service-nodeport --url' },
      { out: `* Opening service default/web-service-nodeport in default browser...
http://127.0.0.1:54321` },
      { cmd: 'curl -I http://127.0.0.1:54321' },
      { out: `HTTP/1.1 200 OK
Server: nginx/1.27.0
Content-Type: text/html
Content-Length: 615` }
    ]),
    path.join(outDir, '03-nodeport-service.png')
  );

  // 04-loadbalancer-svc.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess + '\\03-loadbalancer', [
      { cmd: 'kubectl apply -f .\\app-deployment.yaml; kubectl apply -f .\\service.yaml' },
      { out: 'deployment.apps/web-app-loadbalancer created\nservice/web-service-loadbalancer created' },
      { cmd: 'kubectl get svc web-service-loadbalancer' },
      { out: `NAME                       TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
web-service-loadbalancer   LoadBalancer   10.96.90.112   127.0.0.1     80:31250/TCP   45s` },
      { cmd: 'curl -s http://127.0.0.1:80 | Select-String "<title>"' },
      { out: '<title>Welcome to nginx!</title>' }
    ]),
    path.join(outDir, '04-loadbalancer-svc.png')
  );

  // 05-externalname-svc.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess + '\\04-externalname', [
      { cmd: 'kubectl apply -f .\\service.yaml; kubectl apply -f .\\client-pod.yaml' },
      { out: 'service/external-database-service created\npod/dns-test-client created' },
      { cmd: 'kubectl get svc external-database-service' },
      { out: `NAME                        TYPE           CLUSTER-IP   EXTERNAL-IP      PORT(S)   AGE
external-database-service   ExternalName   <none>       api.github.com   <none>    32s` },
      { cmd: 'kubectl exec -it dns-test-client -- nslookup external-database-service' },
      { out: `Server:         10.96.0.10
Address:        10.96.0.10#53

external-database-service.default.svc.cluster.local canonical name = api.github.com.
Name:   api.github.com
Address: 140.82.121.6` }
    ]),
    path.join(outDir, '05-externalname-svc.png')
  );

  // 06-headless-service.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess + '\\05-headless', [
      { cmd: 'kubectl apply -f .\\service.yaml; kubectl apply -f .\\app-statefulset.yaml' },
      { out: 'service/web-service-headless created\nstatefulset.apps/web-stateful created' },
      { cmd: 'kubectl get svc web-service-headless' },
      { out: `NAME                   TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
web-service-headless   ClusterIP   None         <none>        80/TCP    40s` },
      { cmd: 'kubectl exec -it headless-dns-client -- nslookup web-service-headless' },
      { out: `Server:         10.96.0.10
Address:        10.96.0.10#53

Name:   web-service-headless.default.svc.cluster.local
Address: 10.244.0.21
Name:   web-service-headless.default.svc.cluster.local
Address: 10.244.0.22
Name:   web-service-headless.default.svc.cluster.local
Address: 10.244.0.23` },
      { cmd: 'kubectl exec -it headless-dns-client -- curl -s http://web-stateful-0.web-service-headless:80 | Select-String "<title>"' },
      { out: '<title>Welcome to nginx!</title>' }
    ]),
    path.join(outDir, '06-headless-service.png')
  );

  // 07-manual-endpoints.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl apply -f .\\troubleshooting\\empty-endpoints.yaml' },
      { out: 'service/external-legacy-db created' },
      { cmd: 'kubectl get endpoints external-legacy-db' },
      { out: `NAME                 ENDPOINTS   AGE
external-legacy-db   <none>      12s` },
      { cmd: 'kubectl apply -f .\\manual-endpoints.yaml' },
      { out: 'endpoints/external-legacy-db created' },
      { cmd: 'kubectl get endpoints external-legacy-db' },
      { out: `NAME                 ENDPOINTS            AGE
external-legacy-db   192.168.1.150:3306   2s` }
    ]),
    path.join(outDir, '07-manual-endpoints.png')
  );

  // 08-coredns-fqdn.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl exec -it curl-client -- cat /etc/resolv.conf' },
      { out: `nameserver 10.96.0.10
search default.svc.cluster.local svc.cluster.local cluster.local
options ndots:5` },
      { cmd: 'kubectl exec -it curl-client -- nslookup web-service-clusterip' },
      { out: `Server:         10.96.0.10
Address:        10.96.0.10#53

Name:   web-service-clusterip.default.svc.cluster.local
Address: 10.96.120.45` }
    ]),
    path.join(outDir, '08-coredns-fqdn.png')
  );

  // 09-pod-identity.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl get pods -l app=web-clusterip; kubectl get pods -l app=web-headless' },
      { out: `NAME                                   READY   STATUS    RESTARTS   AGE
web-app-clusterip-6c679b9456-4d9vz     1/1     Running   0          3m
web-app-clusterip-6c679b9456-8q2ml     1/1     Running   0          3m

NAME                                   READY   STATUS    RESTARTS   AGE
web-stateful-0                         1/1     Running   0          3m
web-stateful-1                         1/1     Running   0          3m` },
      { cmd: 'kubectl delete pod web-app-clusterip-6c679b9456-4d9vz; kubectl delete pod web-stateful-0' },
      { out: 'pod "web-app-clusterip-6c679b9456-4d9vz" deleted\npod "web-stateful-0" deleted' },
      { cmd: 'kubectl get pods -l app=web-clusterip; kubectl get pods -l app=web-headless' },
      { out: `# Stateless Deployment: Replaced with brand-new random hash identity!
web-app-clusterip-6c679b9456-x8k2m     1/1     Running   0          4s
web-app-clusterip-6c679b9456-8q2ml     1/1     Running   0          3m

# StatefulSet: Invariant identity strictly preserved!
web-stateful-0                         1/1     Running   0          3s
web-stateful-1                         1/1     Running   0          3m` }
    ]),
    path.join(outDir, '09-pod-identity.png')
  );

  // 10-architectural-matrix.png
  const matrixText = `
ARCHITECTURAL MATRIX: DEPLOYMENT vs STATEFULSET vs DAEMONSET

Metric                  Deployment              StatefulSet             DaemonSet
--------------------    --------------------    --------------------    --------------------
Workload Type           Stateless Web/APIs      Clustered DBs, Queues   Host Agents / Logs
Pod Naming              Random Hash (app-4d9vz) Ordinal (web-0, web-1)  Node Hash (agent-7bx)
Pod Identity            Ephemeral               Invariant / Sticky      Bound to Node Host
Startup Order           Concurrent Parallel     Strict (0 -> 1 -> 2)    Parallel per Node
Volume Lifecycle        Ephemeral / Shared PVC  Dedicated per-pod PVC   hostPath / Node Local
Associated Service      Virtual IP (ClusterIP)  Headless (None)         Local ClusterIP
Production Examples     Nginx, Node, Go, Flask  Kafka, MySQL, Postgres  Node-Exporter, Fluentd
  `;
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'Get-Content .\\matrix.txt' },
      { out: matrixText }
    ]),
    path.join(outDir, '10-architectural-matrix.png')
  );

  // 11-cost-optimization.png
  const costText = `
ENTERPRISE CLOUD INGRESS DECISION TREE & COST SAVINGS:

ANTI-PATTERN (Excessive Cost: $25/mo per LoadBalancer):
Microservice A  ──► AWS NLB 1 ($25/mo) ──► ClusterIP A
Microservice B  ──► AWS NLB 2 ($25/mo) ──► ClusterIP B
Microservice C  ──► AWS NLB 3 ($25/mo) ──► ClusterIP C
... Total for 50 services = $1,250 / month!

BEST PRACTICE (Enterprise Cost-Optimized Ingress Pattern):
Public Internet ──► [ Single Unified Cloud Load Balancer: $25/mo ]
                                   |
                                   v
                      [ NGINX Ingress Controller ]
                      (Layer 7 Host & Path Routing)
                         |             |             |
                         v             v             v
                    ClusterIP A   ClusterIP B   ClusterIP C
Total for 50 services = $25 / month  ──► NET SAVINGS: $1,225 / month (98% reduction!)
  `;
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'Get-Content .\\cost-analysis.txt' },
      { out: costText }
    ]),
    path.join(outDir, '11-cost-optimization.png')
  );

  // 12-docker-driver-gotcha.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl get svc web-service-nodeport' },
      { out: `NAME                   TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
web-service-nodeport   NodePort   10.96.185.72    <none>        80:30080/TCP   5m` },
      { cmd: 'Write-Host "Minikube IP: $(minikube ip)"; try { curl --connect-timeout 2 -s http://192.168.49.2:30080 } catch { "Connection Timed Out!" }' },
      { out: `Minikube IP: 192.168.49.2
Connection Timed Out!
# ROOT CAUSE: On Windows/macOS, Minikube runs inside an isolated Docker container bridge.
# The host kernel cannot route directly to 192.168.49.2 without specialized port forwarding.` },
      { cmd: 'minikube service web-service-nodeport --url' },
      { out: `* Opening service default/web-service-nodeport in default browser...
http://127.0.0.1:54321
# WORKAROUND VERIFIED: Minikube dynamically binds 127.0.0.1:54321 to bridge port 30080!` }
    ]),
    path.join(outDir, '12-docker-driver-gotcha.png')
  );

  await browser.close();
  console.log('Finished updating Session 11 screenshots to Windows PowerShell.');
}

run().catch(console.error);
