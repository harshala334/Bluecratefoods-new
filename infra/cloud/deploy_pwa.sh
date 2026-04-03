#!/bin/bash
set -e

# Configuration
PROJECT_ID="bluecratefoods-491614"
REGION="us-central1"
SERVICE_NAME="pwa-client"
IMAGE_NAME="$REGION-docker.pkg.dev/$PROJECT_ID/bluecrate/$SERVICE_NAME"
CWD=$(pwd)

echo "🏗️ Starting BlueCrate Foods PWA Deployment..."

# 1. Build and Push using Cloud Build
echo "📦 Building PWA Container using Cloud Build..."
# Move to the app directory temporarily
cd mobile/user-app
gcloud builds submit --tag $IMAGE_NAME --project $PROJECT_ID .

# 2. Deploy to Cloud Run
echo "🚀 Deploying $SERVICE_NAME to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID \
  --memory 512Mi \
  --cpu 1 \
  --port 8080

# Return to initial directory
cd $CWD

echo "✅ PWA Deployment Complete!"
URL=$(gcloud run services describe $SERVICE_NAME --project $PROJECT_ID --region $REGION --format="value(status.url)")
echo "🌐 Your PWA is live at: $URL"
echo ""
echo "🔥 Next Step: Link your subdomain 'app.bluecratefoods.com' to this Cloud Run service in GCP Cloud DNS."
