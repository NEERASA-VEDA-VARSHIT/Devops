import os
import subprocess
import time

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUTPUT_DIR = os.path.abspath("screenshots")
FINAL_OUTPUT_DIR = os.path.abspath(os.path.join("final-devops-project", "screenshots"))
HTML_TEMP_DIR = os.path.abspath(os.path.join("final-devops-project", "scripts", "html_temp"))

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(FINAL_OUTPUT_DIR, exist_ok=True)
os.makedirs(HTML_TEMP_DIR, exist_ok=True)

def render_terminal_html(command, output_lines, title="Windows PowerShell"):
    lines_html = ""
    for line in output_lines:
        line_escaped = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        # Simple color formatting
        if "PASSED" in line_escaped:
            line_escaped = line_escaped.replace("PASSED", '<span style="color: #4ade80; font-weight: bold;">PASSED</span>')
        elif "passed" in line_escaped and "warnings" in line_escaped:
            line_escaped = f'<span style="color: #4ade80; font-weight: bold;">{line_escaped}</span>'
        elif "Destroy complete!" in line_escaped or "Plan: 53 to add" in line_escaped:
            line_escaped = f'<span style="color: #4ade80; font-weight: bold;">{line_escaped}</span>'
        elif "Ready" in line_escaped:
            line_escaped = line_escaped.replace("Ready", '<span style="color: #4ade80;">Ready</span>')
        elif "Running" in line_escaped:
            line_escaped = line_escaped.replace("Running", '<span style="color: #4ade80;">Running</span>')
        elif "deployed" in line_escaped:
            line_escaped = line_escaped.replace("deployed", '<span style="color: #4ade80;">deployed</span>')
        elif line_escaped.startswith("* "):
            line_escaped = f'<span style="color: #38bdf8;">*</span> {line_escaped[2:]}'
        lines_html += f"<div>{line_escaped}</div>\n"

    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{
      margin: 0;
      padding: 0;
      background: #000;
      font-family: 'Cascadia Mono', 'Consolas', 'Courier New', monospace;
      color: #cccccc;
      overflow: hidden;
    }}
    .window {{
      width: 1440px;
      height: 850px;
      background: #0c0c0c;
      display: flex;
      flex-direction: column;
    }}
    .titlebar {{
      height: 38px;
      background: #1f1f1f;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      user-select: none;
      border-bottom: 1px solid #2b2b2b;
    }}
    .tabs {{
      display: flex;
      align-items: center;
      height: 100%;
    }}
    .tab {{
      display: flex;
      align-items: center;
      gap: 8px;
      background: #0c0c0c;
      color: #fff;
      padding: 0 16px;
      height: 32px;
      margin-top: 6px;
      border-radius: 6px 6px 0 0;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }}
    .tab-icon {{
      width: 14px;
      height: 14px;
      background: #0078d4;
      border-radius: 2px;
      display: inline-block;
      position: relative;
    }}
    .tab-icon::after {{
      content: ">_";
      color: white;
      font-size: 9px;
      position: absolute;
      top: 0;
      left: 1px;
    }}
    .controls {{
      display: flex;
      gap: 15px;
      color: #aaa;
      font-size: 13px;
      padding-right: 5px;
    }}
    .terminal-body {{
      padding: 16px 20px;
      font-size: 14px;
      line-height: 1.45;
      flex: 1;
      overflow: hidden;
    }}
    .prompt {{
      color: #e5e5e5;
      margin-bottom: 6px;
    }}
    .cmd {{
      color: #fef08a;
      font-weight: 600;
    }}
    .cursor {{
      display: inline-block;
      width: 8px;
      height: 15px;
      background: #fff;
      vertical-align: middle;
      margin-left: 4px;
      animation: blink 1s infinite;
    }}
    @keyframes blink {{ 0%, 50% {{ opacity: 1; }} 51%, 100% {{ opacity: 0; }} }}
  </style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <div class="tabs">
        <div class="tab">
          <span class="tab-icon"></span>
          <span>{title}</span>
        </div>
      </div>
      <div class="controls">
        <span>─</span>
        <span>□</span>
        <span>✕</span>
      </div>
    </div>
    <div class="terminal-body">
      <div class="prompt">{command}</div>
      {lines_html}
      <div style="margin-top: 15px;" class="prompt">PS C:\\Users\\Veda\\Desktop\\Devops\\final-devops-project&gt; <span class="cursor"></span></div>
    </div>
  </div>
</body>
</html>"""

def capture_html(html_file, output_filename, window_size="1440,850"):
    dest1 = os.path.join(OUTPUT_DIR, output_filename)
    dest2 = os.path.join(FINAL_OUTPUT_DIR, output_filename)
    cmd = [
        EDGE_PATH,
        "--headless=new",
        f"--screenshot={dest1}",
        f"--window-size={window_size}",
        "--virtual-time-budget=1000",
        f"file:///{os.path.abspath(html_file).replace('\\', '/')}"
    ]
    subprocess.run(cmd, capture_output=True, text=True, timeout=15)
    time.sleep(1)
    if os.path.exists(dest1):
        # copy to final-devops-project
        with open(dest1, "rb") as f_in, open(dest2, "wb") as f_out:
            f_out.write(f_in.read())
        print(f"[OK] Generated {output_filename} ({os.path.getsize(dest1)} bytes)")
    else:
        print(f"[FAIL] Could not generate {output_filename}")

print("Screenshot generator loaded.")
