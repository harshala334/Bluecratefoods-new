#!/bin/bash
export PGPASSWORD=bluecratepass
HOST="136.114.139.164"
USER="bluecrate"
DATABASES=("auth_service_db" "user_service_db" "order_service_db" "store_service_db" "bluecrate_db" "delivery_service_db" "tracking_service_db" "notification_service_db" "payment_service_db")

for DB in "${DATABASES[@]}"; do
    echo "--- Database: $DB ---"
    TABLES=$(psql -h $HOST -U $USER -d $DB -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    for TABLE in $TABLES; do
        COUNT=$(psql -h $HOST -U $USER -d $DB -t -c "SELECT count(*) FROM $TABLE;")
        echo "Table: $TABLE | Count: $COUNT"
        if [ "$COUNT" -gt 0 ]; then
             echo "Sample Records:"
             psql -h $HOST -U $USER -d $DB -c "SELECT * FROM $TABLE LIMIT 3;"
        fi
    done
    echo ""
done
