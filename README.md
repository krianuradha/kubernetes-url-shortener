# Kubernetes URL Shortener

A minimal URL shortener API built with **Node.js + Express**, containerized with **Docker**, and deployed on a **local Kubernetes cluster**. This project was built purely for learning — to understand the journey from raw code to a running, self-healing, scalable Kubernetes application.

---

## Architecture

```
Client (curl / browser)
        ↓
Kubernetes Service  (NodePort → port 30080)
        ↓
Kubernetes Deployment  (manages the Pods)
        ↓
Pods  (1–3 running instances)
        ↓
Node.js + Express  (port 3000, in-memory store)
```

---

## Features

- ✅ Create short URLs via `POST /shorten`
- ✅ Redirect via `GET /:shortId`
- ✅ Deployed as a Kubernetes **Deployment**
- ✅ Exposed via a Kubernetes **Service** (NodePort)
- ✅ Scalable: run multiple **replicas**
- ✅ **Self-healing**: Kubernetes restarts crashed Pods automatically
- ✅ **Rolling updates**: deploy new versions with zero downtime

> **Note:** URLs are stored in memory. They are lost when the app restarts. This is intentional for a learning project.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express | HTTP API framework |
| Docker | Containerization |
| Kubernetes | Orchestration (local) |
| kubectl | CLI to manage Kubernetes |

---

## Run Locally (Node.js only, no Kubernetes)

```bash
cd app
npm install
node server.js
```

Test:
```bash
curl http://localhost:3000/
curl -X POST http://localhost:3000/shorten -H "Content-Type: application/json" -d '{"url":"https://google.com"}'
curl -L http://localhost:3000/<shortId>
```

---

## Run in Kubernetes

### 1. Build the Docker image

```bash
# From the project root
docker build -t url-shortener:v1 ./app
```

### 2. Deploy to Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### 3. Verify everything is running

```bash
kubectl get pods
kubectl get deployments
kubectl get services
```

### 4. Access the API

**Docker Desktop Kubernetes:**
```bash
curl http://localhost:30080/
```

**Minikube:**
```bash
minikube service url-shortener
# OR
curl http://$(minikube ip):30080/
```

---

## Kubernetes Commands Reference

```bash
# See all running Pods
kubectl get pods

# See Deployments
kubectl get deployments

# See Services
kubectl get services

# View logs from a Pod
kubectl logs <pod-name>

# Inspect a Pod (great for debugging)
kubectl describe pod <pod-name>

# Scale to 3 replicas
kubectl scale deployment url-shortener --replicas=3

# Check rollout status after an update
kubectl rollout status deployment/url-shortener

# Delete a Pod (Kubernetes will recreate it — self-healing demo)
kubectl delete pod <pod-name>

# Apply updated config
kubectl apply -f k8s/deployment.yaml
```

---

## Day-by-Day Build

| Day | Goal |
|---|---|
| Day 1 | Build the Express API, test locally |
| Day 2 | Containerize with Docker, deploy to Kubernetes |
| Day 3 | Scale to 3 replicas, demo self-healing & rolling updates |

---

## What I Learned

| Concept | What it means in this project |
|---|---|
| **Pod** | One running instance of the URL shortener container |
| **Deployment** | Ensures the right number of Pods are always running |
| **Service** | Stable entry point that routes traffic to any healthy Pod |
| **Replica** | Multiple Pods running the same app for redundancy |
| **Self-healing** | If a Pod dies, the Deployment creates a new one automatically |
| **Rolling update** | New version is deployed gradually with no downtime |
| **imagePullPolicy: Never** | Use the locally built Docker image instead of pulling from a registry |
| **NodePort** | Exposes the Service on your local machine for testing |

---

## Resume Bullets

- Built and containerized a lightweight URL shortener API using Node.js and Express, then deployed it on a local Kubernetes cluster using Deployments and Services.
- Configured multiple replicas and demonstrated Kubernetes self-healing and rolling updates by simulating pod failure and deploying an updated container image.
