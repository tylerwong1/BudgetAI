from pymongo import MongoClient

# Initialize MongoDB client
client = MongoClient("mongodb://localhost:27017/")
db = client["user_login_system"]
