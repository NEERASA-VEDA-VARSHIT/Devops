# Session 11: Kubernetes Networking, Service Architecture & DNS Deep Dive

**Course:** SST DevOps & Cloud [SWE]  
**Session:** 11 - Kubernetes Services Deep Dive  
**Repository:** devops-heros / session-11-kubernetes-services  

---

## Task 1: Kubernetes Port Architecture & Clarification Drill

**Description:** Demystify and document the precise boundaries, scope, and routing path of the 4 Kubernetes ports: `containerPort`, `targetPort`, `port`, and `nodePort`.

**Architecture Flowchart:**
```text
Client Browser (External User)
       |
       | Requests http://<Node-IP>:30080
       v
+-------------------------------------------------------------+
| WORKER NODE HOST                                            |
|                                                             |
|   [ nodePort: 30080 ]  (Port exposed on Host Network)       |
|            |                                                |
|            v                                                |
|   +-----------------------------------------------------+   |
|   | KUBERNETES SERVICE (ClusterIP VIP: 10.96.120.45)    |   |
|   |                                                     |   |
|   |   [ port: 8080 ]   (Internal Cluster Virtual Port)  |   |
|   +--------------------------+--------------------------+   |
|                              |                              |
|                              | kube-proxy iptables route    |
|                              v                              |
|   +-----------------------------------------------------+   |
|   | BACKEND POD (Overlay Network IP: 10.244.0.15)       |   |
|   |                                                     |   |
|   |   [ targetPort: 80 ] (Port intercepted by Pod)     |   |
|   |            |                                        |   |
|   |            v                                        |   |
|   |   [ containerPort: 80 ] (App Socket: Nginx/Python)  |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

**Screenshot:**
![Port Architecture](./screenshots/01-port-architecture.png)

---

## Task 2: Type 1 Service — ClusterIP (Default Internal Networking)

**Description:** Deploy a 3-replica backend (`web-app-clusterip`), create a `ClusterIP` service on port `8080` targeting container port `80`, inspect automatic endpoint binding, and test internal connectivity.

**Commands to Run:**
```bash
# Deploy application and service
kubectl apply -f 01-clusterip/app-deployment.yaml
kubectl apply -f 01-clusterip/service.yaml

# Verify Service and Endpoints
kubectl get svc,endpoints web-service-clusterip

# Deploy curl client and test resolution
kubectl apply -f 01-clusterip/client-pod.yaml
kubectl exec -it curl-client -- curl -s http://web-service-clusterip:8080 | grep -i "<title>"
kubectl exec -it curl-client -- curl -s http://web-service-clusterip.default.svc.cluster.local:8080 | grep -i "<title>"
```

**Output:**
```
NAME                            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/web-service-clusterip   ClusterIP   10.96.120.45    <none>        8080/TCP   25s

NAME                              ENDPOINTS                                            AGE
endpoints/web-service-clusterip   10.244.0.12:80,10.244.0.13:80,10.244.0.14:80        25s

<title>Welcome to nginx!</title>
<title>Welcome to nginx!</title>
```

**Screenshot:**
![ClusterIP Service](./screenshots/02-clusterip-service.png)

---

## Task 3: Type 2 Service — NodePort (Host-Level External Ingress)

**Description:** Deploy a 2-replica Nginx app and expose it externally by opening port `30080` on every cluster node, verifying connectivity via Minikube IP and service tunnel URL.

**Commands to Run:**
```bash
kubectl apply -f 02-nodeport/app-deployment.yaml
kubectl apply -f 02-nodeport/service.yaml

# Verify NodePort mapping
kubectl get svc web-service-nodeport

# Access via minikube service tunnel
minikube service web-service-nodeport --url
curl -I http://127.0.0.1:54321
```

**Output:**
```
NAME                   TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
web-service-nodeport   NodePort   10.96.185.72    <none>        80:30080/TCP   30s

* Opening service default/web-service-nodeport in default browser...
http://127.0.0.1:54321

HTTP/1.1 200 OK
Server: nginx/1.27.0
Content-Type: text/html
Content-Length: 615
```

**Screenshot:**
![NodePort Service](./screenshots/03-nodeport-service.png)

---

## Task 4: Type 3 Service — LoadBalancer (Cloud-Native Ingress Simulation)

**Description:** Deploy an externally facing service using `type: LoadBalancer`, simulate cloud controller IP allocation using `minikube tunnel`, and test public access.

**Commands to Run:**
```bash
kubectl apply -f 03-loadbalancer/app-deployment.yaml
kubectl apply -f 03-loadbalancer/service.yaml

# Run minikube tunnel in separate terminal
# minikube tunnel

kubectl get svc web-service-loadbalancer
curl -s http://127.0.0.1:80 | grep -i "<title>"
```

**Output:**
```
NAME                       TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
web-service-loadbalancer   LoadBalancer   10.96.90.112   127.0.0.1     80:31250/TCP   45s

