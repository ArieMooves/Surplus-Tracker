import psycopg2
import random

DB_PARAMS = {
    "dbname": "msu_surplus_db",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": "5432" 
}

# MSU Departments
DEPARTMENTS = [
    "Bookstore", "Mathematics", "Geosciences", "Career Management Center", 
    "Clark Student Center", "Counseling Center", "Dean of Students", 
    "Nursing", "Disability Services", "Global Education Office", 
    "Health Services", "Post Office", "Recreational Sports & Wellness Center", 
    "Residence Life and Housing", "Student Rights and Responsibilities", 
    "Student Leadership and Involvement", "Student Engagement Center", 
    "Computer Science", "Title IX", "University Police"
]

ITEM_POOL = {
    "Dell Latitude 5420 Laptop": (
        "High-performance workstation with Core i7. Previously assigned to staff in {dept}. "
        "Condition: Good; slight cosmetic wear on chassis. Replaced due to standard 4-year refresh cycle."
    ),
    "Herman Miller Aeron Chair": (
        "Ergonomic office seating, size B. Surplus from {dept} office renovation. "
        "Condition: Fair; mesh remains intact but tensioner requires adjustment. Unit replaced by new ergonomic standard."
    ),
    "Epson Home Cinema 4010": (
        "4K Projector unit. Replaced during the {dept} facility upgrade. "
        "Condition: Poor; lamp hours exceed recommended limit. Decommissioned in favor of high-lumen laser units."
    ),
    "Apple iPad Air (5th Gen)": (
        "64GB Wi-Fi Tablet. Used for student check-ins within {dept}. "
        "Condition: New; device was a spare unit never deployed. Surplus due to over-provisioning for grant project."
    ),
    "AmScope B120C Microscope": (
        "Siedentopf Binocular Compound optics. Specialized equipment from {dept}. "
        "Condition: Good; lenses calibrated recently. Surplus due to department laboratory consolidation."
    ),
    "Lenovo ThinkPad X1 Carbon": (
        "Rugged enterprise laptop. Primary portable unit for {dept} field operations. "
        "Condition: Fair; minor screen pressure marks. Replaced following department-wide hardware transition."
    ),
    "Steelcase Leap V2 Chair": (
        "Premium ergonomic task chair. Heavy-duty frame, sourced from {dept} admin suite. "
        "Condition: Good; fabric professionally cleaned. Removed from inventory following staff relocation."
    ),
    "HP LaserJet Pro M404n": (
        "Enterprise monochrome printer. High-volume unit decommissioned by {dept}. "
        "Condition: Poor; fuser assembly requires maintenance. Replaced by centralized multi-function printing solution."
    )
}

CONDITIONS = ["New", "Good", "Fair", "Poor"]
STATUSES = ["active", "surplus", "disposed"]

def seed_data():
    conn = None
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        print("Cleaning old database entries...")
        # CASCADE ensures all linked tables are cleared
        cur.execute("TRUNCATE TABLE departments, users, assets RESTART IDENTITY CASCADE;")

        print("1. Seeding MSU Departments...")
        dept_id_map = {}
        for dept_name in DEPARTMENTS:
            cur.execute(
                "INSERT INTO departments (department_name) VALUES (%s) RETURNING department_id",
                (dept_name,)
            )
            dept_id_map[dept_name] = cur.fetchone()[0]

        print(f"2. Seeding Admin Profile: Marcus Mustang (M10357379)...")
        # Creating Marcus in the database so his ID actually exists
        cur.execute(
            """
            INSERT INTO users (full_name, mustang_id, email, role, department_id)
            VALUES (%s, %s, %s, %s, %s)
            """,
            ("Marcus Mustang", "M10357379", "marcus.mustang@msutexas.edu", "SUPER_ADMIN", dept_id_map["Computer Science"])
        )

        print("3. Seeding 25 AI-optimized assets...")
        items_list = list(ITEM_POOL.keys())
        unique_tags = random.sample(range(40000, 59999), 25)

        for i in range(25):
            asset_tag = str(unique_tags[i])
            dept_name = random.choice(DEPARTMENTS)
            item_name = random.choice(items_list)
            
            description = ITEM_POOL[item_name].format(dept=dept_name)
            condition = random.choice(CONDITIONS)
            status = random.choices(STATUSES, weights=[10, 80, 10], k=1)[0]
            
            # Link to the department_id 
            cur.execute(
                """
                INSERT INTO assets (asset_tag, item_name, description, location, condition, current_status, department_id) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (asset_tag, item_name, description, dept_name, condition, status, dept_id_map[dept_name])
            )

        conn.commit()
        print("\nSUCCESS: MSU Surplus Database is now fully populated.")
        print(f"Admin M10357379 is active and {len(unique_tags)} assets are ready for management.")
        
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn is not None:
            cur.close()
            conn.close()

if __name__ == "__main__":
    seed_data()
