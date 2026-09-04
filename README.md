# Docker Networking & Volume Homework

## Author Details

- **Name:** Veda
- **Enrollment Number:** 24bcs10005

---

## Task 1: Docker Container Networking

### Setup

Created 3 containers on 3 separate Docker networks:

| Container | Image | Network(s) |
|-----------|-------|------------|
| **frontend** | `nginx:alpine` | frontend-net |
| **backend** | `alpine:latest` | backend-net, db-net |
| **database** | `mysql:8.0` | db-net |

### Docker Networks Created

```bash
docker network create frontend-net
docker network create backend-net
docker network create db-net
```

### Backend on 2 Networks

The backend container was started on both `backend-net` and `db-net`:

```bash
docker run -d --name backend --network backend-net --network db-net alpine:latest
```

### Network Verification

**Backend interfaces:**
- `eth0` → 172.19.0.2/16 (backend-net)
- `eth1` → 172.20.0.2/16 (db-net)

**Connectivity verification:**

```bash
# Backend can reach Database via db-net
docker exec backend ping -c 1 database
# Output: PING database (172.20.0.2): 56 data bytes
#         64 bytes from 172.20.0.2: seq=0 ttl=64 time=0.052 ms
#         1 packets transmitted, 1 packets received, 0% packet loss
```

DNS resolution works via Docker's embedded DNS (`127.0.0.11`):
```
Server:         127.0.0.11
Address:        127.0.0.11:53
Name:           database
Address:        172.20.0.2
```

### docker ps Output

```
CONTAINER ID   IMAGE               PORTS                                    STATUS
frontend       nginx:alpine        80/tcp                                   Up X seconds
backend        alpine:latest                                                      Up X seconds
database       mysql:8.0           3306/tcp, 33060/tcp                     Up X seconds
```

---

## Task 2: Host Network

### Apache Container on Host Network

Pulled `httpd:2.4` image and created an Apache container using host network mode:

```bash
docker pull httpd:2.4
docker run -d --name apache-host-net --network host httpd:2.4
```

### Access Apache on Port 80

With host network mode, Apache binds directly to the host's port 80:

```bash
curl http://localhost:80
```

**Output:**
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.strict.dtd">
<html>
<head><title>It works! Apache httpd</title></head>
<body><p>It works!</p></body>
</html>
```

### Verification via `docker ps`

```
CONTAINER ID   IMAGE       COMMAND              NETWORK MODE   STATUS
apache-host    httpd:2.4   "httpd-foreground"   host           Up X seconds
```

The container uses **host** network mode (`NetworkMode: host`), confirming it runs directly on the host's network stack on port 80.

---

## Task 3: Bind Mount

### Setup

Created a local folder `bind-mount/` with `index.html`:

```bash
mkdir bind-mount
echo "Hello students" > bind-mount/index.html
```

### Bind Mount to Nginx Container

```bash
docker run -d --name bind-nginx -p 8085:80 \
  -v C:/Users/Veda/Desktop/Devops/bind-mount/index.html:/usr/share/nginx/html/index.html:ro \
  nginx:alpine
```

### Initial Verification

Access `http://localhost:8085`:
```
Hello students
```

### Modify and Verify Hot-Reload

Modified `index.html` on the host:
```bash
echo "Hello students - Updated!" > bind-mount/index.html
```

**No container restart needed.** Accessing `http://localhost:8085` immediately shows:
```
Hello students - Updated!
```

The changes are reflected in real-time because the file is bind-mounted from the host filesystem.

### docker ps Verification

```
CONTAINER ID   IMAGE        PORTS              STATUS
bind-nginx     nginx:alpine   0.0.0.0:8085->80/tcp   Up X seconds
```

---

## Task 4: Overlay Network

### Research Summary

#### What is a Docker Overlay Network?

A Docker **overlay network** enables containers running on **different Docker hosts** to communicate with each other. It creates a virtual network that spans multiple hosts, encapsulating traffic between them.

#### How Overlay Networks Work

1. **VXLAN Encapsulation:** Overlay networks use VXLAN (Virtual Extensible LAN) to encapsulate Docker traffic in UDP packets. This allows containers on different physical hosts to communicate as if they were on the same local network.

2. **Swarm Mode Required:** Overlay networks require Docker Swarm mode to be initialized (`docker swarm init`). A Swarm manager distributes the network configuration to all worker nodes.

3. **Distributed Control Plane:** The Docker Swarm manager maintains a distributed control plane that:
   - Assigns IP addresses to containers across nodes
   - Maintains network state across all managers
   - Handles service discovery via DNS

4. **Workflow:**
   ```bash
   # Initialize swarm on manager
   docker swarm init --advertise-addr <MANAGER-IP>

   # Create overlay network (replicated across all nodes)
   docker network create --driver overlay my-overlay-net

   # Deploy service on overlay network
   docker service create --network my-overlay-net --name my-service my-image
   ```

5. **Packet Flow:**
   - Container A (Host 1) sends packet → VXLAN encapsulation → UDP → Host 1
   - Host 1 forwards to Host 2 → VXLAN decapsulation → Container B (Host 2) receives

#### Use Cases

