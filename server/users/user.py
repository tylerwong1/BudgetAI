import uuid

from flask import jsonify, redirect, request, session
from passlib.hash import pbkdf2_sha256

from database import get_login_system_db


class User:
    """
    User class handles user-related operations for the application, including
    signup, login, logout (signout), and session management. It interacts with
    the database to manage user data securely.

    Attributes:
        db: Database connection for user operations.
        client: Database client for performing CRUD operations.
    """

    def __init__(self):
        """
        Initializes the User class and establishes a connection to the database
        for user management.
        """
        self.db, self.client = get_login_system_db()

    def __del__(self):
        """
        Cleans up the database client when the User object is deleted,
        ensuring proper resource management.
        """
        self.client.close()

    def start_session(self, user):
        """
        Starts a user session after successful login or signup.
        Removes the password from the user data for security,
        marks the user as logged in, and stores the user's data in the session.

        Parameters:
            user (dict): User data to store in the session.

        Returns:
            jsonify: JSON response containing the user data without the password.
        """
        del user["password"]  # Remove password for security reasons
        session["logged_in"] = True  # Mark the user as logged in
        session["user"] = user  # Store the user's data in the session
        return jsonify(user)

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

        # Check if all required fields are provided
        if not data or not all(key in data for key in ("username", "email", "password")):
            return jsonify({"error": "Missing required fields"}), 400

        # Create the user object with a unique ID
        user = {
            "_id": uuid.uuid4().hex,  # Generate unique user ID
            "username": data["username"],
            "email": data["email"],
            "password": data["password"],
        }

        # Hash the user's password before storing it
        user["password"] = pbkdf2_sha256.hash(user["password"])

        # Check if the email address is already registered
        if self.db["users"].find_one({"email": user["email"]}):
            return jsonify({"error": "Email address already in use"}), 400

        # Add the user to the database
        if self.db["users"].insert_one(user):
            # Start session if signup is successful
            return self.start_session(user)

        # If insertion fails, return a signup failure response
        return jsonify({"error": "Signup failed"}), 400

    def signout(self):
        """
        Logs the user out by clearing the session data and redirects
        the user to the homepage.

        Returns:
            redirect: Redirects to the homepage after logging out.
        """
        session.clear()  # Clear the session to log the user out
        return redirect("/")  # Redirect the user to the homepage

    def login(self):
        """
        Handles user login process by validating provided credentials,
        checking against stored user data, and starting a session if successful.

        Validates the input data, retrieves the user from the database,
        verifies the password, and returns an appropriate response.

        Returns:
            jsonify: JSON response indicating success or error.
        """
        data = request.get_json()

        # Check if all required fields are provided
        if not data or not all(key in data for key in ("username", "password")):
            return jsonify({"error": "Missing required fields"}), 400

        user = self.db["users"].find_one({"username": data["username"]})

        if user and pbkdf2_sha256.verify(data["password"], user["password"]):
            return self.start_session(user)

        return jsonify({"error": "Invalid login credentials"}), 401
