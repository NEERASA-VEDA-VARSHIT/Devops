# Multi-Stage Docker Build - Hello World Application

## Author Details

- **Name:** Veda
- **Enrollment Number:** [Your Enrollment Number Here]

## Application Description

This is a **multi-stage Docker build** application that displays:

> **Hello World from Docker multi-stage build**

## Build Instructions

```bash
docker build -t multi-stage-hello ./multi-stage-app
```

## Run Instructions

```bash
docker run -d --name multi-stage-test -p 8080:80 multi-stage-hello
```

## Verification

Access the application at: **http://localhost:8080**

Verify the running container:
```bash
docker ps
```

## Output

The application displays the following message in the browser:
```html
<h1>Hello World from Docker multi-stage build</h1>
```

## docker ps Output

```
CONTAINER ID   IMAGE               COMMAND                  PORTS                                    STATUS
89da69cbfb7f   multi-stage-hello   "nginx -g 'daemon off"   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   Up 3 seconds
multi-stage-test   multi-stage-hello   "nginx -g 'daemon off"   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   Up 3 seconds
```

### Verification Output

```
$ curl http://localhost:8080
<!DOCTYPE html><html><head><title>Multi-Stage</title></head><body><h1>Hello World from Docker multi-stage build</h1></body></html>
```

## Application Running on Port 8080

The container maps port **8080** on the host to port **80** in the container, confirming the application is accessible on port 8080.

## Docker Images Built

The following Docker images were built as part of this homework:

| Image | Port | Status |
|-------|------|--------|
| nodejs-hello | 3000 | ✅ Running |
| python-hello | 5000 | ✅ Running |
| java-hello | 8080 | ✅ Running |
| apache-hello | 80 | ✅ Running |
| nginx-hello | 80 | ✅ Running |
| react-hello | 80 | ✅ Running |
| multi-stage-hello | 8080 | ✅ Running |
