# BlueCrateFoods Quickstart Guide (GCP)

This guide helps you set up and run the BlueCrateFoods project using Google Cloud Platform (GCP).

## 1️⃣ Prerequisites Setup

Ensure you have the following tools installed:
- [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install)
- [Docker](https://docs.docker.com/get-docker/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Node.js 20+](https://nodejs.org/)

## 2️⃣ Authentication

Login to your GCP account (the one connected to project `eatee-bdd54`):
```bash
gcloud auth login
gcloud config set project eatee-bdd54
gcloud auth configure-docker
```

## 3️⃣ Local Development

### Backend Services
Navigate to each service in `backend/` and run:
```bash
npm install
npm run start:dev
```

### Web Frontend
```bash
cd web/nextjs-client
npm install
npm run dev
```

### Mobile App
```bash
cd mobile/user-app
npm install
npx expo start
```

## 4️⃣ Manual Deployment to GCP

To update your live services without CI/CD:

1. **Build and Push Image**:
   ```bash
   docker build -t gcr.io/eatee-bdd54/api-gateway ./backend/api-gateway
   docker push gcr.io/eatee-bdd54/api-gateway
   ```

2. **Deploy Update**:
   ```bash
   kubectl rollout restart deployment api-gateway -n bluecrate
   ```

## 📊 Monitoring

```bash
# Check running pods
kubectl get pods -n bluecrate

# View logs for a service
kubectl logs -f deployment/api-gateway -n bluecrate
```

---
For more detailed information, refer to the [walkthrough.md](file:///home/harshala/.gemini/antigravity/brain/30414f3e-d48a-4986-a852-88dba2d6d32b/walkthrough.md).
