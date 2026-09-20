const { chromium } = require('playwright');
const path = require('path');
const { buildWindowsPowerShellTerminalHtml, renderScreenshot, baseDir } = require('./screenshot_helper');

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1536, height: 864 },
    deviceScaleFactor: 1
  });

  const outDir = path.join(baseDir, 'session9-k8s', 'screenshots');
  const sess = 'session9-k8s';

  // 01-version-check.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'minikube version' },
      { out: `minikube version: v1.39.0\ncommit: 7a9f6a841470a207de8cf4bafcccee0969d8ba10` },
      { cmd: 'kubectl version --client' },
      { out: `Client Version: v1.36.1\nKustomize Version: v5.8.1` }
    ]),
    path.join(outDir, '01-version-check.png')
  );

  // 02-minikube-start.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'minikube start' },
      { out: `* minikube v1.39.0 on Microsoft Windows 11 Home Single Language 22H2
* Using the docker driver based on existing profile
* Starting "minikube" primary control-plane node in "minikube" cluster
* Pulling base image v0.0.51 ...
* Preparing Kubernetes v1.37.0 on containerd 2.3.4 ...
* Verifying Kubernetes components...
  - Using image gcr.io/k8s-minikube/storage-provisioner:v5
* Enabled addons: storage-provisioner, default-storageclass
* Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default` }
    ]),
    path.join(outDir, '02-minikube-start.png')
  );

  // 03-minikube-status.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'minikube status' },
      { out: `minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured` },
      { cmd: 'kubectl get nodes -o wide' },
      { out: `NAME       STATUS   ROLES           AGE   VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION                              CONTAINER-RUNTIME
minikube   Ready    control-plane   12d   v1.37.0   192.168.49.2   <none>        Debian GNU/Linux 12 (bookworm)   6.18.33.2-microsoft-standard-WSL2 (amd64)   containerd://2.3.4` }
    ]),
    path.join(outDir, '03-minikube-status.png')
  );

  // 04-minikube-stop.png
  await renderScreenshot(
    page,
    buildWindowsPowerShellTerminalHtml(sess, [
      { cmd: 'minikube stop' },
      { out: `* Stopping node "minikube" ...
* Powering off "minikube" via SSH ...
* 1 node stopped.` },
      { cmd: 'minikube status' },
      { out: `minikube
type: Control Plane
host: Stopped
kubelet: Stopped
apiserver: Stopped
kubeconfig: Stopped` }
    ]),
    path.join(outDir, '04-minikube-stop.png')
  );

  await browser.close();
  console.log('Finished updating Session 9 screenshots to Windows PowerShell.');
}

run().catch(console.error);
