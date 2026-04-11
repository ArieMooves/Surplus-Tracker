import psycopg2
from faker import Faker
import random

# Database connection details 
DB_PARAMS = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": "5432" 
}

fake = Faker()
items = ["Dell Latitude Laptop", "Herman Miller Chair", "Epson Projector", "Apple iPad Air", "Lab Microscope"]
conditions = ["New", "Good", "Fair", "Poor"]
statuses = ["active", "surplus", "disposed"]

def seed_data():
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()

    print("🌱 Seeding MSU Surplus Database...")

    for _ in range(25):
        asset_tag = f"MSU-{random.randint(10000, 99999)}"
        item_name = random.choice(items)
        condition = random.choice(conditions)
        status = random.choice(statuses)
        
        cur.execute(
            "INSERT INTO assets (asset_tag, item_name, condition, current_status) VALUES (%s, %s, %s, %s)",
            (asset_tag, item_name, condition, status)
        )

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Successfully added 25 pseudo-assets!")

if __name__ == "__main__":
    seed_data()
