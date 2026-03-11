#!/bin/bash
export PGPASSWORD=bluecratepass
HOST="136.114.139.164"
USER="bluecrate"
DB="bluecrate_db"
CSV_FILE="/home/harshala/BlueCrateFoods/infra/cloud/products_seed.csv"

echo "⏳ Seeding products to $DB (Single Session)..."

# Consolidate all commands into one psql call
psql -h $HOST -U $USER -d $DB <<EOF
-- 1. Clear existing table
DELETE FROM product;

-- 2. Create temporary table
CREATE TEMP TABLE temp_product (
    id_str TEXT, name TEXT, storage TEXT, category TEXT, sub_category TEXT,
    tags_str TEXT, size TEXT, weight TEXT, unit_price TEXT, unit_pack TEXT, pack_pricing TEXT
);

-- 3. Copy CSV (using \copy since it's a client-side file)
\copy temp_product FROM '$CSV_FILE' WITH (FORMAT csv, HEADER true);

-- 4. Insert into real table
INSERT INTO product (
    name, description, image, category, "basePrice", rating, reviews,
    time, difficulty, servings, ingredients, steps, nutrition,
    utensils, "userReviews", "bulkTiers", tags, "spiceLevel",
    unit, "authorName", status, "isApproved", "createdAt", "updatedAt"
)
SELECT 
    CASE WHEN size != '-' AND size != '' THEN name || ' - ' || size ELSE name END,
    category || ' | ' || sub_category || ' | Weight: ' || weight || ' | Pack Size: ' || unit_pack,
    'https://storage.googleapis.com/bluecrate-assets/placeholders/coming-soon.jpg',
    CASE 
        WHEN LOWER(tags_str) LIKE '%fresh meat%' THEN 'meat'
        WHEN LOWER(tags_str) LIKE '%5 min%' THEN '5min'
        WHEN LOWER(tags_str) LIKE '%10 min%' THEN '10min'
        WHEN LOWER(tags_str) LIKE '%dessert%' THEN 'frozen'
        ELSE 'frozen'
    END,
    COALESCE(NULLIF(pack_pricing, '')::FLOAT, 0),
    4.5, 0,
    CASE WHEN LOWER(tags_str) LIKE '%5 min%' THEN '5 min' ELSE '10 min' END,
    'Easy', 1, '[]'::jsonb, '[]'::jsonb, '{"calories": 0, "protein": 0, "carbs": 0, "fat": 0}'::jsonb,
    '[]'::jsonb, '[]'::jsonb, 
    json_build_array(json_build_object('quantity', unit_pack, 'price', COALESCE(NULLIF(pack_pricing, '')::FLOAT, 0)))::jsonb,
    json_build_array(storage, category, sub_category)::jsonb,
    0, unit_pack, 'BlueCrate Admin', 'approved', true, NOW(), NOW()
FROM temp_product;

-- 5. Show count
SELECT count(*) FROM product;
EOF

echo "✅ Seeding complete!"
