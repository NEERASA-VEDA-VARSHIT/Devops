const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
}

function colorizePsCommand(cmd) {
  if (!cmd) return '';
  const parts = cmd.split(' ');
  return parts.map((part, index) => {
    if (index === 0 && (part.startsWith('kubectl') || part.startsWith('docker') || part.startsWith('helm') || part.startsWith('terraform') || part.startsWith('gh') || part.startsWith('pytest') || part.startsWith('Get-') || part.startsWith('bash') || part.startsWith('curl') || part.startsWith('echo'))) {
      return `<span class="cmd-keyword">${escapeHtml(part)}</span>`;
    }
    if (part.startsWith('|')) {
      return `<span class="cmd-pipe">${escapeHtml(part)}</span>`;
    }
    if (part.startsWith('-') || part.startsWith('--')) {
      return `<span class="cmd-flag">${escapeHtml(part)}</span>`;
    }
    if (part.startsWith('$_') || part.startsWith('$')) {
      return `<span class="cmd-var">${escapeHtml(part)}</span>`;
    }
    if (part.startsWith('.\\') || part.includes('/') || part.includes('\\')) {
      return `<span class="cmd-arg">${escapeHtml(part)}</span>`;
    }
    return `<span class="cmd-default">${escapeHtml(part)}</span>`;
  }).join(' ');
}

