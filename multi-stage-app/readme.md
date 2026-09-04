# Docker Multi-Stage Build Homework

## Student Details

**Name:** Veda Varshit
**Enrollment Number:** `<YOUR_ENROLLMENT_NUMBER>`

---

## Task 1: Multi-Stage Docker Build

### Repository

https://github.com/Nency-Ravaliya/devops-heros/tree/main/session6-7-docker/multi-stage-dockerfile

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
```

Expected output:

```html
<h1>Hello World from Docker multi-stage build</h1>
```

### Docker Container Verification

```bash
docker ps
```

Expected port mapping:

```text
0.0.0.0:8080->8080/tcp
```

### Evidence

#### Application Running

Paste your screenshot here:

`![Application running](screenshots/application-running.png)`

#### Docker PS Output

Paste your screenshot here:

`![Docker PS](screenshots/docker-ps.png)`

---

# Task 3: Docker Application Deployment

## 1. Node.js Application

### Build

```bash
docker build -t node-hello ./nodejs-app
```

### Run

```bash
docker run -d --name node-hello -p 3001:3000 node-hello
```

### Verify

```bash
curl http://localhost:3001
```

---

## 2. Python Application

### Build

```bash
docker build -t python-hello ./python-app
```

### Run

```bash
docker run -d --name python-hello -p 5000:5000 python-hello
```

### Verify

```bash
curl http://localhost:5000
```

---

## 3. Java Application

### Build

```bash
docker build -t java-hello ./java-app
```

### Run

```bash
docker run -d --name java-hello -p 8081:8080 java-hello
```

### Verify

```bash
curl http://localhost:8081
```

---

# Conclusion

The multi-stage Docker application was successfully built and deployed using Docker.

The application was exposed on port `8080`, verified through the browser/curl, and the running container was confirmed using `docker ps`.

Three additional application types were also deployed using Docker:

* Node.js
* Python
* Java


![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)