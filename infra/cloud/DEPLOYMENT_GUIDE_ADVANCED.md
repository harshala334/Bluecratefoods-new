# 🚀 BlueCrateFoods Advanced Deployment Guide

This guide explains how to deploy specific parts of the system without redeploying everything.

## 1. Backend Microservices (Cloud Run)
I have updated the `deploy_cloud_run.sh` script to support **selective deployment**.

### Deploy All Services
```bash
bash infra/cloud/deploy_cloud_run.sh
```

### Deploy Specific Service(s)
You can now pass the service names as arguments:
```bash
# Example: Only update the API Gateway and Auth Service
bash infra/cloud/deploy_cloud_run.sh api-gateway auth-service
```
**Available services:** `api-gateway`, `auth-service`, `user-service`, `order-service`, `store-service`, `payment-service`, `delivery-service`, `tracking-service`, `notification-service`.

---

## 2. Web Frontend (Next.js)
The web app is located in `web/nextjs-client`. To deploy it to Cloud Run:

### Step 1: Build & Push Image
```bash
gcloud builds submit web/nextjs-client \
  --tag us-central1-docker.pkg.dev/bluecratefoods/bluecrate/web-client \
  --project bluecratefoods
```

### Step 2: Deploy to Cloud Run
```bash
gcloud run deploy web-client \
  --image us-central1-docker.pkg.dev/bluecratefoods/bluecrate/web-client \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --project bluecratefoods \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://api-gateway-441546178642.us-central1.run.app/api"
```

---

## 3. Mobile App (Android/iOS)
The mobile app uses **Expo**. Changes to the mobile code (like the `config.ts` update I just made) need an "OTA Update" or a new build.

### Publish an Update (Immediate / Over-the-Air)
This sends the new JS code to all users instantly without them needing to download a new APK/IPA.
```bash
cd mobile/user-app
eas update --branch production --message "Updated API URL to Cloud Run"
```

### Create a New Android Build (APK)
If you made changes to native modules or `app.json`:
```bash
cd mobile/user-app
eas build -p android --profile preview
```

---

## 💡 Summary Table

| Change Location | Recommendation | Command |
| :--- | :--- | :--- |
| **Backend Logic** | Selective Cloud Run update | `bash deploy_cloud_run.sh [service-name]` |
| **New Database Table** | No deploy needed | Just run SQL/Migrations |
| **Web UI/Text** | Web Client update | `gcloud builds submit ...` (See Section 2) |
| **Mobile UI/Text** | Expo OTA Update | `eas update` |
