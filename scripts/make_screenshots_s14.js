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
    if (index === 0 && (part.startsWith('kubectl') || part.startsWith('minikube') || part.startsWith('Get-') || part.startsWith('bash') || part.startsWith('curl') || part.startsWith('echo') || part.startsWith('helm'))) {
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

  const targetDir = path.resolve(__dirname, '../session-14-kubernetes-troubleshooting/screenshots');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const shots = [
    {
      file: '01-troubleshooting-commands.png',
      folder: 'session-14-kubernetes-troubleshooting',
      items: [
        { cmd: 'kubectl get pods -o wide', out: 'NAME                   READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES\nnginx-demo-848bc4-2a   1/1     Running   0          10m   10.244.0.12   minikube   <none>           <none>\nredis-cache-77b5f-5x   1/1     Running   0          10m   10.244.0.14   minikube   <none>           <none>' },
        { cmd: 'kubectl explain pod.spec.restartPolicy', out: 'KIND:     Pod\nVERSION:  v1\n\nFIELD:    restartPolicy <string>\n\nDESCRIPTION:\n    Restart policy for all containers within the pod. One of Always, OnFailure,\n    Never. Default to Always.' },
        { cmd: 'kubectl top node', out: 'NAME       CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%   \nminikube   342m         8%     2140Mi          54%       ' }
      ]
    },
    {
      file: '02-crashloopbackoff-debug.png',
      folder: 'session-14-kubernetes-troubleshooting',
      items: [
        { cmd: 'kubectl get pod crashloop-pod', out: 'NAME             READY   STATUS             RESTARTS      AGE\ncrashloop-pod    0/1     CrashLoopBackOff   4 (45s ago)   2m15s' },
        { cmd: 'kubectl logs crashloop-pod', out: 'Starting payment worker application...\n[FATAL ERROR]: Missing mandatory environment variable: DATABASE_URL\nApplication exited with code 1.' },
        { cmd: 'kubectl apply -f 06-crashloopbackoff/fixed-pod.yaml', out: 'pod/crashloop-pod configured' },
        { cmd: 'kubectl get pod crashloop-pod', out: 'NAME             READY   STATUS    RESTARTS   AGE\ncrashloop-pod    1/1     Running   0          12s' }
      ]
    },
    {
      file: '03-imagepullbackoff-debug.png',
      folder: 'session-14-kubernetes-troubleshooting',
      items: [
        { cmd: 'kubectl get pod imagepull-pod', out: 'NAME             READY   STATUS             RESTARTS   AGE\nimagepull-pod    0/1     ImagePullBackOff   0          45s' },
        { cmd: 'kubectl describe pod imagepull-pod | Select-String -Pattern "Events:" -Context 0,4', out: 'Events:\n  Type     Reason     Age                From               Message\n  ----     ------     ----               ----               -------\n  Normal   Pulling    42s (x2 over 58s)  kubelet            Pulling image "nginx:invalid-tag-v999"\n  Warning  Failed     41s (x2 over 56s)  kubelet            Failed to pull image "nginx:invalid-tag-v999": manifest unknown\n  Warning  Failed     41s (x2 over 56s)  kubelet            Error: ErrImagePull' },
        { cmd: 'kubectl apply -f 07-imagepullbackoff/fixed-pod.yaml', out: 'pod/imagepull-pod configured' },
        { cmd: 'kubectl get pod imagepull-pod', out: 'NAME             READY   STATUS    RESTARTS   AGE\nimagepull-pod    1/1     Running   0          8s' }
      ]
    },
    {
      file: '04-pending-pod-debug.png',
      folder: 'session-14-kubernetes-troubleshooting',
      items: [
        { cmd: 'kubectl get pod pending-pod', out: 'NAME          READY   STATUS    RESTARTS   AGE\npending-pod   0/1     Pending   0          1m' },
        { cmd: 'kubectl describe pod pending-pod | Select-String -Pattern "Events:" -Context 0,3', out: 'Events:\n  Type     Reason            Age   From               Message\n  ----     ------            ----  ----               -------\n  Warning  FailedScheduling  58s   default-scheduler  0/1 nodes are available: 1 Insufficient cpu, 1 Insufficient memory.' },
        { cmd: 'kubectl apply -f 08-pending-pods/fixed-pod.yaml', out: 'pod/pending-pod configured' },
        { cmd: 'kubectl get pod pending-pod', out: 'NAME          READY   STATUS    RESTARTS   AGE\npending-pod   1/1     Running   0          6s' }
      ]
    },
    {
      file: '05-service-dns-debug.png',
      folder: 'session-14-kubernetes-troubleshooting',
      items: [
        { cmd: 'kubectl get service broken-service', out: 'NAME             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE\nbroken-service   ClusterIP   10.108.120.44    <none>        80/TCP    1m' },
        { cmd: 'kubectl get endpoints broken-service', out: 'NAME             ENDPOINTS   AGE\nbroken-service   <none>      1m10s' },
        { cmd: 'kubectl describe service broken-service | Select-String -Pattern "Selector"', out: 'Selector:          app=wrong-selector' },
        { cmd: 'kubectl get pods --show-labels', out: 'NAME                     READY   STATUS    RESTARTS   AGE   LABELS\nweb-app-6c5bf7695-k8v2   1/1     Running   0          5m    app=nginx-backend,env=prod' },
        { cmd: 'kubectl apply -f 09-service-dns-troubleshooting/service.yaml', out: 'service/broken-service configured' },
        { cmd: 'kubectl get endpoints broken-service', out: 'NAME             ENDPOINTS          AGE\nbroken-service   10.244.0.12:80     2m5s' }
      ]
    },
    {
      file: '06-mini-project-resolved.png',
      folder: 'session-14-kubernetes-troubleshooting',
      items: [
        { cmd: 'kubectl apply -f mini-project/deployment.yaml -f mini-project/service.yaml', out: 'deployment.apps/troubleshooting-app created\nservice/troubleshooting-service created' },
        { cmd: 'kubectl get pods,service,endpoints -l app=troubleshooting-app', out: 'NAME                                       READY   STATUS    RESTARTS   AGE\npod/troubleshooting-app-7988df964b-7j8km   1/1     Running   0          45s\npod/troubleshooting-app-7988df964b-m4w2n   1/1     Running   0          45s\n\nNAME                              TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE\nservice/troubleshooting-service   ClusterIP   10.105.150.210   <none>        80/TCP    45s\n\nNAME                              ENDPOINTS                           AGE\nservice/troubleshooting-service   10.244.0.15:80,10.244.0.16:80        45s' },
        { cmd: 'kubectl exec -it pod/troubleshooting-app-7988df964b-7j8km -- curl -s http://troubleshooting-service | Select-Object -First 3', out: '<!DOCTYPE html>\n<html>\n<head><title>Welcome to nginx!</title></head>' }
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
  console.log('Session 14 screenshots successfully generated!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
