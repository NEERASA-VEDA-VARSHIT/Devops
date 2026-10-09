# DevOps & Cloud Engineering Portfolio

## Author Details

- **Student Name:** Neerasa Veda Varshit
- **Enrollment Number:** 24bcs10005
- **Course:** SST DevOps & Cloud [SWE]
- **Repository:** [NEERASA-VEDA-VARSHIT/Devops](https://github.com/NEERASA-VEDA-VARSHIT/Devops)

---

## 📚 Complete DevOps Curriculum & Submission Index

| Session | Module Title | Deliverables & Topics | Documentation Link |
| :---: | :--- | :--- | :--- |
| **02** | Linux Fundamentals | Inodes (`ln`, `ln -s`), `adduser` vs `useradd`, Systemd, Cheat Sheet | [LinuxFundamentals/readme.md](./LinuxFundamentals/readme.md) |
| **03** | Shell Scripting | Automation script (`system_info.sh`), CLI flags, exit codes | [ShellScripting/readme.md](./ShellScripting/readme.md) |
| **04** | Networking Fundamentals | 8 diagnostic tools (`ping`, `curl`, `netstat`, `traceroute`, etc.) | [NetworkingFundamentals/README.md](./NetworkingFundamentals/README.md) |
| **05** | Git & GitHub | `git commit -a -m`, multi-commit cherry-pick workflow | [Git/readme.md](./Git/readme.md) |
| **06–07** | Docker Fundamentals | 6 containerized applications (Node, Python, Java, Apache, Nginx, React) | [DockerFundamentals/README.md](./DockerFundamentals/README.md) |
| **08** | Docker Networking & Volumes | Multi-tier bridge networks, isolation, bind mounts | [DockerNetwork/README.md](./DockerNetwork/README.md) |
| **09** | Kubernetes Fundamentals | Minikube setup, cluster health, node architecture | [session9-k8s/README.md](./session9-k8s/README.md) |
| **10** | Kubernetes Core Objects | Pod lifecycle, ReplicaSet, StatefulSet, Rolling Update, Canary | [session10-k8s-core-objects/README.md](./session10-k8s-core-objects/README.md) |
| **11** | Kubernetes Networking & Services | ClusterIP, NodePort, LoadBalancer, CoreDNS, FQDN resolution | [session-11-kubernetes-services/README.md](./session-11-kubernetes-services/README.md) |
| **12** | Ingress, ConfigMaps & Secrets | L7 path/host routing, ConfigMaps, Secret decoupling | [session-12-ingress-configmaps-secrets/README.md](./session-12-ingress-configmaps-secrets/README.md) |
| **13** | Storage, HPA & Probes | Dynamic PVC/PV storage, HPA CPU autoscaling, probes | [session-13-storage-hpa-probes/README.md](./session-13-storage-hpa-probes/README.md) |
| **14** | Kubernetes Troubleshooting | Multi-tier triage, CrashLoopBackOff, ImagePullBackOff, Pending | [session-14-kubernetes-troubleshooting/README.md](./session-14-kubernetes-troubleshooting/README.md) |
| **15** | Helm Package Manager | Chart scaffolding, templates, values, install, upgrade, rollback | [session-15-helm/README.md](./session-15-helm/README.md) |
| **16** | CI/CD & GitHub Actions | Automated build/test pipeline, artifacts, secrets, workflow runs | [session-16-github-actions/README.md](./session-16-github-actions/README.md) \| [session16-cicd](./session16-cicd/README.md) |
| **17** | DevSecOps & Security | SAST (Bandit), SCA (pip-audit), Trivy container scanning | [session-17-devsecops/README.md](./session-17-devsecops/README.md) |
| **18** | Terraform & IaC | Declarative S3 bucket provisioning, AWS IAM least-privilege | [session18-terraform-iac/README.md](./session18-terraform-iac/README.md) |
| **19** | Multi-Tier Cloud with Terraform | Modular VPC, public/private subnets, EC2, S3, Security Groups | [session19-cloud-terraform/README.md](./session19-cloud-terraform/README.md) |
| **20** | Monitoring, Logging & GitOps | Prometheus, Grafana, Loki, OpenTelemetry, ArgoCD GitOps | [session20-monitoring-observability-gitops/README.md](./session20-monitoring-observability-gitops/README.md) |
| **21** | Final DevOps Capstone Project | Production 3-tier TaskBoard app, GitOps, DevSecOps, EKS | [final-devops-project/README.md](./final-devops-project/README.md) |

---

## Repository Structure Overview

```
C:\Users\Veda\Desktop\Devops\

├── DockerFundamentals\          # All Docker app folders (Node.js, Python, Java, Apache, Nginx, React, Bind Mount)
│   ├── nodejs-app\
│   ├── python-app\
│   ├── java-app\
│   ├── Apache-app\
│   ├── nginx-app\
│   ├── React-app\
│   └── bind-mount\
├── DockerNetwork\               # Docker Networking & Volume Homework
│   └── README.md
├── Git\                         # Git Homework (screenshots + commands)
│   ├── readme.md
│   ├── Screenshot 2026-09-04 214606.png
│   ├── Screenshot 2026-09-04 214614.png
│   ├── Screenshot 2026-09-04 214626.png
│   └── Screenshot 2026-09-04 214632.png
├── multi-stage-app\             # Multi-Stage Docker Build with screenshots
│   ├── Dockerfile
│   ├── server.js
│   ├── package.json
│   ├── image.png
│   ├── image-1.png
│   ├── image-2.png
│   └── readme.md
└── Git-Exercise\                # Git commit -a -m and cherry-pick exercises
    └── temp.txt
```

---

## Task 1: Docker Multi-Stage Build ✅

### Folder: `multi-stage-app/`

- **Dockerfile:** Multi-stage build using Node.js 24-alpine (builder + production stages)
- **Server:** Express.js app displaying `Hello World from Docker Multi-Stage Build!` on port 8080
- **Screenshots:** See `multi-stage-app/image.png`, `image-1.png`, `image-2.png`

```bash
docker build -t multi-stage-hello ./multi-stage-app
docker run -d --name multi-stage-test -p 8080:8080 multi-stage-hello
curl http://localhost:8080
# → <h1>Hello World from Docker Multi-Stage Build!</h1>
```

### docker ps Verification

```
CONTAINER ID   IMAGE               PORTS                                    STATUS
multi-stage-test multi-stage-hello 0.0.0.0:8080->8080/tcp             Up X minutes
```

---

## Task 2: Docker Application Deployment ✅

### 3+ Application Types Deployed

| App | Folder | Port | Image | Status |
|-----|--------|------|-------|--------|
| **Node.js** | `DockerFundamentals/nodejs-app/` | 3000 | `nodejs-hello` | ✅ |
| **Python** | `DockerFundamentals/python-app/` | 5000 | `python-hello` | ✅ |
| **Java** | `DockerFundamentals/java-app/` | 8081 | `java-hello` | ✅ |
| **Apache** | `DockerFundamentals/Apache-app/` | 8082 | `apache-hello` | ✅ |
| **Nginx** | `DockerFundamentals/nginx-app/` | 8083 | `nginx-hello` | ✅ |
| **React** | `DockerFundamentals/React-app/` | 3001 | `react-hello` | ✅ |

### Hello World Outputs

```bash
$ curl http://localhost:3000
<h1>Hello World from Node.js!</h1>

$ curl http://localhost:5000
<h1>Hello World from Python!</h1>

$ curl http://localhost:8081
<h1>Hello World from Java!</h1>

$ curl http://localhost:8082
<h1>Hello World from Apache!</h1>

$ curl http://localhost:8083
<h1>Hello World from Nginx!</h1>
```

---

## Task 3: Docker Container Networking ✅

### Folder: `DockerNetwork/README.md`

Created 3 containers on 3 Docker networks:
- **frontend** (nginx:alpine) → `frontend-net`
- **backend** (alpine:latest) → `backend-db-net` + `backend-isolated-net` (2 networks)
- **database** (mysql:8.0) → `backend-db-net`

**Connectivity verified:**
```bash
docker exec backend ping -c 1 database
# PING database (172.21.0.2): 56 data bytes
# 64 bytes from 172.21.0.2: seq=0 ttl=64 time=1.475 ms
# 1 packets transmitted, 1 packets received, 0% packet loss
```

---

## Task 4: Host Network ✅

Apache container using `--network host` on port 80:
```bash
docker run -d --name apache-host --network host httpd:2.4
curl http://localhost:80
# → <p>It works!</p>
```

---

## Task 5: Bind Mount ✅

Bind-mounted local folder to Nginx container on port 8085:
```bash
docker run -d --name bind-nginx -p 8085:80 \
  -v C:/Users/Veda/Desktop/Devops/DockerFundamentals/bind-mount/index.html:/usr/share/nginx/html/index.html:ro \
  nginx:alpine
curl http://localhost:8085
# → Hello students
```

**Hot-reload verified:** Modifying `index.html` on host immediately reflects in the container without restart.

---

## Task 6: Overlay Network ✅

See `DockerNetwork/README.md` for full research on:
- VXLAN encapsulation
- Swarm mode requirements
- Use cases and packet flow
- Key characteristics

---

## Git Homework ✅

### Folder: `Git/`

See `Git/readme.md` for complete documentation including:

**Task 1: `git commit -a -m` vs `git commit -m`**
- `git commit -m` commits only explicitly staged files
- `git commit -a -m` auto-stages all tracked modified/deleted files
- Both demonstrated with actual commands and outputs

**Task 2: Git Cherry-Pick**
- Created 3 commits on `cherry-pick-branch`
- Cherry-picked commit `1fc9263` to `main` branch
- Verified commit is now available in `main`
- Commit hash: `76dd491`

### Screenshots

![Screenshot 1](Git/Screenshot%202026-09-04%20214606.png)
![Screenshot 2](Git/Screenshot%202026-09-04%20214614.png)
![Screenshot 3](Git/Screenshot%202026-09-04%20214626.png)
![Screenshot 4](Git/Screenshot%202026-09-04%20214632.png)

---

## Complete docker ps Output

```bash
$ docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"
NAMES              IMAGE               PORTS                                    STATUS
frontend           nginx:alpine        80/tcp                                   Up 3 minutes
backend            alpine:latest                                                     Up 3 minutes
database           mysql:8.0           3306/tcp, 33060/tcp                     Up 3 minutes
multi-stage-test   multi-stage-hello   0.0.0.0:8080->8080/tcp                  Up 12 minutes
java-test          java-hello          0.0.0.0:8081->8080/tcp                  Up 22 minutes
apache-host        httpd:2.4           0.0.0.0:80->80/tcp                      Up 26 minutes
bind-nginx         nginx:alpine        0.0.0.0:8085->80/tcp                    Up 27 minutes
react-test         react-hello         0.0.0.0:3001->80/tcp                    Up 35 minutes
nginx-test         nginx-hello         0.0.0.0:8083->80/tcp                    Up 35 minutes
apache-test        apache-hello        0.0.0.0:8082->80/tcp                    Up 35 minutes
python-test        python-hello        0.0.0.0:5000->5000/tcp                  Up 35 minutes
nodejs-test        nodejs-hello        0.0.0.0:3000->3000/tcp                  Up 35 minutes
```

### Network List

```bash
$ docker network ls --format "table {{.Name}}\t{{.Driver}}"
NAME                DRIVER
backend-db-net      bridge
backend-isolated-net bridge
backend-net         bridge
db-net              bridge
frontend-net        bridge
bridge              bridge
host                host
none                null
```

### Git Commit Log

```bash
$ git log --oneline -10
64131d7 Add all Docker fundamentals, Git homework screenshots, and multi-stage app with images
0aca56e Test commit -a -m (auto-staged)
3bf6a02 Test commit -m (staged)
76dd491 First commit on cherry-pick-branch
a6f3390 Update README with current network config and all evidence
5320ed3 Add complete command output evidence for all tasks
70db7bc Add bind-mount folder
c677eb9 Add Docker Networking & Volume homework documentation
c801856 Update enrollment number
e0630bc Update Docker status table
```

---

## Docker Commands Summary

### Multi-Stage Build
```bash
cd multi-stage-app
docker build -t multi-stage-hello .
docker run -d --name multi-stage-test -p 8080:8080 multi-stage-hello
```

### Node.js
```bash
docker build -t nodejs-hello ./DockerFundamentals/nodejs-app
docker run -d --name nodejs-test -p 3000:3000 nodejs-hello
```

### Python
```bash
docker build -t python-hello ./DockerFundamentals/python-app
docker run -d --name python-test -p 5000:5000 python-hello
```

### Java
```bash
docker build -t java-hello ./DockerFundamentals/java-app
docker run -d --name java-test -p 8081:8080 java-hello
```

### Apache
```bash
docker build -t apache-hello ./DockerFundamentals/Apache-app
docker run -d --name apache-test -p 8082:80 apache-hello
```

### Nginx
```bash
docker build -t nginx-hello ./DockerFundamentals/nginx-app
docker run -d --name nginx-test -p 8083:80 nginx-hello
```

### React
```bash
docker build -t react-hello ./DockerFundamentals/React-app
docker run -d --name react-test -p 3001:80 react-hello
```

### Networking
```bash
docker network create frontend-net
docker network create backend-db-net
docker network create backend-isolated-net
docker run -d --name frontend --network frontend-net nginx:alpine
docker run -d --name backend --network backend-db-net --network backend-isolated-net alpine:latest
docker run -d --name database --network backend-db-net -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=studentdb mysql:8
docker exec backend ping -c 1 database
```

### Host Network
```bash
docker run -d --name apache-host --network host httpd:2.4
```

### Bind Mount
```bash
docker run -d --name bind-nginx -p 8085:80 \
  -v C:/Users/Veda/Desktop/Devops/DockerFundamentals/bind-mount/index.html:/usr/share/nginx/html/index.html:ro \
  nginx:alpine
```

### Git
```bash
git commit -m "message"
git commit -a -m "message"
git branch cherry-pick-branch
git checkout cherry-pick-branch
git commit -m "First commit on cherry-pick-branch"
git cherry-pick <commit-hash>
```

---

## Screenshots

### Multi-Stage Build
![Multi-Stage App](multi-stage-app/image.png)
![Multi-Stage App 1](multi-stage-app/image-1.png)
![Multi-Stage App 2](multi-stage-app/image-2.png)

### Git Homework
![Git Screenshot 1](Git/Screenshot%202026-09-04%20214606.png)
![Git Screenshot 2](Git/Screenshot%202026-09-04%20214614.png)
![Git Screenshot 3](Git/Screenshot%202026-09-04%20214626.png)
![Git Screenshot 4](Git/Screenshot%202026-09-04%20214632.png)

---

## 🚀 DevSecOps Capstone Project Deliverables (M1–M10 Rubric)

### Mandatory Submission Artifacts
- **Official Submission Form:** [Google Form](https://forms.gle/XWAP1vAumDJgAPM1A)
- **Evaluation Rubric:** [GRADING.md](./session21-python/GRADING.md)
- **Presentation Slide Deck (PPTX):** [`demo/presentation.pptx`](./demo/presentation.pptx) (10 slides)
- **Presentation Slide Deck (PDF):** [`demo/slides.pdf`](./demo/slides.pdf) (10 slides)
- **Walkthrough Video (MP4):** [`demo/presentation_walkthrough.mp4`](./demo/presentation_walkthrough.mp4) (H.264 / AAC 1080p)
- **Demo Documentation:** [`demo/README.md`](./demo/README.md)

### Module Compliance Matrix
- **M1 — Full-Stack Application:** FastAPI REST backend + React 18 client + PostgreSQL 16 + Alembic migrations in [`final-devops-project/application/`](./final-devops-project/application/).
- **M2 — Automated Testing:** Pytest test suite with 7 test cases covering health, CRUD, statistics, and error validation.
- **M3 — Git & GitHub:** Clean Git commit history, properly structured branch workflow, `.gitignore` excluding secrets, caches, and node_modules.
- **M4 — Docker Multi-Stage:** Multi-stage builds for backend and frontend running as non-root users with [`docker-compose.yml`](./final-devops-project/docker/docker-compose.yml).
- **M5 — CI/CD Pipeline:** GitHub Actions workflow executing build, pytest quality gates, and pushing SHA-tagged images to GHCR.
- **M6 — DevSecOps:** Aqua Security Trivy container CVE scans with automated pipeline break on HIGH/CRITICAL vulnerabilities.
- **M7 — Terraform IaC:** Modular AWS infrastructure provisioning VPC (multi-AZ) and managed AWS EKS cluster with clean destroy verification.
- **M8 — Kubernetes & Helm:** Production deployment in `taskboard` namespace using parameterized Helm charts with 2+ replicas, Ingress, and health probes.
- **M9 — Observability:** Live `/metrics` scraping via Prometheus and Grafana dashboards for latency, RPS, and error rates.
- **M10 — Final Presentation & Documentation:** Complete technical documentation in root `README.md`, slide deck (`presentation.pptx` / `slides.pdf`), and walkthrough video (`presentation_walkthrough.mp4`).

---

## Submission

Repository is fully configured, validated, and synced to GitHub:
```bash
git remote add origin https://github.com/NEERASA-VEDA-VARSHIT/Devops.git
git push origin main
```

