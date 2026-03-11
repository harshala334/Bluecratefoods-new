# 🗄️ BlueCrateFoods Database Access Guide

This guide details how to access and manage the production PostgreSQL databases on Google Cloud SQL.

## 🔑 Connection Credentials

| Property | Value |
| :--- | :--- |
| **Host (Public IP)** | `136.114.139.164` |
| **Port** | `5432` |
| **User** | `bluecrate` |
| **Password** | `bluecratepass` |

### 📂 Microservice Databases
Each microservice uses its own dedicated database:
- `auth_service_db`
- `user_service_db`
- `order_service_db`
- `store_service_db`
- `bluecrate_db` (API Gateway / Recipes)
- `delivery_service_db`
- `tracking_service_db`
- `notification_service_db`
- `payment_service_db`

---

## 🛠️ Access Methods

### 1. Web Interface (Cloud SQL Studio)
The easiest way to browse data and run queries without any setup.
1. Go to [Cloud SQL Instances](https://console.cloud.google.com/sql/instances/bluecrate-postgres-instance/overview?project=bluecratefoods).
2. Click **Cloud SQL Studio** in the left sidebar.
3. Authenticate using the credentials above.

### 2. Google Cloud Shell
Quick terminal access directly from the GCP console.
```bash
gcloud sql connect bluecrate-postgres-instance --user=bluecrate --database=bluecrate_db
```

### 3. Local Desktop (DBeaver, TablePlus, pgAdmin)
To connect from your computer, use the **Cloud SQL Auth Proxy** (Safest):
1. [Download the Proxy](https://cloud.google.com/sql/docs/postgres/sql-proxy).
2. Start the proxy:
   ```bash
   ./cloud-sql-proxy bluecratefoods:us-central1:bluecrate-postgres-instance
   ```
3. Connect your tool to `localhost:5432`.

### 4. Ad-hoc CLI (Current Terminal)
If you have `psql` installed, you can run commands directly:
```bash
# Example: Fetch all users
PGPASSWORD=bluecratepass psql -h 136.114.139.164 -U bluecrate -d auth_service_db -c "SELECT * FROM users;"
```

---

## ⚠️ Important Safety Tips
> [!WARNING]
> **Production Data**: You are connecting to the live production database. Always run a `SELECT` query before a `DELETE` or `UPDATE` to verify your target records.
> [!TIP]
> Use the [fetch_db_summary.sh](file:///home/harshala/BlueCrateFoods/infra/cloud/fetch_db_summary.sh) script to quickly see counts and sample data across all 9 databases.