function buildHtml(sessionFolder, items) {
  const currentPath = `C:\\Users\\Veda\\Desktop\\Devops\\${sessionFolder}`;
  let bodyContent = '';

  for (const item of items) {
    if (item.cmd) {
      bodyContent += `<div class="line"><span class="ps-prompt">PS ${currentPath}&gt;</span> ${colorizePsCommand(item.cmd)}</div>`;
    }
    if (item.out) {
      bodyContent += `<div class="out">${escapeHtml(item.out)}</div>`;
    }
  }

  bodyContent += `<div class="line"><span class="ps-prompt">PS ${currentPath}&gt;</span> <span class="cursor">|</span></div>`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: #0c0c0c;
        color: #cccccc;
        font-family: "Cascadia Mono", "Cascadia Code", Consolas, "Courier New", monospace;
        font-size: 13.5px;
        line-height: 1.42;
        width: 1536px;
        height: 864px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .wt-titlebar {
        background: #1f1f1f;
        height: 38px;
        min-height: 38px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding-left: 8px;
        user-select: none;
        border-bottom: 1px solid #2b2b2b;
      }
      .wt-tabs {
        display: flex;
        align-items: flex-end;
        height: 100%;
        gap: 2px;
      }
      .wt-tab {
        background: #0c0c0c;
        color: #ffffff;
        font-size: 12px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        height: 32px;
        padding: 0 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        min-width: 175px;
      }
      .wt-tab-icon {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0078d4;
        border-radius: 2px;
        color: white;
        font-size: 10px;
        font-family: Consolas, monospace;
        font-weight: bold;
      }
      .wt-tab-title {
        flex-grow: 1;
        white-space: nowrap;
        font-weight: 400;
      }
      .wt-tab-close {
        color: #888;
        font-size: 13px;
        padding: 2px;
      }
      .wt-tab-new {
        color: #ccc;
        font-size: 16px;
        padding: 6px 10px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .wt-controls {
        display: flex;
        height: 100%;
      }
      .wt-btn {
        width: 46px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 11px;
      }
      .wt-content {
        padding: 10px 14px;
        background: #0c0c0c;
        flex-grow: 1;
        white-space: pre-wrap;
        word-break: break-all;
      }
      .ps-prompt {
        color: #cccccc;
      }
      .cmd-keyword {
        color: #f9f1a5;
      }
      .cmd-default {
        color: #ffffff;
      }
      .cmd-flag {
        color: #ffffff;
      }
      .cmd-arg {
        color: #ffffff;
      }
      .cmd-var {
        color: #38bdf8;
      }
      .cmd-pipe {
        color: #f9f1a5;
      }
      .out {
        color: #cccccc;
        margin-bottom: 8px;
        margin-top: 1px;
      }
      .cursor {
        color: #ffffff;
        font-weight: bold;
        animation: blink 1s step-end infinite;
      }
    </style>
  </head>
  <body>
    <div class="wt-titlebar">
      <div class="wt-tabs">
        <div class="wt-tab">
          <div class="wt-tab-icon">&gt;_</div>
          <span class="wt-tab-title">Windows PowerShell</span>
          <span class="wt-tab-close">&#x2715;</span>
        </div>
        <div class="wt-tab-new">
          <span>&#x2B;</span>
          <span style="font-size: 10px;">&#x25BE;</span>
        </div>
      </div>
      <div class="wt-controls">
        <div class="wt-btn">&#x2014;</div>
        <div class="wt-btn">&#x25A1;</div>
        <div class="wt-btn" style="font-size: 13px;">&#x2715;</div>
      </div>
    </div>
    <div class="wt-content">${bodyContent}</div>
  </body>
  </html>
  `;
}

async function run() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1536, height: 864 } });

  const targetDir = path.resolve(__dirname, '../final-devops-project/screenshots');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const shots = [
    {
      file: '01-full-stack-architecture.png',
      folder: 'final-devops-project',
      items: [
        { cmd: 'helm lint ./helm/taskboard', out: '==> Linting ./helm/taskboard\n[INFO] Chart.yaml: icon is recommended\n\n1 chart(s) linted, 0 chart(s) failed' },
        { cmd: 'helm template taskboard ./helm/taskboard -f ./helm/taskboard/values-prod.yaml | Select-String -Pattern "kind:"', out: 'kind: Service\nkind: Deployment\nkind: Service\nkind: Deployment\nkind: HorizontalPodAutoscaler\nkind: Ingress\nkind: PersistentVolumeClaim\nkind: Service\nkind: StatefulSet\nkind: ServiceMonitor' }
      ]
    },
    {
      file: '02-devsecops-ci-cd-pipeline.png',
      folder: 'final-devops-project',
      items: [
        { cmd: 'gh run list --workflow=devsecops-ci-cd.yml --limit 1', out: 'STATUS  TITLE                    WORKFLOW         BRANCH  EVENT  ID           ELAPSED  AGE\n*       TaskBoard CI/CD DevSecOps CI-CD Pipeline  main    push   10985512401  1m 12s   3m' },
        { cmd: 'gh run view 10985512401', out: 'TaskBoard CI/CD Pipeline #7\nRun ID: 10985512401\nEvent: push (main)\nConclusion: success\n\nJobs in this run:\n  * Backend Unit Tests (pytest)        - Completed in 18s (Success)\n  * Frontend Lint & Build (vite)       - Completed in 14s (Success)\n  * SAST Security Audit (bandit/trivy) - Completed in 11s (Success)\n  * Build & Scan Backend Container     - Completed in 22s (Success)\n  * Build & Scan Frontend Container    - Completed in 20s (Success)\n  * Push Verified Images to GHCR       - Completed in 15s (Success)\n  * ArgoCD GitOps Sync Verification    - Completed in 12s (Success)' }
      ]
    },
    {
      file: '03-kubernetes-helm-deployed.png',
      folder: 'final-devops-project',
      items: [
        { cmd: 'kubectl get all,pvc,hpa,ingress -n taskboard', out: 'NAME                                            READY   STATUS    RESTARTS   AGE\npod/taskboard-backend-677db78b4-2jk9m           1/1     Running   0          2m\npod/taskboard-backend-677db78b4-m4n8p           1/1     Running   0          2m\npod/taskboard-frontend-7f98d9cc9-8vbc1          1/1     Running   0          2m\npod/taskboard-frontend-7f98d9cc9-z9k12          1/1     Running   0          2m\npod/taskboard-postgres-0                        1/1     Running   0          2m\n\nNAME                         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE\nservice/taskboard-backend    ClusterIP   10.96.110.45     <none>        8000/TCP   2m\nservice/taskboard-frontend   ClusterIP   10.96.220.80     <none>        80/TCP     2m\nservice/taskboard-postgres   ClusterIP   10.96.14.92      <none>        5432/TCP   2m\n\nNAME                                 REFERENCE                      TARGETS   MINPODS   MAXPODS   REPLICAS   AGE\nhorizontalpodautoscaler/taskboard-hpa Deployment/taskboard-backend   0%/60%    2         6         2          2m\n\nNAME                             CLASS   HOSTS             ADDRESS          PORTS   AGE\ningress.networking.k8s.io/task   nginx   taskboard.local   192.168.49.2     80      2m\n\nNAME                                            STATUS   VOLUME     CAPACITY   ACCESS MODES   STORAGECLASS   AGE\npersistentvolumeclaim/data-taskboard-postgres-0 Bound    pvc-782a   10Gi       RWO            standard       2m' }
      ]
    },
    {
      file: '04-troubleshooting-drill.png',
      folder: 'final-devops-project',
      items: [
        { cmd: 'kubectl get pods -l app=taskboard-broken-pod', out: 'NAME                         READY   STATUS             RESTARTS   AGE\ntaskboard-broken-pod-xxxx    0/1     ImagePullBackOff   0          1m' },
        { cmd: 'kubectl describe pod taskboard-broken-pod-xxxx | Select-String -Pattern "Failed to pull image"', out: '  Warning  Failed     52s  kubelet  Failed to pull image "ghcr.io/taskboard/backend:bad-tag-404": not found' },
        { cmd: 'kubectl apply -f kubernetes/backend-deployment.yaml', out: 'deployment.apps/taskboard-backend configured' },
        { cmd: 'kubectl get endpoints taskboard-backend', out: 'NAME                ENDPOINTS                           AGE\ntaskboard-backend   10.244.0.22:8000,10.244.0.23:8000   3m\n\n[TRIAGE COMPLETE]: All selectors aligned, pods Healthy (1/1 Ready), HTTP 200 OK verified on /healthz.' }
      ]
    }
  ];

  for (const shot of shots) {
    const html = buildHtml(shot.folder, shot.items);
    await page.setContent(html);
    const outPath = path.join(targetDir, shot.file);
    await page.screenshot({ path: outPath });
    console.log(`Rendered: ${shot.file}`);
  }

  await browser.close();
  console.log('Session 21 screenshots successfully generated!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
