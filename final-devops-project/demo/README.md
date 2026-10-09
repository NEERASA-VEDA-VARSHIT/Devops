# DevSecOps Capstone Project — Demo & Presentation Deliverables

**Student Name:** Neerasa Veda Varshit  
**Enrollment Number:** 24bcs10005  
**Course:** SST DevOps & Cloud [SWE]  
**Repository:** [NEERASA-VEDA-VARSHIT/Devops](https://github.com/NEERASA-VEDA-VARSHIT/Devops)  

---

## 📦 Mandatory Artifacts Submitted

This directory contains the mandatory **Module M10** evaluation artifacts required by the DevSecOps Final Capstone evaluation rubric:

| Artifact | File Path | Format | Status |
| :--- | :--- | :--- | :--- |
| **Presentation Slide Deck (PPTX)** | [`demo/presentation.pptx`](./presentation.pptx) | Microsoft PowerPoint Presentation | ✅ Attached (10 Slides) |
| **Presentation Slide Deck (PDF)** | [`demo/slides.pdf`](./slides.pdf) | Portable Document Format (PDF) | ✅ Attached (10 Slides) |
| **Walkthrough Video (MP4)** | [`demo/presentation_walkthrough.mp4`](./presentation_walkthrough.mp4) | H.264 / AAC 1080p Video | ✅ Attached (<100MB Git Compliant) |

---

## 🎥 Video Presentation Agenda & Timestamp Index

The walkthrough presentation follows the exact evaluation sequence specified in the submission guidelines:

1. **Slide Deck Presentation (Slides 1–10):**
   - High-level project summary and architectural breakdown.
   - Core design decisions (Decoupled microservices, shift-left DevSecOps, IaC, GitOps).
2. **Codebase Deep Dive:**
   - Folder structure, multi-stage Dockerfiles, and Alembic migrations.
   - FastAPI REST endpoints, SQLAlchemy models, and Pytest coverage suite.
3. **Automated CI/CD & Security Gates:**
   - Triggering push to `main` and watching GitHub Actions pipeline execution.
   - Pytest execution, Bandit SAST, pip-audit SCA, and Aqua Trivy container CVE scans.
   - Immutable image publishing to GitHub Container Registry (GHCR) using Git SHA tags.
4. **Terraform AWS Infrastructure as Code:**
   - Multi-AZ VPC provisioning with public and private subnets.
   - AWS EKS Managed Kubernetes cluster and worker node groups.
   - Validation of `terraform plan` and `terraform destroy` safety procedures.
5. **GitOps Continuous Delivery with ArgoCD:**
   - Declarative Helm chart synchronization against the `taskboard` namespace.
   - Real-time drift detection and self-healing demonstration.
6. **Kubernetes Cluster Health:**
   - `kubectl get pods,svc,ingress -n taskboard` showing all replicas in `Running` state.
   - Ingress routing verification and Liveness/Readiness probe checks.
7. **Observability & Telemetry:**
   - `/metrics` endpoint scrape verification via Prometheus.
   - Prometheus Targets console showing target status as **UP**.
   - Grafana live dashboard visualizing Request Rate (RPS), Latency, and error distribution.