<title>Welcome to nginx!</title>
```

**Screenshot:**
![LoadBalancer Service](./screenshots/04-loadbalancer-svc.png)

---

## Task 5: Type 4 Service — ExternalName (CoreDNS CNAME Alias Redirection)

**Description:** Create an `ExternalName` service pointing to an external domain (`api.github.com`) without selectors or endpoints, and prove CNAME redirection inside a test pod via `nslookup`.

**Commands to Run:**
```bash
kubectl apply -f 04-externalname/service.yaml
kubectl apply -f 04-externalname/client-pod.yaml

kubectl get svc external-database-service
kubectl exec -it dns-test-client -- nslookup external-database-service
```

**Output:**
```
NAME                        TYPE           CLUSTER-IP   EXTERNAL-IP      PORT(S)   AGE
external-database-service   ExternalName   <none>       api.github.com   <none>    32s

Server:         10.96.0.10
Address:        10.96.0.10#53

external-database-service.default.svc.cluster.local canonical name = api.github.com.
Name:   api.github.com
Address: 140.82.121.6
```

**Screenshot:**
![ExternalName Service](./screenshots/05-externalname-svc.png)

---

## Task 6: Type 5 Service — Headless Service (`clusterIP: None` & Stateful Workloads)

**Description:** Deploy a Headless Service paired with a `StatefulSet`, demonstrate that CoreDNS returns individual Pod IPs directly instead of a single virtual IP, and test ordinal pod addressing.

**Commands to Run:**
```bash
kubectl apply -f 05-headless/service.yaml
kubectl apply -f 05-headless/app-statefulset.yaml

kubectl get svc web-service-headless
kubectl exec -it headless-dns-client -- nslookup web-service-headless
kubectl exec -it headless-dns-client -- curl -s http://web-stateful-0.web-service-headless:80 | grep -i "<title>"
```

**Output:**
```
NAME                   TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
web-service-headless   ClusterIP   None         <none>        80/TCP    40s

Server:         10.96.0.10
Address:        10.96.0.10#53

Name:   web-service-headless.default.svc.cluster.local
Address: 10.244.0.21
Name:   web-service-headless.default.svc.cluster.local
Address: 10.244.0.22
Name:   web-service-headless.default.svc.cluster.local
Address: 10.244.0.23

<title>Welcome to nginx!</title>
```

**Screenshot:**
![Headless Service](./screenshots/06-headless-service.png)

---

## Task 7: Services Without Selectors (Manual Endpoints Mapping)

**Description:** Create a custom `ClusterIP` service without a label selector, manually construct a matching `Endpoints` object pointing to external IP infrastructure (`192.168.1.150:3306`), and verify binding.

**Commands to Run:**
```bash
kubectl apply -f troubleshooting/empty-endpoints.yaml
kubectl get endpoints external-legacy-db

# Manually bind endpoints
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Endpoints
metadata:
  name: external-legacy-db
subsets:
  - addresses:
      - ip: 192.168.1.150
    ports:
      - port: 3306
EOF

kubectl get endpoints external-legacy-db
```

**Output:**
```
NAME                 ENDPOINTS   AGE
external-legacy-db   <none>      12s

endpoints/external-legacy-db created

NAME                 ENDPOINTS            AGE
external-legacy-db   192.168.1.150:3306   2s
```

**Screenshot:**
![Manual Endpoints Mapping](./screenshots/07-manual-endpoints.png)

---

## Task 8: FQDN & CoreDNS Deep Dive Architecture Analysis

**Description:** Inspect `/etc/resolv.conf` inside a running pod, break down Kubernetes FQDN hierarchical structure (`<service>.<namespace>.svc.cluster.local`), and analyze the latency implications of `ndots:5`.

**Commands to Run:**
```bash
kubectl exec -it curl-client -- cat /etc/resolv.conf
kubectl exec -it curl-client -- nslookup web-service-clusterip
```

**Output:**
```
nameserver 10.96.0.10
search default.svc.cluster.local svc.cluster.local cluster.local
options ndots:5

Server:         10.96.0.10
Address:        10.96.0.10#53

Name:   web-service-clusterip.default.svc.cluster.local
Address: 10.96.120.45
```

**Latency Analysis of `ndots:5`:**
When a query contains fewer than 5 dots (e.g., `api.github.com` has 2 dots), the DNS resolver first appends all local search domains (`api.github.com.default.svc.cluster.local.`, `api.github.com.svc.cluster.local.`, etc.), generating 3 to 4 sequential NXDOMAIN queries before finally querying the external root server. In high-throughput environments, this induces significant DNS latency, which can be mitigated by appending a trailing dot (`api.github.com.`) or setting `ndots:2` in `dnsConfig`.

**Screenshot:**
![CoreDNS & FQDN](./screenshots/08-coredns-fqdn.png)

---

## Task 9: Pod Identity & Lifecycle Invariance Drill — Deployment vs. StatefulSet

**Description:** Deploy a stateless Deployment alongside a stateful StatefulSet. Imperatively delete a pod from each controller to prove Deployments replace pods with new random hashes, while StatefulSets strictly preserve invariant ordinal identities (`web-stateful-0`).

**Commands to Run:**
```bash
kubectl get pods -l app=web-clusterip && kubectl get pods -l app=web-headless

