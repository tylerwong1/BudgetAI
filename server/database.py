import os

from pymongo import MongoClient


def get_login_system_db():
    client = MongoClient("mongodb://localhost:27017/")
    environment = os.getenv(
        "FLASK_ENV", "production"
    )  # Default to 'production' if not set
    if environment == "test":
        db = client["test_budgetai_db"]
    else:
        db = client["prod_budgetai_db"]
    return db, client
