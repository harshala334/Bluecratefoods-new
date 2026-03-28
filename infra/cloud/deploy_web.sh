#!/bin/bash
# 1. Project Config
PROJECT_ID="bluecratefoods-491614"
REGION="us-central1"
IMAGE_NAME="us-central1-docker.pkg.dev/$PROJECT_ID/bluecrate/web-client"

echo "🌐 Deploying BlueCrate Web Frontend..."

# 2. Build and Push
gcloud builds submit ./web/nextjs-client \
  --tag $IMAGE_NAME \
  --project $PROJECT_ID

# 3. Deploy to Cloud Run
gcloud run deploy web-client \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://api-gateway-e7zjf3b6pq-uc.a.run.app"

echo "✅ Web Frontend Deployed!"
gcloud run services describe web-client --project $PROJECT_ID --region $REGION --format="value(status.url)"
