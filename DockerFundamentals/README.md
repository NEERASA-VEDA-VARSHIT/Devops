# Docker Fundamentals: Multi-Application Deployment Lab

**Course:** SST DevOps & Cloud [SWE]  
**Student Name:** Neerasa Veda Varshit  
**Enrollment Number:** 24bcs10005  
**Environment:** Windows 11 Home (ZEROBOOK) / Docker Desktop v4.38.0  
**Repository:** NEERASA-VEDA-VARSHIT/Devops / DockerFundamentals  

---

## 📌 Overview

This lab demonstrates containerizing and deploying multiple distinct application stacks (6 different technology stacks) using Docker:
1. **Node.js** (Express.js web application on port `3000`)
2. **Python** (Flask/HTTP application on port `5000`)
3. **Java** (Spring Boot / Java runtime application on port `8081`)
4. **Apache HTTP Server** (Custom HTML web server on port `8082`)
5. **Nginx Web Server** (Lightweight Alpine web server on port `8083`)
6. **React.js Application** (Production React build served via container on port `3001`)
7. **Bind Mount Demonstration** (Live hot-reloading static site on port `8085`)

---

## Application Deployment Matrix

| Application | Directory | Container Port | Host Port | Docker Image Tag | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Node.js** | `DockerFundamentals/nodejs-app/` | `3000` | `3000` | `nodejs-hello` | ✅ Healthy |
| **Python** | `DockerFundamentals/python-app/` | `5000` | `5000` | `python-hello` | ✅ Healthy |
| **Java** | `DockerFundamentals/java-app/` | `8080` | `8081` | `java-hello` | ✅ Healthy |
| **Apache** | `DockerFundamentals/Apache-app/` | `80` | `8082` | `apache-hello` | ✅ Healthy |
| **Nginx** | `DockerFundamentals/nginx-app/` | `80` | `8083` | `nginx-hello` | ✅ Healthy |
| **React** | `DockerFundamentals/React-app/` | `80` | `3001` | `react-hello` | ✅ Healthy |
| **Bind Mount** | `DockerFundamentals/bind-mount/` | `80` | `8085` | `nginx:alpine` | ✅ Healthy |

---

## Build & Run Commands

### 1. Node.js Application (Port 3000)
```bash
cd nodejs-app
docker build -t nodejs-hello .
docker run -d --name nodejs-test -p 3000:3000 nodejs-hello
curl http://localhost:3000
# Output: <h1>Hello World from Node.js!</h1>
```

### 2. Python Application (Port 5000)
```bash
cd ../python-app
docker build -t python-hello .
docker run -d --name python-test -p 5000:5000 python-hello
curl http://localhost:5000
# Output: <h1>Hello World from Python!</h1>
```

### 3. Java Application (Port 8081)
```bash
cd ../java-app
docker build -t java-hello .
docker run -d --name java-test -p 8081:8080 java-hello
curl http://localhost:8081
# Output: <h1>Hello World from Java!</h1>
```

### 4. Apache HTTP Server (Port 8082)
```bash
cd ../Apache-app
docker build -t apache-hello .
docker run -d --name apache-test -p 8082:80 apache-hello
curl http://localhost:8082
# Output: <h1>Hello World from Apache!</h1>
```

### 5. Nginx Web Server (Port 8083)
```bash
cd ../nginx-app
docker build -t nginx-hello .
docker run -d --name nginx-test -p 8083:80 nginx-hello
curl http://localhost:8083
# Output: <h1>Hello World from Nginx!</h1>
```

### 6. React Application (Port 3001)
```bash
cd ../React-app
docker build -t react-hello .
docker run -d --name react-test -p 3001:80 react-hello
curl http://localhost:3001
# Output: Serving React Production Bundle
```

### 7. Bind Mount with Live Reload (Port 8085)
```bash
docker run -d --name bind-nginx -p 8085:80 \
  -v C:/Users/Veda/Desktop/Devops/DockerFundamentals/bind-mount/index.html:/usr/share/nginx/html/index.html:ro \
  nginx:alpine
curl http://localhost:8085
# Output: Hello students
```

---

## Container Status & Verification

```bash
$ docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"
NAMES              IMAGE               PORTS                                    STATUS
bind-nginx         nginx:alpine        0.0.0.0:8085->80/tcp                    Up 27 minutes
react-test         react-hello         0.0.0.0:3001->80/tcp                    Up 35 minutes
nginx-test         nginx-hello         0.0.0.0:8083->80/tcp                    Up 35 minutes
apache-test        apache-hello        0.0.0.0:8082->80/tcp                    Up 35 minutes
java-test          java-hello          0.0.0.0:8081->8080/tcp                  Up 22 minutes
python-test        python-hello        0.0.0.0:5000->5000/tcp                  Up 35 minutes
nodejs-test        nodejs-hello        0.0.0.0:3000->3000/tcp                  Up 35 minutes
```
