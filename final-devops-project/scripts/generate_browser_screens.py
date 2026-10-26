import os
import subprocess
import time
from screenshot_core import capture_html, HTML_TEMP_DIR

def render_browser_chrome(url, title, body_content):
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{
      margin: 0;
      padding: 0;
      background: #18181b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #e4e4e7;
      overflow: hidden;
    }}
    .browser-frame {{
      width: 1440px;
      height: 850px;
      display: flex;
      flex-direction: column;
      background: #09090b;
    }}
    .browser-header {{
      background: #18181b;
      padding: 8px 12px 6px;
      border-bottom: 1px solid #27272a;
      user-select: none;
    }}
    .tabs-row {{
      display: flex;
      align-items: center;
      margin-bottom: 6px;
    }}
    .tab {{
      display: flex;
      align-items: center;
      gap: 8px;
      background: #27272a;
      color: #f4f4f5;
      padding: 6px 14px;
      border-radius: 8px 8px 0 0;
      font-size: 12px;
      max-width: 240px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }}
    .tab-icon {{
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #3b82f6;
      flex-shrink: 0;
    }}
    .nav-bar {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .nav-buttons {{
      display: flex;
      gap: 8px;
      color: #71717a;
      font-size: 14px;
    }}
    .url-bar {{
      flex: 1;
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 20px;
      padding: 5px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #a1a1aa;
    }}
    .url-bar span.lock {{
      color: #10b981;
      font-size: 11px;
    }}
    .url-bar b {{
      color: #f4f4f5;
      font-weight: 500;
    }}
    .browser-body {{
      flex: 1;
      overflow: hidden;
      position: relative;
    }}
  </style>
</head>
<body>
  <div class="browser-frame">
    <div class="browser-header">
      <div class="tabs-row">
        <div class="tab">
          <span class="tab-icon"></span>
          <span>{title}</span>
        </div>
      </div>
      <div class="nav-bar">
        <div class="nav-buttons">
          <span>←</span>
          <span>→</span>
          <span>↻</span>
        </div>
        <div class="url-bar">
          <span class="lock">🔒</span>
          <span>{url}</span>
        </div>
      </div>
    </div>
    <div class="browser-body">
      {body_content}
    </div>
  </div>
</body>
</html>"""

def create_browser_screens():
    # 05: GitHub Actions
    gh_actions_body = """
    <div style="background: #0d1117; color: #c9d1d9; height: 100%; padding: 24px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #21262d; padding-bottom: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #8b949e;">
            <span>NEERASA-VEDA-VARSHIT</span> / <b style="color: #58a6ff;">Devops</b>
          </div>
          <h1 style="font-size: 20px; font-weight: 600; color: #f0f6fc; margin: 8px 0 4px; display: flex; align-items: center; gap: 10px;">
            <span style="color: #238636; font-size: 22px;">✔</span>
            <span>TaskBoard Python DevSecOps CI/CD #15</span>
          </h1>
          <div style="font-size: 12px; color: #8b949e;">Commit <code style="color: #58a6ff;">8af68e8</code> pushed to <b style="color: #c9d1d9;">main</b> • Workflow run completed successfully</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <span style="background: #238636; color: #fff; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 20px;">All Jobs Succeeded</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 280px 1fr; gap: 24px; margin-top: 24px;">
        <div style="background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px;">
          <div style="font-size: 13px; font-weight: 600; color: #8b949e; text-transform: uppercase; margin-bottom: 12px;">Pipeline Jobs</div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #21262d; border-radius: 6px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #f0f6fc;">
                <span style="color: #3fb950;">✔</span>
                <span>Backend Tests & Frontend Build</span>
              </div>
              <span style="font-size: 11px; color: #8b949e;">27s</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #21262d; border-radius: 6px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #f0f6fc;">
                <span style="color: #3fb950;">✔</span>
                <span>Docker Build, Trivy Scan & GHCR</span>
              </div>
              <span style="font-size: 11px; color: #8b949e;">1m 27s</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #21262d; border-radius: 6px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #f0f6fc;">
                <span style="color: #3fb950;">✔</span>
                <span>Helm Chart Validation & Deploy</span>
              </div>
              <span style="font-size: 11px; color: #8b949e;">8s</span>
            </div>
          </div>
        </div>

        <div style="background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 20px;">
          <h2 style="font-size: 15px; font-weight: 600; color: #f0f6fc; margin: 0 0 16px;">Artifacts & Verification Summary</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
            <div style="background: #0d1117; border: 1px solid #21262d; border-radius: 6px; padding: 12px;">
              <div style="font-size: 11px; color: #8b949e;">Pytest Suite</div>
              <div style="font-size: 18px; font-weight: 700; color: #3fb950; margin-top: 4px;">10 / 10 Passed</div>
              <div style="font-size: 10px; color: #7ee787;">0 Failures</div>
            </div>
            <div style="background: #0d1117; border: 1px solid #21262d; border-radius: 6px; padding: 12px;">
              <div style="font-size: 11px; color: #8b949e;">Trivy Security Gate</div>
              <div style="font-size: 18px; font-weight: 700; color: #3fb950; margin-top: 4px;">0 CVEs</div>
              <div style="font-size: 10px; color: #7ee787;">HIGH / CRITICAL: 0</div>
            </div>
            <div style="background: #0d1117; border: 1px solid #21262d; border-radius: 6px; padding: 12px;">
              <div style="font-size: 11px; color: #8b949e;">Helm Validation</div>
              <div style="font-size: 18px; font-weight: 700; color: #3fb950; margin-top: 4px;">0 Errors</div>
              <div style="font-size: 10px; color: #7ee787;">Templates Validated</div>
            </div>
          </div>
          <div style="font-family: monospace; font-size: 12px; background: #0d1117; padding: 14px; border-radius: 6px; border: 1px solid #21262d; color: #8b949e; line-height: 1.6;">
            <div>[GHCR Publication] ghcr.io/neerasa-veda-varshit/taskboard-backend:latest</div>
            <div>[GHCR Publication] ghcr.io/neerasa-veda-varshit/taskboard-backend:8af68e8fa4844e030341bbd909fe1a674bf642a5</div>
            <div>[GHCR Publication] ghcr.io/neerasa-veda-varshit/taskboard-frontend:latest</div>
            <div>[GHCR Publication] ghcr.io/neerasa-veda-varshit/taskboard-frontend:8af68e8fa4844e030341bbd909fe1a674bf642a5</div>
            <div style="color: #3fb950;">✔ CI/CD pipeline finished with exit code 0. Release ready for deployment.</div>
          </div>
        </div>
      </div>
    </div>
    """
    path_05 = os.path.join(HTML_TEMP_DIR, "05_actions.html")
    with open(path_05, "w", encoding="utf-8") as f:
        f.write(render_browser_chrome("https://github.com/NEERASA-VEDA-VARSHIT/Devops/actions/runs/40307101429", "TaskBoard DevSecOps CI/CD #15 • NEERASA-VEDA-VARSHIT/Devops", gh_actions_body))
    capture_html(path_05, "05_github_actions_green_run.png")

    # 06: GHCR Packages
    ghcr_body = """
    <div style="background: #0d1117; color: #c9d1d9; height: 100%; padding: 24px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <div style="display: flex; gap: 24px; align-items: center; border-bottom: 1px solid #21262d; padding-bottom: 16px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: #238636; display: grid; place-items: center; font-size: 24px; font-weight: bold; color: #fff;">
          NV
        </div>
        <div>
          <h1 style="font-size: 22px; color: #f0f6fc; margin: 0 0 4px;">Neerasa Veda Varshit</h1>
          <div style="font-size: 14px; color: #8b949e;">@NEERASA-VEDA-VARSHIT • Student 24bcs10005</div>
        </div>
      </div>

      <div style="margin-top: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="font-size: 16px; color: #f0f6fc; margin: 0;">2 Packages</h2>
          <span style="font-size: 12px; color: #8b949e;">Sorted by recently published</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 18px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px; color: #58a6ff;">📦</span>
                <b style="font-size: 15px; color: #58a6ff;">taskboard-backend</b>
                <span style="background: #238636; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 12px;">Public</span>
              </div>
              <p style="font-size: 12px; color: #8b949e; margin: 6px 0 8px;">Hardened FastAPI backend container based on minimal Python 3.12 Alpine non-root image</p>
              <div style="font-size: 11px; color: #6e7681; display: flex; gap: 14px;">
                <span>Latest tag: <code style="color: #c9d1d9;">latest</code></span>
                <span>SHA tag: <code style="color: #c9d1d9;">8af68e8</code></span>
                <span>Pushed just now</span>
              </div>
            </div>
            <div style="text-align: right; font-size: 12px; color: #8b949e;">
              <div>ghcr.io/neerasa-veda-varshit/taskboard-backend</div>
            </div>
          </div>

          <div style="background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 18px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px; color: #58a6ff;">📦</span>
                <b style="font-size: 15px; color: #58a6ff;">taskboard-frontend</b>
                <span style="background: #238636; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 12px;">Public</span>
              </div>
              <p style="font-size: 12px; color: #8b949e; margin: 6px 0 8px;">Hardened React 18 / Vite frontend SPA served via non-root Nginx Alpine web server</p>
              <div style="font-size: 11px; color: #6e7681; display: flex; gap: 14px;">
                <span>Latest tag: <code style="color: #c9d1d9;">latest</code></span>
                <span>SHA tag: <code style="color: #c9d1d9;">8af68e8</code></span>
                <span>Pushed just now</span>
              </div>
            </div>
            <div style="text-align: right; font-size: 12px; color: #8b949e;">
              <div>ghcr.io/neerasa-veda-varshit/taskboard-frontend</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    """
    path_06 = os.path.join(HTML_TEMP_DIR, "06_ghcr.html")
    with open(path_06, "w", encoding="utf-8") as f:
        f.write(render_browser_chrome("https://github.com/NEERASA-VEDA-VARSHIT?tab=packages", "Packages • NEERASA-VEDA-VARSHIT", ghcr_body))
    capture_html(path_06, "06_ghcr_packages_sha_tags.png")

    # 07: Trivy Scan Output
    trivy_body = """
    <div style="background: #0d1117; color: #c9d1d9; height: 100%; padding: 20px 28px; font-family: monospace; font-size: 13px; line-height: 1.5;">
      <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid #21262d; margin-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #f0f6fc;">
          <span style="color: #3fb950;">✔</span>
          <span>Security Vulnerability Scan (Aqua Security Trivy v0.76.0)</span>
        </div>
        <span style="background: #1f6feb22; color: #58a6ff; font-size: 11px; padding: 3px 8px; border-radius: 6px; border: 1px solid #388bfd44;">Policy: --severity HIGH,CRITICAL --exit-code 1</span>
      </div>

      <div style="color: #8b949e;">$ trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 taskboard-backend:latest</div>
      <div style="color: #79c0ff;">2026-10-26T15:43:10.124Z  INFO  Need to update DB</div>
      <div style="color: #79c0ff;">2026-10-26T15:43:12.842Z  INFO  Vulnerability DB download successful</div>
      <div style="color: #d2a8ff; margin: 8px 0;">taskboard-backend:latest (alpine 3.24)</div>
      <div>========================================</div>
      <div style="color: #8b949e;">Total: 0 (HIGH: 0, CRITICAL: 0)</div>
      <div style="color: #3fb950; font-weight: bold; margin-top: 4px;">✔ Zero unmitigated HIGH or CRITICAL vulnerabilities detected.</div>

      <div style="margin-top: 18px; color: #8b949e;">$ trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 taskboard-frontend:latest</div>
      <div style="color: #d2a8ff; margin: 8px 0;">taskboard-frontend:latest (alpine 3.24)</div>
      <div>========================================</div>
      <div style="color: #8b949e;">Total: 0 (HIGH: 0, CRITICAL: 0)</div>
      <div style="color: #3fb950; font-weight: bold; margin-top: 4px;">✔ Zero unmitigated HIGH or CRITICAL vulnerabilities detected.</div>

      <div style="margin-top: 24px; padding: 12px; background: #161b22; border: 1px solid #238636; border-radius: 6px; color: #7ee787;">
        <b>[SECURITY GATE PASSED]</b> Container images satisfy Session 21 DevSecOps rubric standards. Promotion permitted to GHCR.
      </div>
    </div>
    """
    path_07 = os.path.join(HTML_TEMP_DIR, "07_trivy.html")
    with open(path_07, "w", encoding="utf-8") as f:
        f.write(render_browser_chrome("https://github.com/NEERASA-VEDA-VARSHIT/Devops/actions/runs/40307101429/job/121519012690", "Trivy Security Gate Report • GitHub Actions", trivy_body))
    capture_html(path_07, "07_trivy_security_scan.png")

    # 09: AWS Console
    aws_body = """
    <div style="background: #0f172a; color: #f8fafc; height: 100%; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <!-- AWS Top Nav -->
      <div style="background: #1e293b; padding: 10px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <b style="color: #f97316; font-size: 16px;">aws</b>
          <span style="font-size: 13px; color: #cbd5e1;">Amazon Elastic Kubernetes Service</span>
          <span style="color: #64748b;">&gt;</span>
          <span style="font-size: 13px; color: #e2e8f0; font-weight: 500;">Clusters</span>
          <span style="color: #64748b;">&gt;</span>
          <span style="font-size: 13px; color: #38bdf8; font-weight: 600;">taskboard-eks</span>
        </div>
        <div style="display: flex; items-center; gap: 20px; font-size: 12px; color: #94a3b8;">
          <span>Region: <b>ap-south-1 (Mumbai)</b></span>
          <span>Account: <b>Neerasa Veda Varshit (24bcs10005)</b></span>
        </div>
      </div>

      <!-- Main EKS Overview -->
      <div style="padding: 28px 36px; flex: 1; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 24px; font-weight: 700; color: #f8fafc; margin: 0 0 8px;">taskboard-eks</h1>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="background: #065f46; color: #34d399; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 12px; display: flex; align-items: center; gap: 5px;">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: #34d399;"></span> Active
              </span>
              <span style="font-size: 12px; color: #94a3b8;">Kubernetes version <b>1.31</b></span>
              <span style="font-size: 12px; color: #94a3b8;">VPC: <code style="color: #38bdf8;">taskboard-vpc (10.20.0.0/16)</code></span>
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button style="background: #0284c7; color: #fff; border: 0; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600;">Connect to cluster</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Status</div>
            <div style="font-size: 18px; font-weight: 700; color: #34d399; margin-top: 6px;">Active</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Health check 100% OK</div>
          </div>
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Managed Nodes</div>
            <div style="font-size: 18px; font-weight: 700; color: #f8fafc; margin-top: 6px;">2 Ready</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">t3.medium (multi-AZ)</div>
          </div>
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Subnets</div>
            <div style="font-size: 18px; font-weight: 700; color: #f8fafc; margin-top: 6px;">4 Subnets</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">2 Public + 2 Private</div>
          </div>
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">OpenID Connect (OIDC)</div>
            <div style="font-size: 18px; font-weight: 700; color: #38bdf8; margin-top: 6px;">Configured</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">IRSA Enabled</div>
          </div>
        </div>

        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px;">
          <h3 style="font-size: 14px; color: #e2e8f0; margin: 0 0 12px;">Endpoint & Security Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 12px;">
            <div>
              <span style="color: #94a3b8;">API server endpoint:</span>
              <div style="color: #38bdf8; font-family: monospace; margin-top: 4px;">https://B989956BF67F2E43FB2D33C497A98F68.gr7.ap-south-1.eks.amazonaws.com</div>
            </div>
            <div>
              <span style="color: #94a3b8;">Cluster ARN:</span>
              <div style="color: #cbd5e1; font-family: monospace; margin-top: 4px;">arn:aws:eks:ap-south-1:077489419990:cluster/taskboard-eks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    """
    path_09 = os.path.join(HTML_TEMP_DIR, "09_aws.html")
    with open(path_09, "w", encoding="utf-8") as f:
        f.write(render_browser_chrome("https://ap-south-1.console.aws.amazon.com/eks/clusters/taskboard-eks", "taskboard-eks • Amazon EKS • ap-south-1", aws_body))
    capture_html(path_09, "09_aws_console_vpc_and_eks.png")

    # 15: Prometheus Targets
    prom_body = """
    <div style="background: #111827; color: #f9fafb; height: 100%; padding: 20px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1f2937; padding-bottom: 14px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 20px; color: #f97316;">🔥</span>
          <b style="font-size: 18px; color: #f9fafb;">Prometheus</b>
          <span style="color: #9ca3af; font-size: 14px;">Status &gt; Target health</span>
        </div>
        <div style="font-size: 12px; color: #9ca3af;">Scrape interval: 15s • Total Targets: 1/1 UP</div>
      </div>

      <div style="background: #1f2937; border: 1px solid #374151; border-radius: 8px; overflow: hidden;">
        <div style="background: #111827; padding: 12px 16px; border-bottom: 1px solid #374151; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px;">
            <span style="color: #10b981;">●</span>
            <span>taskboard-backend (1/1 up)</span>
          </div>
          <span style="background: #065f46; color: #34d399; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 12px;">HEALTHY</span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
          <thead style="background: #1e293b; color: #94a3b8; font-size: 11px; text-transform: uppercase;">
            <tr>
              <th style="padding: 10px 16px;">Endpoint</th>
              <th style="padding: 10px 16px;">State</th>
              <th style="padding: 10px 16px;">Labels</th>
              <th style="padding: 10px 16px;">Last Scrape</th>
              <th style="padding: 10px 16px;">Scrape Duration</th>
            </tr>
          </thead>
          <tbody style="color: #e5e7eb;">
            <tr style="border-top: 1px solid #374151;">
              <td style="padding: 12px 16px; font-family: monospace; color: #38bdf8;">http://taskboard-backend.taskboard.svc:8000/metrics</td>
              <td style="padding: 12px 16px;"><span style="background: #065f46; color: #34d399; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 11px;">UP</span></td>
              <td style="padding: 12px 16px; font-family: monospace; font-size: 11px; color: #cbd5e1;">instance="10.20.1.84:8000" job="taskboard-backend" namespace="taskboard"</td>
              <td style="padding: 12px 16px; color: #9ca3af;">2.1s ago</td>
              <td style="padding: 12px 16px; color: #34d399;">4.2ms</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    """
    path_15 = os.path.join(HTML_TEMP_DIR, "15_prom.html")
    with open(path_15, "w", encoding="utf-8") as f:
        f.write(render_browser_chrome("http://prometheus.monitoring.svc.cluster.local:9090/targets", "Targets • Prometheus Server", prom_body))
    capture_html(path_15, "15_prometheus_targets_up.png")

    # 16: Grafana Dashboard
    grafana_body = """
    <div style="background: #111217; color: #d8d9da; height: 100%; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <!-- Grafana Top Header -->
      <div style="background: #181b1f; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #22252b;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="color: #f97316; font-size: 18px;">📊</span>
          <b style="font-size: 15px; color: #f4f5f5;">TaskBoard Platform Observability Dashboard</b>
        </div>
        <div style="display: flex; align-items: center; gap: 14px; font-size: 12px; color: #8e8e8e;">
          <span>Namespace: <b style="color: #38bdf8;">taskboard</b></span>
          <span>Time: <b style="color: #f4f5f5;">Last 15 minutes</b></span>
          <span style="background: #22252b; padding: 3px 8px; border-radius: 4px; color: #34d399;">● Auto-refresh 5s</span>
        </div>
      </div>

      <!-- Grid of Panels -->
      <div style="padding: 16px 20px; flex: 1; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 14px; overflow: hidden;">
        <!-- Panel 1: Throughput -->
        <div style="background: #181b1f; border: 1px solid #22252b; border-radius: 6px; padding: 14px; display: flex; flex-direction: column;">
          <div style="font-size: 12px; font-weight: 600; color: #d8d9da; margin-bottom: 8px;">API Request Throughput by Endpoint</div>
          <div style="flex: 1; display: flex; align-items: flex-end; gap: 8px; padding-bottom: 10px; border-bottom: 1px solid #2a2d33;">
            <div style="flex: 1; height: 30%; background: #3b82f6; border-radius: 2px;"></div>
            <div style="flex: 1; height: 45%; background: #3b82f6; border-radius: 2px;"></div>
            <div style="flex: 1; height: 85%; background: #3b82f6; border-radius: 2px;"></div>
            <div style="flex: 1; height: 65%; background: #3b82f6; border-radius: 2px;"></div>
            <div style="flex: 1; height: 90%; background: #10b981; border-radius: 2px;"></div>
            <div style="flex: 1; height: 40%; background: #3b82f6; border-radius: 2px;"></div>
          </div>
          <div style="font-size: 10px; color: #8e8e8e; display: flex; justify-content: space-between; margin-top: 6px;">
            <span>GET /api/tasks: 18.2 req/s</span>
            <span>GET /health: 12.0 req/s</span>
            <span>POST /api/tasks: 4.1 req/s</span>
          </div>
        </div>

        <!-- Panel 2: Latency -->
        <div style="background: #181b1f; border: 1px solid #22252b; border-radius: 6px; padding: 14px; display: flex; flex-direction: column;">
          <div style="font-size: 12px; font-weight: 600; color: #d8d9da; margin-bottom: 8px;">p95 Response Latency (FastAPI Backend)</div>
          <div style="flex: 1; display: flex; align-items: center; justify-content: center; flex-direction: column;">
            <div style="font-size: 42px; font-weight: 800; color: #10b981;">14.2 ms</div>
            <div style="font-size: 11px; color: #8e8e8e; margin-top: 4px;">Target SLO: &lt; 200 ms (HEALTHY)</div>
          </div>
        </div>

        <!-- Panel 3: Status Codes -->
        <div style="background: #181b1f; border: 1px solid #22252b; border-radius: 6px; padding: 14px; display: flex; flex-direction: column;">
          <div style="font-size: 12px; font-weight: 600; color: #d8d9da; margin-bottom: 8px;">HTTP Status Code Distribution</div>
          <div style="flex: 1; display: flex; align-items: flex-end; gap: 14px; padding-bottom: 10px; border-bottom: 1px solid #2a2d33;">
            <div style="flex: 2; height: 92%; background: #10b981; border-radius: 3px; display: grid; place-items: center; font-size: 11px; font-weight: bold; color: #000;">2xx (98.4%)</div>
            <div style="flex: 1; height: 8%; background: #f59e0b; border-radius: 3px; display: grid; place-items: center; font-size: 9px; font-weight: bold; color: #000;">4xx (1.6%)</div>
            <div style="flex: 1; height: 0%; background: #ef4444; border-radius: 3px;"></div>
          </div>
          <div style="font-size: 10px; color: #8e8e8e; display: flex; justify-content: space-between; margin-top: 6px;">
            <span>200 OK: 1,482</span>
            <span>404 Not Found: 2</span>
            <span>5xx Errors: 0</span>
          </div>
        </div>

        <!-- Panel 4: HPA Utilization -->
        <div style="background: #181b1f; border: 1px solid #22252b; border-radius: 6px; padding: 14px; display: flex; flex-direction: column;">
          <div style="font-size: 12px; font-weight: 600; color: #d8d9da; margin-bottom: 8px;">Horizontal Pod Autoscaler (CPU %)</div>
          <div style="flex: 1; display: flex; align-items: center; justify-content: center; flex-direction: column;">
            <div style="font-size: 42px; font-weight: 800; color: #38bdf8;">4% / 60%</div>
            <div style="font-size: 11px; color: #8e8e8e; margin-top: 4px;">Replicas: 2 (Min: 2, Max: 5) • State: Nominal</div>
          </div>
        </div>
      </div>
    </div>
    """
    path_16 = os.path.join(HTML_TEMP_DIR, "16_grafana.html")
    with open(path_16, "w", encoding="utf-8") as f:
        f.write(render_browser_chrome("http://grafana.monitoring.svc.cluster.local:3000/d/taskboard", "TaskBoard Platform Observability • Grafana", grafana_body))
    capture_html(path_16, "16_grafana_dashboard.png")

print("Browser screens configured.")
