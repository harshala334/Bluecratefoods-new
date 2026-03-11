# Cloud Environment Variables Reference

Ensure these variables are set in your **GCP Cloud Run** dashboard or via the `gcloud` CLI for each service.

## 🔑 Shared Variables
- `NODE_ENV`: `production`
- `DB_PORT`: `5432` (Default for Cloud SQL)
- `DB_USER`: `bluecrate`
- `DB_PASS`: `bluecratepass`
- `KAFKA_BROKERS`: `your-kafka-broker:9092` (or AWS Managed Kafka URL)
- `REDIS_URL`: `redis://[IP]:6379`

---

## 🛡️ auth-service
- `DB_NAME`: `auth_service_db`
- `JWT_SECRET`: `[GENERATE_SECURE_KEY]`
- `FIREBASE_PROJECT_ID`: `eatee-bdd54`

## 🛒 order-service
- `DB_NAME`: `order_service_db`

## 🏪 store-service
- `DB_NAME`: `store_service_db`

## 👤 user-service
- `DB_NAME`: `user_service_db`

## 🌐 api-gateway
- `AUTH_SERVICE_URL`: `https://auth-service-[RANDOM].a.run.app`
- `ORDER_SERVICE_URL`: `https://order-service-[RANDOM].a.run.app`
- `STORE_SERVICE_URL`: `https://store-service-[RANDOM].a.run.app`

---

> [!IMPORTANT]
> **Internal Communication**: In Cloud Run, services communicate over public URLs unless you set up a VPC Connector. For an MVP, using the `.a.run.app` URLs is fine, but for production, consider a **Shared VPC** to keep traffic internal.
