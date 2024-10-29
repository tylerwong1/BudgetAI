import io
import os
import unittest

from app import app
from database.db import get_budgetai_db


class UploadTest(unittest.TestCase):
    def setUp(self):
        """
        Set up a test client for the Flask app with a secret key and testing mode.
        Establish an application context for testing.
        Create sample transaction data and csv for testing.
        """
        self.app = app.test_client()
        self.app.secret_key = "test_secret_key"
        self.app.testing = True
        self.app_context = app.app_context()
        self.app_context.push()

        # Define sample transaction data
        self.sample_transaction_data = {
            "transaction_date": "09/30/2024",
            "post_date": "10/01/2024",
            "description": "DOLLAR TREE",
            "category": "Shopping",
            "type": "Sale",
            "amount": -1.29,
            "memo": "",
        }

        # Prepare the sample CSV content
        self.sample_csv = (
            "Transaction Date,Post Date,Description,Category,Type,Amount,Memo\n"
            f"{self.sample_transaction_data['transaction_date']},"
            f"{self.sample_transaction_data['post_date']},"
            f"{self.sample_transaction_data['description']},"
            f"{self.sample_transaction_data['category']},"
            f"{self.sample_transaction_data['type']},"
            f"{self.sample_transaction_data['amount']},"
            f"{self.sample_transaction_data['memo']}\n"
        )

    def tearDown(self):
        """
        Clean up the app context after each test to avoid side effects.
        """
        self.app_context.pop()

    @classmethod
    def setUpClass(cls):
        """
        Set up the test environment and database connection before any tests run.
        Configures the application to use a test database.
        """
        os.environ["FLASK_ENV"] = "test"  # Use the test environment
        cls.db, cls.client = get_budgetai_db()

    @classmethod
    def tearDownClass(cls):
        """
        Clean up the database by deleting all users after all tests have run.
        Close the database client connection.
        """
        cls.db["transactions"].delete_many({})
        cls.db["users"].delete_many({})
        cls.client.close()

    def test_upload(self):
        # Create and login new user
        self.app.post(
            "/user/signup",
            json={
                "name": "Test User",
                "email": "testuser@example.com",
                "password": "password123",
            },
        )
        self.app.post(
            "/user/login", json={"email": "test@example.com", "password": "password123"}
        )

        # Create a BytesIO object from the sample CSV content
        file_stream = io.BytesIO(self.sample_csv.encode("utf-8"))

        # Prepare the data for the POST request
        # Use a tuple to specify filename
        data = {"file": (file_stream, "sample.csv")}

        # Send a POST request to the /upload endpoint
        response = self.app.post("/upload/csv", data=data)

        # Check if the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Check if the message in the JSON response matches the expected
        # success message
        self.assertEqual(
            response.json.get(
                "message"), "File uploaded and processed successfully"
        )

        # Verify if the transaction was inserted into the database
        inserted_user = self.db["users"].find_one(
            {"email": "testuser@example.com"})
        inserted_transaction = self.db["transactions"].find_one(
            {"user_id": inserted_user["_id"]}
        )

        # Verify inserted transaction values
        self.assertEqual(
            inserted_transaction["transaction_date"],
            self.sample_transaction_data["transaction_date"],
        )
        self.assertEqual(
            inserted_transaction["description"],
            self.sample_transaction_data["description"],
        )
        self.assertEqual(
            inserted_transaction["category"], self.sample_transaction_data["category"]
        )


if __name__ == "__main__":
    unittest.main()
