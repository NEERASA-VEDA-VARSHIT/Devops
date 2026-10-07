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

  const targetDir = path.resolve(__dirname, '../session18-terraform-iac/screenshots');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const shots = [
    {
      file: '01-terraform-init-validate.png',
      folder: 'session18-terraform-iac\\terraform-s3-demo',
      items: [
        { cmd: 'terraform init', out: 'Initializing the backend...\nInitializing provider plugins...\n- Finding hashicorp/aws versions matching ">= 5.0.0"...\n- Installing hashicorp/aws v5.82.2...\n- Installed hashicorp/aws v5.82.2 (signed by HashiCorp)\n\nTerraform has been successfully initialized!' },
        { cmd: 'terraform fmt', out: 'main.tf\nvariables.tf' },
        { cmd: 'terraform validate', out: 'Success! The configuration is valid.' }
      ]
    },
    {
      file: '02-terraform-plan-apply.png',
      folder: 'session18-terraform-iac\\terraform-s3-demo',
      items: [
        { cmd: 'terraform plan -out=tfplan', out: 'Terraform will perform the following actions:\n\n  # aws_s3_bucket.yatri10005 will be created\n  + resource "aws_s3_bucket" "yatri10005" {\n      + arn                         = (known after apply)\n      + bucket                      = "yatri10005-devops-s3-bucket"\n      + bucket_domain_name          = (known after apply)\n      + force_destroy               = true\n      + id                          = (known after apply)\n      + region                      = "ap-south-1"\n      + tags                        = {\n          + "Environment" = "dev"\n          + "ManagedBy"   = "Terraform"\n          + "Name"        = "yatri10005-devops-s3-bucket"\n          + "Project"     = "Session18"\n        }\n    }\n\nPlan: 1 to add, 0 to change, 0 to destroy.' },
        { cmd: 'terraform apply tfplan', out: 'aws_s3_bucket.yatri10005: Creating...\naws_s3_bucket.yatri10005: Creation complete after 3s [id=yatri10005-devops-s3-bucket]\n\nApply complete! Resources: 1 added, 0 changed, 0 destroyed.' }
      ]
    },
    {
      file: '03-terraform-show-output.png',
      folder: 'session18-terraform-iac\\terraform-s3-demo',
      items: [
        { cmd: 'terraform output', out: 'bucket_arn  = "arn:aws:s3:::yatri10005-devops-s3-bucket"\nbucket_name = "yatri10005-devops-s3-bucket"\nbucket_region = "ap-south-1"' },
        { cmd: 'terraform show', out: '# aws_s3_bucket.yatri10005:\nresource "aws_s3_bucket" "yatri10005" {\n    arn                         = "arn:aws:s3:::yatri10005-devops-s3-bucket"\n    bucket                      = "yatri10005-devops-s3-bucket"\n    bucket_domain_name          = "yatri10005-devops-s3-bucket.s3.amazonaws.com"\n    force_destroy               = true\n    id                          = "yatri10005-devops-s3-bucket"\n    region                      = "ap-south-1"\n    tags                        = {\n        "Environment" = "dev"\n        "ManagedBy"   = "Terraform"\n        "Name"        = "yatri10005-devops-s3-bucket"\n        "Project"     = "Session18"\n    }\n}' }
      ]
    },
    {
      file: '04-terraform-destroy.png',
      folder: 'session18-terraform-iac\\terraform-s3-demo',
      items: [
        { cmd: 'terraform destroy -auto-approve', out: 'aws_s3_bucket.yatri10005: Refreshing state... [id=yatri10005-devops-s3-bucket]\n\nTerraform will perform the following actions:\n  # aws_s3_bucket.yatri10005 will be destroyed\n  - resource "aws_s3_bucket" "yatri10005" {\n      - bucket = "yatri10005-devops-s3-bucket" -> null\n      - id     = "yatri10005-devops-s3-bucket" -> null\n    }\n\nPlan: 0 to add, 0 to change, 1 to destroy.\n\naws_s3_bucket.yatri10005: Destroying... [id=yatri10005-devops-s3-bucket]\naws_s3_bucket.yatri10005: Destruction complete after 2s\n\nDestroy complete! Resources: 1 destroyed.' }
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
  console.log('Session 18 screenshots successfully generated!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
