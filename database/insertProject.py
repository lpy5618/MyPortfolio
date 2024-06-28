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

# Connect to MongoDB
try:
    client = MongoClient(MONGO_URI)
    db = client['myPortfolio']  # Replace 'myPortfolio' with your database name
    collection = db['projects']  # Replace 'projects' with your collection name

    # Define the data to be inserted
    data = {
        'id': 7,
        'title': 'Project Title',
        'description': 'Project Description',
        'imgUrl': 'https://example.com/image.jpg',
        'summary': 'Project Summary',
        'techStack': ['Python', 'MongoDB'],
        'outcome': 'Project Outcome',
        'conclusion': 'Project Conclusion',
        'demoImages': ['https://example.com/demo1.jpg', 'https://example.com/demo2.jpg']
    }

    # Insert the data into the collection
    result = collection.insert_one(data)
    print(f"Data inserted with id: {result.inserted_id}")

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    # Close the MongoDB connection
    client.close()
