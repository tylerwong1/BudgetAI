from flask import Flask, jsonify, request, session, redirect
from passlib.hash import pbkdf2_sha256
from database import db
import uuid

class User:
    """
    This class handles user authentication and session management
    including signup, login, and signout functionalities.
    """
    
    def start_session(self, user):
        """
        Start a session for the logged-in user.
        This method clears the user's password from the session data for security,
        sets the 'logged_in' session flag, and stores the user's data in the session.

        Args:
            user (dict): A dictionary containing the user's data, including their email, name, and hashed password.
        
        Returns:
            A JSON response with the user's data (minus the password).
        """
        del user['password']  # Remove password for security reasons
        session['logged_in'] = True  # Mark the user as logged in
        session['user'] = user  # Store the user's data in the session
        return jsonify(user)
    
    def signup(self):
        """
        Handle the user signup process. This method collects the user's input data,
        validates it, hashes the password, checks for duplicate emails, and adds the user to the database.

        Returns:
            A JSON response indicating success or failure of the signup process:
            - On success: Starts a session and returns the user's data.
            - On failure: Returns an error message, either for missing fields or email already in use.
        """
        data = request.get_json()

        # Check if all required fields are provided
        if not data or not all(key in data for key in ("name", "email", "password")):
            return jsonify({"error": "Missing required fields"}), 400

        # Create the user object with a unique ID
        user = {
            "_id": uuid.uuid4().hex,  # Generate unique user ID
            "name": data["name"],
            "email": data["email"],
            "password": data["password"]
        }
        
        # Hash the user's password before storing it
        user['password'] = pbkdf2_sha256.encrypt(user['password'])
        
        # Check if the email address is already registered
        if db["users"].find_one({"email": user["email"]}):
            return jsonify({"error": "Email address already in use"}), 400
        
        # Add the user to the database
        if db["users"].insert_one(user):
            # Start session if signup is successful
            return self.start_session(user)
        
        # If insertion fails, return a signup failure response
        return jsonify({"error": "Signup failed"}), 400

    def signout(self):
        """
        Log out the current user by clearing the session data.

        Returns:
            A redirect response that sends the user back to the homepage.
        """
        session.clear()  # Clear the session to log the user out
        return redirect('/')  # Redirect the user to the homepage
