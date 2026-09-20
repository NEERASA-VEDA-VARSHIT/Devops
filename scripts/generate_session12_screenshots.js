const { chromium } = require('playwright');
const path = require('path');
const { buildWindowsPowerShellTerminalHtml, renderScreenshot, baseDir } = require('./screenshot_helper');

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1536, height: 864 },
    deviceScaleFactor: 1
  });

  const outDir = path.join(baseDir, 'session-12-ingress-configmaps-secrets', 'screenshots');
  const sess = 'session-12-ingress-configmaps-secrets';

  // 01-configmap-describe.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl apply -f .\\01-configmap\\app-config.yaml' },
      { out: 'configmap/yatri-app-config created' },
      { cmd: 'kubectl describe configmap yatri-app-config' },
      { out: `Name:         yatri-app-config
Namespace:    default
Labels:       app=yatri
Annotations:  <none>

Data
====
DEFAULT_CURRENCY:
----
INR
ENVIRONMENT:
----
production
LOG_LEVEL:
----
INFO
MAX_BOOKING_DAYS:
----
30
PORT:
----
8000` },
      { cmd: "kubectl get configmap yatri-app-config -o jsonpath='{.data.ENVIRONMENT}'" },
      { out: 'production' },
      { cmd: "kubectl get configmap yatri-app-config -o jsonpath='{.data.LOG_LEVEL}'" },
      { out: 'INFO' }
    ]),
    path.join(outDir, '01-configmap-describe.png')
  );

  // 02-configmap-live-update.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl patch configmap yatri-app-config --type merge -p \'{"data":{"ENVIRONMENT":"staging"}}\'' },
      { out: 'configmap/yatri-app-config patched' },
      { cmd: 'kubectl exec -it deploy/yatri-backend -- env | Select-String "ENVIRONMENT"' },
      { out: `ENVIRONMENT=production
# Pod Immobility: Active container environment variables remain unchanged!` },
      { cmd: 'kubectl rollout restart deployment/yatri-backend' },
      { out: `deployment.apps/yatri-backend restarted
Waiting for deployment "yatri-backend" rollout to finish...
deployment "yatri-backend" successfully rolled out` },
      { cmd: 'kubectl exec -it deploy/yatri-backend -- env | Select-String "ENVIRONMENT"' },
      { out: `ENVIRONMENT=staging
# Updated value loaded successfully in newly scheduled pod!` }
    ]),
    path.join(outDir, '02-configmap-live-update.png')
  );

  // 03-secret-base64.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl apply -f .\\02-secret\\db-secret.yaml' },
      { out: 'secret/yatri-db-secret created' },
      { cmd: 'kubectl describe secret yatri-db-secret' },
      { out: `Name:         yatri-db-secret
Namespace:    default
Labels:       app=yatri
Type:         Opaque

Data
====
POSTGRES_PASSWORD:  14 bytes
POSTGRES_USER:      11 bytes` },
      { cmd: "[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String((kubectl get secret yatri-db-secret -o jsonpath='{.data.POSTGRES_PASSWORD}')))" },
      { out: 'secretpassword' },
      { cmd: "[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String((kubectl get secret yatri-db-secret -o jsonpath='{.data.POSTGRES_USER}')))" },
      { out: 'yatri_admin' }
    ]),
    path.join(outDir, '03-secret-base64.png')
  );

  // 04-trailing-newline-gotcha.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: '# Broken pattern: Echo appends newline (0x0A)' },
      { cmd: 'Format-Hex -InputObject ([System.Text.Encoding]::UTF8.GetBytes("secretpassword`n"))' },
      { out: `           00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
00000000   73 65 63 72 65 74 70 61 73 73 77 6F 72 64 0A        secretpassword.` },
      { cmd: '[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("secretpassword`n"))' },
      { out: 'c2VjcmV0cGFzc3dvcmQK' },
      { cmd: '# Correct pattern: exact byte stream without newline' },
      { cmd: 'Format-Hex -InputObject ([System.Text.Encoding]::UTF8.GetBytes("secretpassword"))' },
      { out: `           00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
00000000   73 65 63 72 65 74 70 61 73 73 77 6F 72 64           secretpassword` },
      { cmd: '[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("secretpassword"))' },
      { out: 'c2VjcmV0cGFzc3dvcmQ=' }
    ]),
    path.join(outDir, '04-trailing-newline-gotcha.png')
  );

  // 05-enterprise-secrets.png
  const enterpriseSecretText = `
ENTERPRISE SECRETS MANAGEMENT PIPELINE ARCHITECTURE:

[ Cloud Secrets Vault ]           [ CI/CD Pipeline ]
(AWS Secrets Manager /            (GitHub Actions /
 Azure Key Vault / Vault)          Azure DevOps)
          |                            |
   Encrypted Storage            Dynamic Injection
          |                            |
          v                            v
+-------------------------------------------------------------+
| KUBERNETES CLUSTER                                          |
|                                                             |
|   +-----------------------------------------------------+   |
|   | External Secrets Operator (ESO)                     |   |
|   | - Continuously watches Cloud Vault API              |   |
|   | - Pulls latest rotating credentials                 |   |
|   | - Synchronizes without manual YAML intervention     |   |
|   +--------------------------+--------------------------+   |
|                              |                              |
|                              v                              |
|   +-----------------------------------------------------+   |
|   | In-Memory Kubernetes Secret (Short-Lived Opaque)    |   |
|   | - Key: POSTGRES_PASSWORD                            |   |
|   +--------------------------+--------------------------+   |
|                              |                              |
|                              v                              |
|   +-----------------------------------------------------+   |
|   | Application Pod (Mounted via tmpfs RAM volume / env)|   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
  `;
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'Get-Content .\\enterprise-secrets-flow.txt' },
      { out: enterpriseSecretText }
    ]),
    path.join(outDir, '05-enterprise-secrets.png')
  );

  // 06-combined-injection.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl apply -f .\\04-full-demo\\configmap.yaml; kubectl apply -f .\\04-full-demo\\secret.yaml; kubectl apply -f .\\04-full-demo\\backend.yaml' },
      { out: 'configmap/yatri-app-config created\nsecret/yatri-db-secret created\ndeployment.apps/yatri-backend created\nservice/yatri-backend created' },
      { cmd: 'kubectl rollout status deployment/yatri-backend' },
      { out: 'deployment "yatri-backend" successfully rolled out' },
      { cmd: 'kubectl exec -it deploy/yatri-backend -- env | Select-String "ENVIRONMENT|LOG_LEVEL|POSTGRES|DEFAULT_CURRENCY"' },
      { out: `DEFAULT_CURRENCY=INR
ENVIRONMENT=production
LOG_LEVEL=INFO
POSTGRES_PASSWORD=secretpassword
POSTGRES_USER=yatri_admin
# Clean merge of plain-text ConfigMap keys and sensitive Secret credentials!` }
    ]),
    path.join(outDir, '06-combined-injection.png')
  );

  // 07-ingress-architecture.png
  const ingressTable = `
INGRESS RESOURCE vs INGRESS CONTROLLER DEMARCATION:

Feature                 Ingress Resource                Ingress Controller
--------------------    ----------------------------    ----------------------------
Definition              Declarative API Object (YAML)   Active Daemon Pod (Proxy)
Role                    Defines Rules, Hosts, Paths     Watches API, Updates Config
Execution Engine        Passive Metadata in etcd        Actively Routes Real Packets
Implementations         networking.k8s.io/v1 Ingress    ingress-nginx, Traefik, Kong
  `;
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'Get-Content .\\ingress-vs-controller.txt' },
      { out: ingressTable }
    ]),
    path.join(outDir, '07-ingress-architecture.png')
  );

  // 08-ingress-controller.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'minikube addons enable ingress' },
      { out: `* ingress is an active addon
* The 'ingress' addon is enabled` },
      { cmd: 'kubectl get pods -n ingress-nginx' },
      { out: `NAME                                        READY   STATUS      RESTARTS   AGE
ingress-nginx-admission-create-x2j9m        0/1     Completed   0          45s
ingress-nginx-admission-patch-v7l2w         0/1     Completed   0          44s
ingress-nginx-controller-7799c6795f-9k2pq   1/1     Running     0          45s` },
      { cmd: 'kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=120s' },
      { out: 'pod/ingress-nginx-controller-7799c6795f-9k2pq condition met' }
    ]),
    path.join(outDir, '08-ingress-controller.png')
  );

  // 09-hosts-mapping.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'minikube ip' },
      { out: '192.168.49.2' },
      { cmd: 'Select-String -Path C:\\Windows\\System32\\drivers\\etc\\hosts -Pattern "yatri.local"' },
      { out: `C:\\Windows\\System32\\drivers\\etc\\hosts:35:192.168.49.2  yatri.local portal.campus.local api.campus.local
# Workstation local DNS routing successfully configured to Minikube cluster IP` }
    ]),
    path.join(outDir, '09-hosts-mapping.png')
  );

  // 10-path-routing.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl apply -f .\\04-full-demo\\frontend.yaml; kubectl apply -f .\\04-full-demo\\backend.yaml; kubectl apply -f .\\04-full-demo\\ingress.yaml' },
      { out: `deployment.apps/yatri-frontend created\nservice/yatri-frontend created\ningress.networking.k8s.io/yatri-ingress created` },
      { cmd: 'kubectl get ingress yatri-ingress' },
      { out: `NAME            CLASS   HOSTS         ADDRESS        PORTS   AGE
yatri-ingress   nginx   yatri.local   192.168.49.2   80      25s` },
      { cmd: 'curl -s http://yatri.local/ | Select-String "<title>"' },
      { out: '<title>Welcome to nginx!</title>' },
      { cmd: 'curl -s http://yatri.local/api/' },
      { out: `{"status":"ok","environment":"production","log_level":"INFO","db_user":"yatri_admin","currency":"INR"}` }
    ]),
    path.join(outDir, '10-path-routing.png')
  );

  // 11-vhost-routing.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'curl -s -H "Host: portal.campus.local" http://192.168.49.2/ | Select-String "<title>"' },
      { out: '<title>Campus Student & Faculty Portal</title>' },
      { cmd: 'curl -s -H "Host: api.campus.local" http://192.168.49.2/api/' },
      { out: `{"service":"campus-core-api","version":"v2.4","status":"healthy","uptime":"99.98%"}` }
    ]),
    path.join(outDir, '11-vhost-routing.png')
  );

  // 12-hybrid-routing.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'kubectl apply -f .\\03-ingress\\ingress-tls.yaml' },
      { out: 'ingress.networking.k8s.io/campus-ingress-tls created' },
      { cmd: 'kubectl describe ingress campus-ingress-tls' },
      { out: `Name:             campus-ingress-tls
Namespace:        default
Address:          192.168.49.2
Ingress Class:    nginx
Rules:
  Host                 Path  Backends
  ----                 ----  --------
  portal.campus.local  /     yatri-frontend:80 (10.244.0.31:80)
  api.campus.local     /api  yatri-backend:8000 (10.244.0.32:8000)` }
    ]),
    path.join(outDir, '12-hybrid-routing.png')
  );

  // 13-tls-termination.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=campus.local/O=CampusDevOps"' },
      { out: 'Generating a 2048 bit RSA private key\nwriting new private key to \'tls.key\'' },
      { cmd: 'kubectl create secret tls campus-tls-cert --cert=tls.crt --key=tls.key' },
      { out: 'secret/campus-tls-cert created' },
      { cmd: 'curl -k -v --resolve portal.campus.local:443:192.168.49.2 https://portal.campus.local/ 2>&1 | Select-String "Server certificate|HTTP/|SSL connection"' },
      { out: `* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
* Server certificate: CN=campus.local, O=CampusDevOps
< HTTP/2 200` }
    ]),
    path.join(outDir, '13-tls-termination.png')
  );

  // 14-end-to-end-demo.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'bash .\\04-full-demo\\run-demo.sh' },
      { out: `[+] Deploying ConfigMap and Secret...
configmap/yatri-app-config created
secret/yatri-db-secret created
[+] Deploying Backend & Frontend services...
deployment.apps/yatri-backend created
service/yatri-backend created
deployment.apps/yatri-frontend created
service/yatri-frontend created
[+] Applying Ingress routing rules...
ingress.networking.k8s.io/yatri-ingress created
[SUCCESS] Full multi-tier Yatri stack deployed cleanly!` },
      { cmd: 'bash .\\04-full-demo\\cleanup.sh' },
      { out: `[+] Deleting Ingress...
ingress.networking.k8s.io "yatri-ingress" deleted
[+] Deleting Services & Deployments...
service "yatri-backend" deleted
deployment.apps "yatri-backend" deleted
service "yatri-frontend" deleted
deployment.apps "yatri-frontend" deleted
[+] Deleting Secrets and ConfigMaps...
secret "yatri-db-secret" deleted
configmap "yatri-app-config" deleted
[CLEAN] All resources safely decommissioned.` }
    ]),
    path.join(outDir, '14-end-to-end-demo.png')
  );

  await browser.close();
  console.log('Finished updating Session 12 screenshots to Windows PowerShell.');
}

run().catch(console.error);
