import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Retrieve MongoDB connection string from environment variables
MONGO_URI = os.getenv('MONGO_URI')

# Check if the connection string is present
if not MONGO_URI:
    raise ValueError("No MongoDB URI found. Please set the MONGO_URI environment variable.")

def get_project_data():
    print("Enter project details:")

    project_id = int(input("ID: "))
    title = input("Title: ")
    description = input("Description: ")
    img_url = input("Image URL: ")
    summary = input("Summary: ")

    tech_stack = {}
    while True:
        tech_category = input("Enter a tech stack category (or 'done' to finish): ")
        if tech_category.lower() == 'done':
            break
        tech_items = input(f"Enter technologies for {tech_category} (comma-separated): ").split(',')
        tech_stack[tech_category] = [item.strip() for item in tech_items]

    outcomes = []
    while True:
        outcome = input("Enter an outcome (or 'done' to finish): ")
        if outcome.lower() == 'done':
            break
        outcomes.append(outcome)

    demo_images = input("Enter demo image URLs (comma-separated): ").split(',')
    demo_images = [img.strip() for img in demo_images]

    conclusion = input("Conclusion: ")

    data = {
        'id': project_id,
        'title': title,
        'description': description,
        'imgUrl': img_url,
        'summary': summary,
        'techStack': tech_stack,
        'outcome': outcomes,
        'demoImages': demo_images,
        'conclusion': conclusion
    }

    return data

def main():
    # Connect to MongoDB
    try:
        client = MongoClient(MONGO_URI)
        db = client['myPortfolio']  # Replace 'myPortfolio' with your database name
        collection = db['projects']  # Replace 'projects' with your collection name

        while True:
            project_data = get_project_data()

            # Insert the data into the collection
            result = collection.insert_one(project_data)
            print(f"Data inserted with id: {result.inserted_id}")

            another = input("Do you want to add another project? (yes/no): ")
            if another.lower() != 'yes':
                break

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        # Close the MongoDB connection
        client.close()

if __name__ == "__main__":
    main()
