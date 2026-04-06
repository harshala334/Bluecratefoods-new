#!/bin/bash

# GCP Project Configuration
PROJECT_ID="bluecratefoods-491614"
REGION="us-central1"
REPO_NAME="bluecrate"
DB_HOST="34.171.201.34"
DB_USER="bluecrate"
DB_PASS="bluecratepass"

echo "🚀 Starting BlueCrateFoods Cloud Migration..."

# 1. Enable APIs
echo "🔧 Ensuring Google Cloud APIs are enabled..."
gcloud services enable run.googleapis.com \
                       sqladmin.googleapis.com \
                       cloudbuild.googleapis.com \
                       artifactregistry.googleapis.com \
                       --project $PROJECT_ID

sleep 5

# 2. Identify Services to Deploy
# If arguments are provided, use them. Otherwise, deploy all.
if [ $# -gt 0 ]; then
    services=("$@")
else
    services=("api-gateway" "auth-service" "user-service" "order-service" "store-service" "payment-service" "delivery-service" "tracking-service" "notification-service")
fi

echo "🚀 Deploying services: ${services[*]}"

for service in "${services[@]}"; do
    echo "📦 Building and Deploying $service..."
    
    # Image path in Artifact Registry
    IMAGE_PATH="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$service"
    
    # Build image using Cloud Build (Assuming script is run from project root or infra/cloud)
    BUILD_PATH="./backend/$service"
    if [ ! -d "$BUILD_PATH" ]; then
        BUILD_PATH="../../backend/$service"
    fi

    # Determine DB_NAME
    case $service in
        "api-gateway") DB_NAME="bluecrate_db" ;;
        "auth-service") DB_NAME="auth_service_db" ;;
        "user-service") DB_NAME="user_service_db" ;;
        "order-service") DB_NAME="order_service_db" ;;
        "store-service") DB_NAME="store_service_db" ;;
        "payment-service") DB_NAME="payment_service_db" ;;
        "delivery-service") DB_NAME="delivery_service_db" ;;
        "tracking-service") DB_NAME="tracking_service_db" ;;
        "notification-service") DB_NAME="notification_service_db" ;;
        *) DB_NAME="bluecrate_db" ;;
    esac

    # Build image
    gcloud builds submit --tag $IMAGE_PATH "$BUILD_PATH" --project $PROJECT_ID

    # Service-specific environment variables
    EXTRA_ENV=""
    if [ "$service" == "api-gateway" ]; then
        MAPS_KEY="${GOOGLE_MAPS_API_KEY}"
        EXTRA_ENV=",GOOGLE_MAPS_API_KEY=$MAPS_KEY,AUTH_SERVICE_URL=https://auth-service-920625255147.us-central1.run.app,ORDER_SERVICE_URL=https://order-service-e7zjf3b6pq-uc.a.run.app,USER_SERVICE_URL=https://user-service-e7zjf3b6pq-uc.a.run.app,STORE_SERVICE_URL=https://store-service-e7zjf3b6pq-uc.a.run.app"
    fi

    if [ "$service" == "auth-service" ]; then
        EXTRA_ENV=",JWT_SECRET=change_me,ADMIN_EMAIL=admin@gmail.com,ADMIN_PASSWORD=Bluecratefoods@2025,MSG91_AUTH_KEY=${MSG91_AUTH_KEY},MSG91_OTP_TEMPLATE_ID=${MSG91_OTP_TEMPLATE_ID}"
    fi
    
    # Deploy to Cloud Run
    gcloud run deploy $service \
        --image $IMAGE_PATH \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --project $PROJECT_ID \
        --set-env-vars="NODE_ENV=production,DB_HOST=$DB_HOST,DB_USER=$DB_USER,DB_PASS=$DB_PASS,DB_NAME=$DB_NAME,DB_PORT=5432$EXTRA_ENV"
done

echo "✅ Deployment for target services complete!"