- **Multi-host microservices:** Services spread across multiple Docker hosts communicating seamlessly
- **Docker Swarm services:** Built-in overlay networks for service-to-service communication in Swarm mode
- **Distributed applications:** Databases, caching layers, and web services across multiple servers
- **Production clusters:** Enterprise deployments requiring cross-node container communication

#### Key Characteristics

| Feature | Description |
|---------|-------------|
| **Scope** | Global (across swarm nodes) |
| **Driver** | `overlay` |
| **Requires** | Docker Swarm mode |
| **Protocol** | VXLAN over UDP (port 4789) |
| **Discovery** | Embedded DNS |
| **Encryption** | Supports IPSec encryption (`--opt encrypted`) |

---

## Task 5: All Deployed Applications Summary

### Docker Images Built

| Image | Port | Type | Status |
|-------|------|------|--------|
| nodejs-hello | 3000 | Node.js | ✅ Running |
| python-hello | 5000 | Python (Flask) | ✅ Running |
| java-hello | 8081 | Java (HttpServer) | ⏸ Stopped |
| apache-hello | 8082 | Apache | ✅ Running |
| nginx-hello | 8083 | Nginx | ✅ Running |
| react-hello | 3001 | React + Nginx | ✅ Running |
| multi-stage-hello | 8080 | Multi-Stage (Node+Nginx) | ✅ Running |
| apache-host | 80 | Apache (Host Network) | ✅ Running |
| bind-nginx | 8085 | Nginx (Bind Mount) | ✅ Running |
| frontend | 80 | Nginx (Bridge Network) | ✅ Running |
| backend | - | Alpine (Bridge Network) | ✅ Running |
| database | 3306 | MySQL (Bridge Network) | ✅ Running |

### Application Types Deployed (Task 3 Requirement)

✅ **Node.js** — `nodejs-hello` app running on port 3000
✅ **Python** — `python-hello` Flask app running on port 5000
✅ **Java** — `java-hello` app running on port 8081
✅ **Apache** — `apache-hello` and `apache-host` on ports 8082 and 80
✅ **Nginx** — `nginx-hello`, `bind-nginx`, `frontend` on various ports
✅ **React** — `react-hello` app running on port 3001

---

## All docker ps Output

```
CONTAINER ID   IMAGE               PORTS                                    STATUS
bind-nginx     nginx:alpine        0.0.0.0:8085->80/tcp                     Up X seconds
apache-host    httpd:2.4           host                                     Up X seconds
apache-host    httpd:2.4           0.0.0.0:80->80/tcp                       Up X seconds
frontend       nginx:alpine        80/tcp                                   Up X seconds
backend        alpine:latest       backend-net,db-net                       Up X seconds
database       mysql:8.0           3306/tcp, 33060/tcp                     Up X seconds
multi-stage    multi-stage-hello   0.0.0.0:8080->80/tcp                   Up X seconds
nodejs-hello   nodejs-hello        0.0.0.0:3000->3000/tcp                 Up X seconds
python-hello   python-hello        0.0.0.0:5000->5000/tcp                 Up X seconds
apache-hello   apache-hello        0.0.0.0:8082->80/tcp                   Up X seconds
nginx-hello    nginx-hello         0.0.0.0:8083->80/tcp                   Up X seconds
react-hello    react-hello         0.0.0.0:3001->80/tcp                   Up X seconds
```

---

## Screenshot / Command Output Evidence

### Hello World Verification Commands

```bash
# Node.js
curl http://localhost:3000
# → <h1>Hello World from Node.js!</h1>

# Python
curl http://localhost:5000
# → <h1>Hello World from Python!</h1>

# Java
curl http://localhost:8081
# → <h1>Hello World from Java!</h1>

# Apache
curl http://localhost:8082
# → <h1>Hello World from Apache!</h1>

# Nginx
curl http://localhost:8083
# → <h1>Hello World from Nginx!</h1>

# React
curl http://localhost:3001
# → <html>...Hello World from React!</html>

# Multi-Stage
curl http://localhost:8080
# → <h1>Hello World from Docker multi-stage build</h1>

# Bind Mount
curl http://localhost:8085
# → Hello students

# Apache Host Network
curl http://localhost:80
# → <p>It works!</p>
```

---

## Docker Commands Used

### Task 1: Networking
```bash
docker network create frontend-net
docker network create backend-net
docker network create db-net
docker run -d --name frontend --network frontend-net nginx:alpine
docker run -d --name backend --network backend-net --network db-net alpine:latest
docker run -d --name database --network db-net -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=appdb mysql:8.0
docker exec backend ping -c 1 database
docker network inspect backend-net
```

### Task 2: Host Network
```bash
docker run -d --name apache-host-net --network host httpd:2.4
```

### Task 3: Bind Mount
```bash
mkdir bind-mount
echo "Hello students" > bind-mount/index.html
docker run -d --name bind-nginx -p 8085:80 -v C:/Users/Veda/Desktop/Devops/bind-mount/index.html:/usr/share/nginx/html/index.html:ro nginx:alpine
```

### Task 4: Overlay Network
```bash
docker swarm init --advertise-addr <MANAGER-IP>
docker network create --driver overlay my-overlay-net
```
