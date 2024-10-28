import os
import unittest

from passlib.hash import pbkdf2_sha256

from app import app
from database import get_budgetai_db


class UserLoginTest(unittest.TestCase):
    """
    UserLoginTest is a unit test class that validates user authentication functionalities.
    It includes tests for user signup, login, logout, and handling existing users.
    """

    def setUp(self):
        """
        Set up a test client for the Flask app with a secret key and testing mode.
        Establish an application context for testing.
        """
        self.app = app.test_client()
        self.app.secret_key = "test_secret_key"
        self.app.testing = True
        self.app_context = app.app_context()
        self.app_context.push()

        # Define sample user data
        self.sample_user_data = {
            "name": "Test User",
            "email": "testuser@example.com",
            "password": "password123",
        }

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
        cls.db["users"].delete_many({})
        cls.client.close()

    def test_signup(self):
        """
        Test the user signup process.
        Validates successful signup with valid input and asserts that user data is correctly inserted into the database.
        Checks that the password is encrypted.
        """
        # Create new user
        response = self.app.post(
            "/user/signup",
            json=self.sample_user_data,
        )

        # Check if the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Verify inserted user data
        data = response.get_json()
        self.assertEqual(data["name"], "Test User")
        self.assertEqual(data["email"], "testuser@example.com")

        # Check if the user was inserted into the database
        inserted_user = self.db["users"].find_one({"email": "testuser@example.com"})
        self.assertIsNotNone(inserted_user)
        self.assertEqual(inserted_user["name"], self.sample_user_data["name"])

        # Check if password is encrypted
        self.assertNotEqual(inserted_user["password"], "password123")
        # Check if passwords match
        self.assertTrue(
            pbkdf2_sha256.verify(
                self.sample_user_data["password"], inserted_user["password"]
            )
        )

    def test_signup_existing_user(self):
        """
        Test the signup process for an existing user.
        Asserts that an attempt to sign up with an already used email address results in an error.
        """
        self.app.post(
            "/user/signup",
            json=self.sample_user_data,
        )
        response = self.app.post(
            "/user/signup",
            json={
                "name": "Another User",
                "email": "test@example.com",
                "password": "password456",
            },
        )
        self.assertEqual(response.status_code, 400)  # Expecting a 400 Bad Request
        self.assertIn("Email address already in use", response.get_json()["error"])

    def test_login(self):
        """
        Test the login process with valid credentials.
        Validates that a user can log in successfully and that the correct user information is returned.
        """
        self.app.post(
            "/user/signup",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "password": "password123",
            },
        )
        response = self.app.post(
            "/user/login", json={"email": "test@example.com", "password": "password123"}
        )
        self.assertEqual(response.status_code, 200)  # Expecting a successful login
        self.assertIn(
            "name", response.get_json()
        )  # Verify user is returned in response

    def test_login_invalid_credentials(self):
        """
        Test the login process with invalid credentials.
        Asserts that an attempt to log in with incorrect credentials results in an error.
        """
        self.app.post(
            "/user/signup",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "password": "password123",
            },
        )
        response = self.app.post(
            "/user/login",
            json={
                "email": "test@example.com",
                "password": "wrongpassword",  # Invalid password
            },
        )
        self.assertEqual(
            response.status_code, 401
        )  # Expecting a 401 Unauthorized status
        self.assertIn("Invalid login credentials", response.get_json()["error"])

    def test_signout(self):
        """
        Test the signout process.
        Validates that a user can sign out and that the correct redirect occurs after signing out.
        """
        self.app.post(
            "/user/signup",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "password": "password123",
            },
        )
        self.app.post(
            "/user/login", json={"email": "test@example.com", "password": "password123"}
        )
        response = self.app.get("/user/signout")
        self.assertEqual(response.status_code, 302)  # Expecting a redirect on signout


if __name__ == "__main__":
    unittest.main()
