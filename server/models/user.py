import re
import uuid

from flask import jsonify, redirect, request, session
from passlib.hash import pbkdf2_sha256

from database.db import get_budgetai_db


class User:
    """
    User class handles user-related operations for the application, including
    user authentication, session management, and transaction management. It
    interacts with the database to manage user data securely.

    Attributes:
        db: Database connection for user operations.
        client: Database client for performing CRUD operations.
    """

    class Profile:
        def __init__(self, _id, name, email, password=None):
            """
            Initializes a user profile with basic attributes.

            Parameters:
                _id (str): User's unique identifier.
                name (str): User's name.
                email (str): User's email.
                password (str): User's password.
            """
            self._id = _id
            self.name = name
            self.email = email
            self.password = password

    def __init__(self):
        """
        Initializes the User class and establishes a connection to the database
        for user management.
        """
        self.db, self.client = get_budgetai_db()

    def __del__(self):
        """
        Cleans up the database client when the User object is deleted,
        ensuring proper resource management.
        """
        self.client.close()

    def start_session(self, user_profile):
        """
        Starts a user session after successful login or signup.

        Parameters:
            user_profile (Profile): The user profile to store in the session.

        Returns:
            jsonify: JSON response containing the user data without the password.
        """
        session["logged_in"] = True
        session["user"] = {
            "_id": user_profile._id,
            "name": user_profile.name,
            "email": user_profile.email,
        }  # Store profile data in session
        return jsonify(session["user"])

    def signup(self):
        """
        Handles user signup process, including validation of input data,
        creation of a new user, and hashing the user's password.

        Validates the provided data, checks for existing email addresses,
        and inserts the new user into the database. If successful, it starts
        a session for the user.

        Returns:
            jsonify: JSON response indicating success or error.
        """
        data = request.get_json()

        # Check for required fields
        if not data or not all(key in data for key in (
                "name", "email", "password")):
            return jsonify({"error": "Missing required fields"}), 400

        # Create a user profile
        user_profile = self.Profile(_id=uuid.uuid4().hex, **data)

        # Validate the user's email format
        if not re.match(r"[^@]+@[^@]+\.[^@]+", user_profile.email):
            return jsonify({"error": "Invalid email format"}), 400

        # Hash the user's password
        user_profile.password = pbkdf2_sha256.hash(user_profile.password)

        # Check if the email address is already registered
        if self.db["users"].find_one({"email": user_profile.email}):
            return jsonify({"error": "Email address already in use"}), 400

        # Add the user to the database
        if self.db["users"].insert_one(user_profile.__dict__):
            # Start session if signup is successful
            return self.start_session(user_profile)

        return jsonify({"error": "Signup failed"}), 400

    def login(self):
        """
        Handles user login process by validating provided credentials,
        retrieving the user profile, and starting a session if successful.

        Returns:
            jsonify: JSON response indicating success or error.
        """
        data = request.get_json()

        # Check if all required fields are provided
        if not data or not all(key in data for key in ("email", "password")):
            return jsonify({"error": "Missing required fields"}), 400

        # Retrieve user from database
        user_data = self.db["users"].find_one({"email": data["email"]})

        if user_data and pbkdf2_sha256.verify(
                data["password"], user_data["password"]):
            user_profile = self.Profile(
                _id=user_data["_id"],
                name=user_data["name"],
                email=user_data["email"],
            )
            # Start a session with the user profile
            return self.start_session(user_profile)

        return jsonify({"error": "Invalid login credentials"}), 401

    def signout(self):
        """
        Logs the user out by clearing the session data and redirects
        the user to the homepage.

        Returns:
            redirect: Redirects to the homepage after logging out.
        """
        session.clear()  # Clear the session to log the user out
        return redirect("/")  # Redirect the user to the homepage

    def wipe(self):
        """
        Wipes user data from the database client and clears session.
        """
        # Verifies user is logged in
        user = session.get("user")
        if user is None:
            return jsonify({"error": "User not logged in"}), 400
        user_id = session.get("user", {}).get("_id")
        if user_id is None:
            return jsonify({"error": "User id not found"}), 400

        # Verifies inputed password
        data = request.get_json()
        if not data or "password" not in data:
            return jsonify({"error": "Missing required fields"}), 400

        user_data = self.db["users"].find_one({"_id": user_id})
        if not user_data:
            return jsonify({"error": "User not found"}), 400
        if not pbkdf2_sha256.verify(data["password"], user_data["password"]):
            return jsonify({"error": "Invalid credentials"}), 400

        # Delete any corresponding transactions from database
        self.db["transactions"].delete_many({"user_id": user_id})
        # Delete user from database
        self.db["users"].delete_one({"_id": user_id})

        session.clear()
        return (
            jsonify(
                {"message": "User and associated transactions deleted successfully"}
            ),
            200,
        )