kubectl delete pod web-app-clusterip-6c679b9456-4d9vz
kubectl delete pod web-stateful-0

kubectl get pods -l app=web-clusterip && kubectl get pods -l app=web-headless
```

**Output:**
```
NAME                                   READY   STATUS    RESTARTS   AGE
web-app-clusterip-6c679b9456-4d9vz     1/1     Running   0          3m
web-stateful-0                         1/1     Running   0          3m

pod "web-app-clusterip-6c679b9456-4d9vz" deleted
pod "web-stateful-0" deleted

# Deployment: Ephemeral random hash generated
web-app-clusterip-6c679b9456-x8k2m     1/1     Running   0          4s

# StatefulSet: Invariant identity recreated identically
web-stateful-0                         1/1     Running   0          3s
```

**Screenshot:**
![Pod Identity Invariance](./screenshots/09-pod-identity.png)

---

## Task 10: Master Architectural Matrix — Deployment vs. StatefulSet vs. DaemonSet

**Description:** Architectural comparison across the three primary Kubernetes workload controllers.

| Architectural Metric | Deployment | StatefulSet | DaemonSet |
| :--- | :--- | :--- | :--- |
| **Primary Workload Type** | Stateless microservices, Web APIs | Clustered databases, Distributed queues | Node-level monitoring & logging agents |
| **Pod Naming Scheme** | Random hash (`app-6c679b-4d9vz`) | Deterministic ordinal (`web-0, web-1`) | Deterministic node hash (`agent-7b4xq`) |
| **Pod Identity Persistence** | Ephemeral (disposable upon failure) | Invariant (retains ordinal index & PVC) | Bound to individual cluster node host |
| **Startup / Shutdown Sequencing** | Non-ordered, concurrent parallel | Strict sequential (`0 -> 1 -> 2`) | Parallel across all schedulable nodes |
| **Storage Volume Lifecycle** | Ephemeral `emptyDir` or shared PVC | Dedicated PV per pod via `volumeClaimTemplates` | `hostPath` mounts or node-local storage |
| **Associated Service Pattern** | Virtual IP (`ClusterIP` / `NodePort`) | **Headless Service** (`clusterIP: None`) | Optional local `ClusterIP` |
| **Production Workloads** | Nginx, Node.js API, Python Flask, Go | Kafka, Cassandra, PostgreSQL, ZooKeeper | Prometheus Node-Exporter, Fluentd, Cilium |

**Screenshot:**
![Master Architectural Matrix](./screenshots/10-architectural-matrix.png)

---

## Task 11: Production Cost Optimization & Service Selection Decision Tree

**Description:** Document the enterprise cloud anti-pattern of provisioning multiple `type: LoadBalancer` services ($18–$25/month each) and demonstrate how an Ingress Controller eliminates this overhead.

```text
ANTI-PATTERN (Excessive Cost: $25/mo per LoadBalancer):
Microservice A  ──► AWS NLB 1 ($25/mo) ──► ClusterIP A
Microservice B  ──► AWS NLB 2 ($25/mo) ──► ClusterIP B
Microservice C  ──► AWS NLB 3 ($25/mo) ──► ClusterIP C
... Total for 50 services = $1,250 / month!

BEST PRACTICE (Enterprise Cost-Optimized Ingress Pattern):
Public Internet ──► [ Single Unified Cloud Load Balancer: $25/mo ]
                                   |
                                   v
                      [ NGINX Ingress Controller ]
                      (Layer 7 Host & Path Routing)
                         |             |             |
                         v             v             v
                    ClusterIP A   ClusterIP B   ClusterIP C
Total for 50 services = $25 / month  ──► NET SAVINGS: $1,225 / month (98% reduction!)
```

**Screenshot:**
![Cost Optimization & Decision Tree](./screenshots/11-cost-optimization.png)

---

## Task 12: Minikube Docker-Driver Port Binding & Tunnel Gotcha Analysis

**Description:** Analyze and document why running `curl http://<Node-IP>:<NodePort>` fails on macOS and Windows when using Minikube with the Docker driver, and verify the standard operational solutions.

**Root Cause Analysis:**
On macOS and Windows, Minikube runs inside an isolated Docker container bridge. The node IP (`192.168.49.2`) belongs to an internal Docker network bridge (`docker0`) that the host OS kernel cannot route directly to.

**Workaround Commands & Verification:**
```bash
# 1. Direct curl failure demonstration
NODE_IP=$(minikube ip)
curl --connect-timeout 2 -s http://${NODE_IP}:30080 || echo "Connection Timed Out!"

# 2. Dynamic Port-Forward Workaround
minikube service web-service-nodeport --url
# Outputs dynamic localhost proxy URL: http://127.0.0.1:54321
curl -I http://127.0.0.1:54321
```

**Screenshot:**
![Docker Driver Gotcha](./screenshots/12-docker-driver-gotcha.png)
