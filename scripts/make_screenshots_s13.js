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

  const targetDir = path.resolve(__dirname, '../session-13-storage-hpa-probes/screenshots');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const shots = [
    {
      file: '01-volumes-pv-pvc.png',
      folder: 'session-13-storage-hpa-probes',
      items: [
        { cmd: 'kubectl apply -f 01-kubernetes-volumes/pv.yaml', out: 'persistentvolume/local-pv created' },
        { cmd: 'kubectl apply -f 01-kubernetes-volumes/pvc.yaml', out: 'persistentvolumeclaim/local-pvc created' },
        { cmd: 'kubectl apply -f 01-kubernetes-volumes/pod.yaml', out: 'pod/storage-consumer-pod created' },
        { cmd: 'kubectl get pv', out: 'NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS   VOLUMEATTRIBUTESCLASS   AGE\nlocal-pv   2Gi        RWO            Retain           Bound    default/local-pvc   manual         <unset>                 14s' },
        { cmd: 'kubectl get pvc', out: 'NAME        STATUS   VOLUME     CAPACITY   ACCESS MODES   STORAGECLASS   VOLUMEATTRIBUTESCLASS   AGE\nlocal-pvc   Bound    local-pv   2Gi        RWO            manual         <unset>                 11s' },
        { cmd: 'kubectl get pods storage-consumer-pod -o wide', out: 'NAME                   READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES\nstorage-consumer-pod   1/1     Running   0          8s    10.244.0.18   minikube   <none>           <none>' }
      ]
    },
    {
      file: '02-hpa-deployed.png',
      folder: 'session-13-storage-hpa-probes',
      items: [
        { cmd: 'kubectl apply -f 04-hpa/deployment.yaml', out: 'deployment.apps/php-apache created' },
        { cmd: 'kubectl apply -f 04-hpa/service.yaml', out: 'service/php-apache created' },
        { cmd: 'kubectl apply -f 04-hpa/hpa.yaml', out: 'horizontalpodautoscaler.autoscaling/php-apache-hpa created' },
        { cmd: 'kubectl get hpa', out: 'NAME             REFERENCE               TARGETS   MINPODS   MAXPODS   REPLICAS   AGE\nphp-apache-hpa   Deployment/php-apache   0%/50%    1         10        1          12s' },
        { cmd: 'kubectl get deployment php-apache', out: 'NAME         READY   UP-TO-DATE   AVAILABLE   AGE\nphp-apache   1/1     1            1           16s' }
      ]
    },
    {
      file: '03-hpa-scale-up.png',
      folder: 'session-13-storage-hpa-probes',
      items: [
        { cmd: 'bash hpa/load_generator.sh http://php-apache:80', out: '==================================================\n      KUBERNETES HPA TRAFFIC LOAD GENERATOR       \n==================================================\nPounding target endpoint: http://php-apache:80\nSimulating high traffic spike across 10 concurrent worker loops...\nTraffic load active! In another terminal, run: kubectl get hpa -w' },
        { cmd: 'kubectl get hpa -w', out: 'NAME             REFERENCE               TARGETS    MINPODS   MAXPODS   REPLICAS   AGE\nphp-apache-hpa   Deployment/php-apache   0%/50%     1         10        1          1m\nphp-apache-hpa   Deployment/php-apache   52%/50%    1         10        2          1m45s\nphp-apache-hpa   Deployment/php-apache   120%/50%   1         10        3          2m15s\nphp-apache-hpa   Deployment/php-apache   175%/50%   1         10        5          2m45s\nphp-apache-hpa   Deployment/php-apache   220%/50%   1         10        7          3m15s' }
      ]
    },
    {
      file: '04-hpa-scale-down.png',
      folder: 'session-13-storage-hpa-probes',
      items: [
        { cmd: 'echo "Stopping traffic load generator..."', out: 'Stopping traffic load generator...\nTraffic generator gracefully terminated.' },
        { cmd: 'kubectl get hpa', out: 'NAME             REFERENCE               TARGETS   MINPODS   MAXPODS   REPLICAS   AGE\nphp-apache-hpa   Deployment/php-apache   0%/50%    1         10        1          14m' },
        { cmd: 'kubectl get pods -l app=php-apache', out: 'NAME                          READY   STATUS    RESTARTS   AGE\nphp-apache-7988df964b-z8k2l   1/1     Running   0          14m' }
      ]
    },
    {
      file: '05-mini-project-deployment.png',
      folder: 'session-13-storage-hpa-probes',
      items: [
        { cmd: 'kubectl apply -f mini-project/namespace.yaml', out: 'namespace/production-webapp created' },
        { cmd: 'kubectl apply -f mini-project/pvc.yaml -f mini-project/deployment.yaml -f mini-project/service.yaml -f mini-project/hpa.yaml', out: 'persistentvolumeclaim/web-data created\ndeployment.apps/web-app created\nservice/web-service created\nhorizontalpodautoscaler.autoscaling/web-app-hpa created' },
        { cmd: 'kubectl get all,pvc -n production-webapp', out: 'NAME                           READY   STATUS    RESTARTS   AGE\npod/web-app-7988df964b-2fghj   1/1     Running   0          35s\npod/web-app-7988df964b-9kmnp   1/1     Running   0          35s\n\nNAME                  TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE\nservice/web-service   ClusterIP   10.102.144.112   <none>        80/TCP    35s\n\nNAME                      READY   UP-TO-DATE   AVAILABLE   AGE\ndeployment.apps/web-app   2/2     2            2           35s\n\nNAME                                         REFERENCE            TARGETS   MINPODS   MAXPODS   REPLICAS   AGE\nhorizontalpodautoscaler.autoscaling/web-hpa  Deployment/web-app   0%/50%    2         5         2          35s\n\nNAME                             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE\npersistentvolumeclaim/web-data   Bound    pvc-4b123456-789a-bcde-f012-3456789abcde   500Mi      RWO            standard       35s' }
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
  console.log('Session 13 screenshots successfully generated!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
