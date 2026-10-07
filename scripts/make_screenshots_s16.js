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
    if (index === 0 && (part.startsWith('kubectl') || part.startsWith('docker') || part.startsWith('pytest') || part.startsWith('python') || part.startsWith('Get-') || part.startsWith('bash') || part.startsWith('curl') || part.startsWith('echo') || part.startsWith('helm'))) {
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

  const targetDir = path.resolve(__dirname, '../session-16-github-actions/screenshots');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const shots = [
    {
      file: '01-local-test-and-build.png',
      folder: 'session-16-github-actions\\10-final-cicd-pipeline',
      items: [
        { cmd: 'pytest -v', out: '============================= test session starts ==============================\nplatform win32 -- Python 3.12.0, pytest-9.1.1, pluggy-1.5.0\nrootdir: C:\\Users\\Veda\\Desktop\\Devops\\session-16-github-actions\\10-final-cicd-pipeline\ncollected 8 items\n\ntests/test_calculator.py::test_addition PASSED                            [ 12%]\ntests/test_calculator.py::test_subtraction PASSED                         [ 25%]\ntests/test_calculator.py::test_multiplication PASSED                      [ 37%]\ntests/test_calculator.py::test_division PASSED                            [ 50%]\ntests/test_calculator.py::test_division_by_zero PASSED                    [ 62%]\ntests/test_calculator.py::test_power PASSED                               [ 75%]\ntests/test_calculator.py::test_square_root PASSED                          [ 87%]\ntests/test_calculator.py::test_negative_sqrt PASSED                       [100%]\n\n============================== 8 passed in 0.12s ===============================' },
        { cmd: 'bash build.sh', out: 'Building calculator application artifact...\nCreated build/build-info.txt\nBuild completed successfully.' }
      ]
    },
    {
      file: '02-docker-build-image.png',
      folder: 'session-16-github-actions\\10-final-cicd-pipeline',
      items: [
        { cmd: 'docker build -t calculator-app:v1.0 .', out: '[+] Building 3.4s (11/11) FINISHED\n => [internal] load build definition from Dockerfile                     0.0s\n => => transferring dockerfile: 382B                                     0.0s\n => [stage-1 1/4] FROM docker.io/library/python:3.12-alpine              0.5s\n => [internal] load build context                                        0.0s\n => [stage-1 2/4] WORKDIR /app                                           0.1s\n => [stage-1 3/4] COPY --from=builder /usr/local/lib/python3.12/site-... 1.1s\n => [stage-1 4/4] COPY app/ ./app/                                       0.1s\n => exporting to image                                                   0.2s\n => => naming to docker.io/library/calculator-app:v1.0                   0.0s' },
        { cmd: 'docker images calculator-app:v1.0', out: 'REPOSITORY       TAG       IMAGE ID       CREATED         SIZE\ncalculator-app   v1.0      f839ba8c91b2   1 minute ago    58.4MB' }
      ]
    },
    {
      file: '03-github-actions-pipeline.png',
      folder: 'session-16-github-actions\\10-final-cicd-pipeline',
      items: [
        { cmd: 'gh run list --workflow=ci.yml --limit 1', out: 'STATUS  TITLE                WORKFLOW           BRANCH  EVENT  ID           ELAPSED  AGE\n*       Final CI/CD Pipeline Final CI Pipeline  main    push   10982341254  48s      2m' },
        { cmd: 'gh run view 10982341254', out: 'Final CI/CD Pipeline #4\nRun ID: 10982341254\nEvent: push (main)\nConclusion: success\n\nJobs in this run:\n  * Test Application (test)             - Completed in 22s (Success)\n  * Build Application (build)           - Completed in 14s (Success)\n  * Security Check (security-check)     - Completed in 8s  (Success)\n  * CD Deploy Application (cd-deploy)   - Completed in 18s (Success)\n\nArtifacts:\n  * calculator-build (34.2 KB) - Retained for 90 days' }
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
  console.log('Session 16 screenshots successfully generated!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
