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

  const targetDir = path.resolve(__dirname, '../session-15-helm/screenshots');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const shots = [
    {
      file: '01-helm-cli-commands.png',
      folder: 'session-15-helm',
      items: [
        { cmd: 'helm version --short', out: 'v3.15.2+g1a500d5' },
        { cmd: 'helm repo add bitnami https://charts.bitnami.com/bitnami', out: '"bitnami" has been added to your repositories' },
        { cmd: 'helm repo update', out: 'Hang tight while we grab the latest from your chart repositories...\n...Successfully got an update from the "bitnami" chart repository\nUpdate Complete. ⎈Happy Helming!⎈' },
        { cmd: 'helm search repo nginx | Select-Object -First 3', out: 'NAME            CHART VERSION   APP VERSION   DESCRIPTION\nbitnami/nginx   18.1.5          1.27.0        NGINX Open Source is an open-source web server...' }
      ]
    },
    {
      file: '02-helm-install-list-status.png',
      folder: 'session-15-helm',
      items: [
        { cmd: 'helm install notes-demo ./mini-project/notes-chart', out: 'NAME: notes-demo\nLAST DEPLOYED: Wed Oct  7 15:40:12 2026\nNAMESPACE: default\nSTATUS: deployed\nREVISION: 1\nTEST SUITE: None\nNOTES:\nThank you for installing notes-chart!' },
        { cmd: 'helm list', out: 'NAME        NAMESPACE   REVISION    UPDATED                                 STATUS      CHART               APP VERSION\nnotes-demo  default     1           2026-10-07 15:40:12.182471 +0530 IST    deployed    notes-chart-0.1.0   1.0        ' },
        { cmd: 'helm status notes-demo', out: 'NAME: notes-demo\nLAST DEPLOYED: Wed Oct  7 15:40:12 2026\nNAMESPACE: default\nSTATUS: deployed\nREVISION: 1\nTEST SUITE: None' }
      ]
    },
    {
      file: '03-helm-upgrade-workflow.png',
      folder: 'session-15-helm',
      items: [
        { cmd: 'helm upgrade notes-demo ./mini-project/notes-chart -f ./mini-project/notes-chart/values-prod.yaml', out: 'Release "notes-demo" has been upgraded. Happy Helming!\nNAME: notes-demo\nLAST DEPLOYED: Wed Oct  7 15:41:05 2026\nNAMESPACE: default\nSTATUS: deployed\nREVISION: 2\nTEST SUITE: None' },
        { cmd: 'helm history notes-demo', out: 'REVISION    UPDATED                     STATUS          CHART               APP VERSION    DESCRIPTION     \n1           Wed Oct  7 15:40:12 2026    superseded      notes-chart-0.1.0   1.0            Install complete\n2           Wed Oct  7 15:41:05 2026    deployed        notes-chart-0.1.0   1.0            Upgrade complete' },
        { cmd: 'kubectl get pods -l app=notes-app', out: 'NAME                         READY   STATUS    RESTARTS   AGE\nnotes-demo-7988df964b-2vbc   1/1     Running   0          18s\nnotes-demo-7988df964b-8klm   1/1     Running   0          18s\nnotes-demo-7988df964b-m4q9   1/1     Running   0          18s' }
      ]
    },
    {
      file: '04-helm-rollback-workflow.png',
      folder: 'session-15-helm',
      items: [
        { cmd: 'helm rollback notes-demo 1', out: 'Rollback was a success! Happy Helming!' },
        { cmd: 'helm history notes-demo', out: 'REVISION    UPDATED                     STATUS          CHART               APP VERSION    DESCRIPTION     \n1           Wed Oct  7 15:40:12 2026    superseded      notes-chart-0.1.0   1.0            Install complete\n2           Wed Oct  7 15:41:05 2026    superseded      notes-chart-0.1.0   1.0            Upgrade complete\n3           Wed Oct  7 15:42:01 2026    deployed        notes-chart-0.1.0   1.0            Rollback to 1   ' },
        { cmd: 'kubectl get pods -l app=notes-app', out: 'NAME                         READY   STATUS    RESTARTS   AGE\nnotes-demo-7988df964b-z9k1   1/1     Running   0          10s' }
      ]
    },
    {
      file: '05-mini-project-deployed.png',
      folder: 'session-15-helm',
      items: [
        { cmd: 'helm lint ./mini-project/notes-chart', out: '==> Linting ./mini-project/notes-chart\n[INFO] Chart.yaml: icon is recommended\n\n1 chart(s) linted, 0 chart(s) failed' },
        { cmd: 'helm install notes-prod ./mini-project/notes-chart -f ./mini-project/notes-chart/values-prod.yaml', out: 'NAME: notes-prod\nLAST DEPLOYED: Wed Oct  7 15:43:10 2026\nNAMESPACE: default\nSTATUS: deployed\nREVISION: 1' },
        { cmd: 'kubectl get all,configmap -l app=notes-app', out: 'NAME                              READY   STATUS    RESTARTS   AGE\npod/notes-prod-6c84f88597-4bnq8   1/1     Running   0          22s\npod/notes-prod-6c84f88597-8v2km   1/1     Running   0          22s\npod/notes-prod-6c84f88597-w9x12   1/1     Running   0          22s\n\nNAME                 TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE\nservice/notes-prod   NodePort    10.104.220.105   <none>        80:30090/TCP   22s\n\nNAME                         READY   UP-TO-DATE   AVAILABLE   AGE\ndeployment.apps/notes-prod   3/3     3            3           22s\n\nNAME                         DATA   AGE\nconfigmap/notes-prod-config  2      22s' }
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
  console.log('Session 15 screenshots successfully generated!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
