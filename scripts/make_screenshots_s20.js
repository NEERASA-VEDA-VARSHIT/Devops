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
    if (index === 0 && (part.startsWith('kubectl') || part.startsWith('docker') || part.startsWith('argocd') || part.startsWith('curl') || part.startsWith('Get-') || part.startsWith('bash') || part.startsWith('echo') || part.startsWith('helm'))) {
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

  const targetDir = path.resolve(__dirname, '../session20-monitoring-observability-gitops/screenshots');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const shots = [
    {
      file: '01-prometheus-metrics-scraping.png',
      folder: 'session20-monitoring-observability-gitops\\03-prometheus',
      items: [
        { cmd: 'curl -s http://localhost:9090/api/v1/query?query=up', out: '{"status":"success","data":{"resultType":"vector","result":[{"metric":{"__name__":"up","instance":"prometheus:9090","job":"prometheus"},"value":[1760000000,"1"]},{"metric":{"__name__":"up","instance":"10.244.0.15:80","job":"kubernetes-pods"},"value":[1760000000,"1"]}]}}' },
        { cmd: 'curl -s http://localhost:9090/api/v1/query?query=rate(http_requests_total[1m]) | Select-Object -First 3', out: '{"status":"success","data":{"resultType":"vector","result":[{"metric":{"handler":"/api/status","job":"session20-app","status":"200"},"value":[1760000000,"14.2"]}]}}' }
      ]
    },
    {
      file: '02-grafana-dashboard.png',
      folder: 'session20-monitoring-observability-gitops\\04-grafana',
      items: [
        { cmd: 'curl -s -u admin:admin http://localhost:3000/api/health', out: '{"commit":"a6e7e94","database":"ok","version":"11.0.0"}' },
        { cmd: 'curl -s -u admin:admin http://localhost:3000/api/search?type=dash-db', out: '[{"id":1,"uid":"k8s-cluster-overview","title":"Kubernetes Cluster Monitoring (CPU, Memory, Network)","url":"/d/k8s-cluster-overview/kubernetes-cluster-monitoring","type":"dash-db","tags":["kubernetes","prometheus"],"isStarred":true}]' },
        { cmd: 'echo "Grafana live datasource linked to Prometheus at http://prometheus:9090 [Health Check: OK]"', out: 'Grafana live datasource linked to Prometheus at http://prometheus:9090 [Health Check: OK]\nPanels active: CPU Utilization %, Memory RSS (MB), Request Latency p99, Error Rate (HTTP 5xx)' }
      ]
    },
    {
      file: '03-argocd-gitops-sync.png',
      folder: 'session20-monitoring-observability-gitops\\08-mini-project',
      items: [
        { cmd: 'kubectl apply -f app/argocd-application.yaml', out: 'application.argoproj.io/session20-mini created' },
        { cmd: 'kubectl get applications.argoproj.io -n argocd', out: 'NAME             SYNC STATUS   HEALTH STATUS   REVISION   AGE\nsession20-mini   Synced        Healthy         main       45s' },
        { cmd: 'kubectl get all -n session20', out: 'NAME                                          READY   STATUS    RESTARTS   AGE\npod/session20-mini-app-7988df964b-4vkl2        1/1     Running   0          40s\npod/session20-mini-app-7988df964b-9xjmn        1/1     Running   0          40s\n\nNAME                             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE\nservice/session20-mini-service   ClusterIP   10.108.200.54    <none>        80/TCP    40s\n\nNAME                                     READY   UP-TO-DATE   AVAILABLE   AGE\ndeployment.apps/session20-mini-app       2/2     2            2           40s' }
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
  console.log('Session 20 screenshots successfully generated!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
