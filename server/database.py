from pymongo import MongoClient
import os

def get_login_system_db():
    client = MongoClient("mongodb://localhost:27017/")
    environment = os.getenv('FLASK_ENV', 'production')  # Default to 'production' if not set
    if environment == 'test':
        db = client["test_user_login_system"]
    else:
        db = client["prod_user_login_system"]
    return db, client
