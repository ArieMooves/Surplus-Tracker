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

# Mapping items to professional MSU-style descriptions
item_details = {
    "Dell Latitude Laptop": "Standard faculty issue. Core i7, 16GB RAM. Includes power adapter.",
    "Herman Miller Chair": "Aeron model, Size B. Ergonomic office seating with adjustable lumbar support.",
    "Epson Projector": "High-definition ceiling mount unit. Fully functional, pulled from classroom upgrade.",
    "Apple iPad Air": "64GB, Space Gray. Previously used for student check-in services.",
    "Lab Microscope": "Binocular compound microscope with LED illumination. Lab-grade optics.",
    "Lenovo ThinkPad": "Enterprise workstation. Rugged chassis, 512GB SSD. Minor cosmetic wear.",
    "Steelcase Desk": "L-shaped office desk, walnut finish. Heavy-duty steel frame.",
    "HP LaserJet Printer": "High-volume monochrome office printer. Network ready, includes partial toner."
}

conditions = ["New", "Good", "Fair", "Poor"]
statuses = ["active", "surplus", "disposed"]

def seed_data():
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        print("Cleaning old database entries...")
        cur.execute("TRUNCATE TABLE assets RESTART IDENTITY CASCADE;")

        print("Seeding MSU Surplus Database with 5-digit tags & descriptions...")

        items_list = list(item_details.keys())

        for _ in range(25):
            # Generates a number between 40000 and 59999
            tag_number = random.randint(40000, 59999)
            asset_tag = str(tag_number) 
            
            # Select item and its corresponding description
            item_name = random.choice(items_list)
            description = item_details[item_name]
            
            condition = random.choice(conditions)
            status = random.choice(statuses)
            
            # Insert including the description column
            cur.execute(
                """
                INSERT INTO assets (asset_tag, item_name, description, condition, current_status) 
                VALUES (%s, %s, %s, %s, %s)
                """,
                (asset_tag, item_name, description, condition, status)
            )

        conn.commit()
        cur.close()
        conn.close()
        print("Successfully added 25 professional pseudo-assets!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")

if __name__ == "__main__":
    seed_data()
