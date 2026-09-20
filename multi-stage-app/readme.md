# Docker Multi-Stage Build Homework

## Student Details

**Name:** Veda Varshit  
**Enrollment Number:** 24bcs10005  
**Course:** SST DevOps & Cloud [SWE]  
**Repository:** https://github.com/NEERASA-VEDA-VARSHIT/Devops/tree/main/multi-stage-app  

---

## Task 1: Multi-Stage Docker Build

### Objective
Create a lightweight, production-grade container image using multi-stage builds in Docker to separate the build-time environment from the runtime environment.

### Dockerfile Breakdown
- **Stage 1 (Builder):** Uses `node:24-alpine` to install dependencies and compile the Express application.
- **Stage 2 (Production Runner):** Uses minimal `node:24-alpine`, copying only production dependencies and compiled assets, dramatically reducing the final image footprint.

### Build Command
```bash
docker build -t multi-stage-hello .
```

### Run Command
```bash
docker run -d --name multi-stage-app -p 8080:8080 multi-stage-hello
```

### Application Verification
```bash
curl http://localhost:8080
# Output:
# <h1>Hello World from Docker Multi-Stage Build!</h1>
```

### Docker Container Verification
```bash
docker ps
# Output:
# CONTAINER ID   IMAGE               PORTS                    STATUS
# <hash>         multi-stage-hello   0.0.0.0:8080->8080/tcp   Up 12 minutes
```

---

## Evidence & Verification

### 1. Build and Run Output
![Application running](image.png)

### 2. Browser Verification
![Browser Output](image-1.png)

### 3. Docker PS Status
![Docker PS](image-2.png)

---

## Conclusion
The multi-stage Docker application was successfully built and deployed. By isolating build tooling into a dedicated intermediate stage, the final production image size was minimized while ensuring complete reproducibility.
