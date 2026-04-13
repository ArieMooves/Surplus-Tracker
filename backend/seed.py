import psycopg2
import random

# Database connection details 
DB_PARAMS = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": "5432" 
}

# MSU Departments
departments = [
    "Bookstore", "Mathematics", "Geosciences", "Career Management Center", 
    "Clark Student Center", "Counseling Center", "Dean of Students", 
    "Nursing", "Disability Services", "Global Education Office", 
    "Health Services", "Post Office", "Recreational Sports & Wellness Center", 
    "Residence Life and Housing", "Student Rights and Responsibilities", 
    "Student Leadership and Involvement", "Student Engagement Center", 
    "Computer Science", "Title IX", "University Police"
]

# Item pool with specific model numbers for better AI price matching
item_pool = {
    "Dell Latitude 5420 Laptop": "High-performance workstation with Core i7. Previously assigned to staff in {dept}.",
    "Herman Miller Aeron Chair": "Ergonomic office seating, size B. Surplus from {dept} office renovation.",
    "Epson Home Cinema 4010": "4K Projector unit. Replaced during the {dept} facility upgrade.",
    "Apple iPad Air (5th Gen)": "64GB Wi-Fi Tablet. Used for student check-ins within {dept}.",
    "AmScope B120C Microscope": "Siedentopf Binocular Compound optics. Specialized equipment from {dept}.",
    "Lenovo ThinkPad X1 Carbon": "Rugged enterprise laptop. Primary portable unit for {dept} field operations.",
    "Steelcase Leap V2 Chair": "Premium ergonomic task chair. Heavy-duty frame, sourced from {dept} admin suite.",
    "HP LaserJet Pro M404n": "Enterprise monochrome printer. High-volume unit decommissioned by {dept}."
}

conditions = ["New", "Good", "Fair", "Poor"]
statuses = ["active", "surplus", "disposed"]

def seed_data():
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        print("Cleaning old database entries...")
        
        cur.execute("TRUNCATE TABLE assets RESTART IDENTITY CASCADE;")

        print("Seeding MSU Surplus Database with Realistic AI-Ready Data...")

        items_list = list(item_pool.keys())

        for _ in range(25):
            # Asset Tag: XXXXX format looks very professional
            tag_number = random.randint(40000, 59999)
            asset_tag = f"{tag_number}" 
            
            # Select Department
            dept = random.choice(departments)
            
            # Select Item and Inject Department into Description
            item_name = random.choice(items_list)
            description = item_pool[item_name].format(dept=dept)
            
            condition = random.choice(conditions)
            
            status = random.choices(statuses, weights=[10, 80, 10], k=1)[0]
            
            cur.execute(
                """
                INSERT INTO assets (asset_tag, item_name, description, location, condition, current_status) 
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (asset_tag, item_name, description, dept, condition, status)
            )

        conn.commit()
        cur.close()
        conn.close()
        print(f"Successfully added 25 AI-optimized assets across {len(departments)} MSU departments!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")

if __name__ == "__main__":
    seed_data()
