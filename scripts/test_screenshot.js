const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function test() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1000, height: 600 },
    deviceScaleFactor: 2
  });

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 30px;
        background: #0d1117;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .terminal-window {
        width: 880px;
        background: #161b22;
        border-radius: 10px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1);
        overflow: hidden;
      }
      .terminal-header {
        background: #21262d;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .buttons { display: flex; gap: 8px; }
      .dot { width: 12px; height: 12px; border-radius: 50%; }
      .red { background: #ff5f56; }
      .yellow { background: #ffbd2e; }
      .green { background: #27c93f; }
      .title {
        flex-grow: 1;
        text-align: center;
        color: #8b949e;
        font-size: 13px;
        font-family: monospace;
        margin-right: 48px;
      }
      .terminal-body {
        padding: 20px 24px;
        font-family: "Cascadia Code", "JetBrains Mono", Consolas, monospace;
        font-size: 14px;
        line-height: 1.55;
        color: #c9d1d9;
        white-space: pre-wrap;
      }
      .prompt { color: #58a6ff; font-weight: bold; }
      .cmd { color: #f0f6fc; font-weight: bold; }
      .out { color: #8b949e; }
    </style>
  </head>
  <body>
    <div class="terminal-window">
      <div class="terminal-header">
        <div class="buttons">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
        </div>
        <div class="title">veda@k8s-node: ~/session9-k8s</div>
      </div>
      <div class="terminal-body"><span class="prompt">veda@k8s-node:~/session9-k8s$</span> <span class="cmd">minikube version</span>
<span class="out">minikube version: v1.39.0
commit: 7a9f6a841470a207de8cf4bafcccee0969d8ba10</span>

<span class="prompt">veda@k8s-node:~/session9-k8s$</span> <span class="cmd">kubectl version --client</span>
<span class="out">Client Version: v1.36.1
Kustomize Version: v5.8.1</span></div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html);
  const element = await page.$('.terminal-window');
  const targetDir = path.join(__dirname, '..', 'session9-k8s', 'screenshots');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  await element.screenshot({ path: path.join(targetDir, '01-version-check.png') });
  console.log('Successfully captured 01-version-check.png');
  await browser.close();
}

test().catch(console.error);
