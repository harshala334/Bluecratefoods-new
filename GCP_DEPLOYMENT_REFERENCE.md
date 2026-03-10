# GCP Deployment Reference

This file contains critical information about the BlueCrateFoods GCP infrastructure.

## 🆔 Project Details
- **GCP Project ID**: `eatee-bdd54`
- **Primary Account**: `jayeshmahajan625@gmail.com`
- **Firebase Project**: Same as above (`eatee-bdd54`)

## 🌐 Live Environment
- **Website URL**: [bluecratefoods.com](https://bluecratefoods.com)
- **API URL**: [api.bluecratefoods.com](https://api.bluecratefoods.com)
- **Load Balancer IP**: `34.133.246.99`
- **Hosting Platform**: Google Kubernetes Engine (GKE) or Cloud Run (Docker containers)

## 🛠️ Manual Deployment Commands

Use these steps to push updates manually until CI/CD is configured:

### 1. Login & Set Project
```bash
gcloud auth login
gcloud config set project eatee-bdd54
gcloud auth configure-docker
```

### 2. Update a Service (Example: API Gateway)
```bash
# Build the new image
docker build -t gcr.io/eatee-bdd54/api-gateway ./backend/api-gateway

# Push to Google Container Registry
docker push gcr.io/eatee-bdd54/api-gateway

# Restart the deployment in Kubernetes
kubectl rollout restart deployment api-gateway -n bluecrate
```

## 📊 Useful Monitoring Commands
```bash
# Check all running services
kubectl get pods -n bluecrate

# View live logs for the API Gateway
kubectl logs -f deployment/api-gateway -n bluecrate
```
