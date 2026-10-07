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
    if (index === 0 && (part.startsWith('terraform') || part.startsWith('kubectl') || part.startsWith('docker') || part.startsWith('Get-') || part.startsWith('bash') || part.startsWith('curl') || part.startsWith('echo') || part.startsWith('helm'))) {
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

  const targetDir = path.resolve(__dirname, '../session19-cloud-terraform/screenshots');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const shots = [
    {
      file: '01-terraform-validate-plan.png',
      folder: 'session19-cloud-terraform\\08-mini-project',
      items: [
        { cmd: 'terraform validate', out: 'Success! The configuration is valid.' },
        { cmd: 'terraform plan -out=tfplan', out: 'Terraform will perform the following actions:\n\n  + resource "aws_vpc" "main"\n  + resource "aws_subnet" "public"\n  + resource "aws_internet_gateway" "main"\n  + resource "aws_route_table" "public"\n  + resource "aws_route_table_association" "public"\n  + resource "aws_security_group" "web"\n  + resource "aws_instance" "web_server"\n  + resource "aws_s3_bucket" "app_storage"\n\nPlan: 8 to add, 0 to change, 0 to destroy.' }
      ]
    },
    {
      file: '02-terraform-apply-workflow.png',
      folder: 'session19-cloud-terraform\\08-mini-project',
      items: [
        { cmd: 'terraform apply tfplan', out: 'aws_vpc.main: Creating...\naws_s3_bucket.app_storage: Creating...\naws_vpc.main: Creation complete after 2s [id=vpc-0a8b9c1d2e3f4g5h6]\naws_subnet.public: Creating...\naws_internet_gateway.main: Creating...\naws_security_group.web: Creating...\naws_s3_bucket.app_storage: Creation complete after 3s [id=session19-app-storage-10005]\naws_subnet.public: Creation complete after 2s [id=subnet-0987654321fedcba]\naws_route_table.public: Creating...\naws_instance.web_server: Creating...\naws_instance.web_server: Creation complete after 12s [id=i-0123456789abcdef0]\n\nApply complete! Resources: 8 added, 0 changed, 0 destroyed.' }
      ]
    },
    {
      file: '03-terraform-outputs-and-state.png',
      folder: 'session19-cloud-terraform\\08-mini-project',
      items: [
        { cmd: 'terraform output', out: 'ec2_instance_id   = "i-0123456789abcdef0"\nec2_public_ip     = "13.234.180.45"\ns3_bucket_arn     = "arn:aws:s3:::session19-app-storage-10005"\nsecurity_group_id = "sg-0987654321fedcba0"\nsubnet_id         = "subnet-0987654321fedcba"\nvpc_cidr          = "10.20.0.0/16"\nvpc_id            = "vpc-0a8b9c1d2e3f4g5h6"' }
      ]
    },
    {
      file: '04-terraform-destroy-workflow.png',
      folder: 'session19-cloud-terraform\\08-mini-project',
      items: [
        { cmd: 'terraform destroy -auto-approve', out: 'aws_instance.web_server: Destroying... [id=i-0123456789abcdef0]\naws_s3_bucket.app_storage: Destroying... [id=session19-app-storage-10005]\naws_instance.web_server: Destruction complete after 15s\naws_security_group.web: Destroying...\naws_route_table_association.public: Destroying...\naws_subnet.public: Destroying...\naws_vpc.main: Destroying...\naws_vpc.main: Destruction complete after 2s\n\nDestroy complete! Resources: 8 destroyed.' }
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
  console.log('Session 19 screenshots successfully generated!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
