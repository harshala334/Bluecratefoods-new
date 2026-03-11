# Database Migration Guide: Local to Cloud SQL

Follow these steps to move your local PostgreSQL data to Google Cloud SQL for the BlueCrateFoods production environment.

## 1. Create a Cloud SQL Instance
Run this command to create a small instance (cost-optimized):
```bash
gcloud sql instances create bluecrate-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=bluecratepass
```

## 2. Export Local Data
Using `pg_dump`, export your local database to a file. Do this for each core database:
```bash
# Export Auth service data
pg_dump -h localhost -p 5433 -U bluecrate -t auth_service_db > auth_backup.sql
```

## 3. Import to Cloud SQL
### 🅰️ Using Cloud Storage (Recommended for large datasets)
1. Upload `auth_backup.sql` to your GCP bucket.
2. Run the import command:
```bash
gcloud sql import sql bluecrate-db gs://your-bucket/auth_backup.sql \
    --database=auth_service_db
```

### 🅱️ Using psql (Direct)
```bash
psql -h [CLOUD_SQL_IP] -U bluecrate -d auth_service_db < auth_backup.sql
```

## 4. Connection Configuration for Microservices
Once migrated, update the `DB_HOST` in your environment variables for each service in the `deploy_cloud_run.sh` script to point to the Private/Public IP of your Cloud SQL instance.

> [!TIP]
> Use **Cloud SQL Auth Proxy** for the most secure connection from your local machine to the production database.
