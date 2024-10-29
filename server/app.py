import os
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, session
from flask_cors import CORS

from users.routes import user_routes

# Application
app = Flask(__name__)
CORS(app) # enables CORS for all routes
load_dotenv()
app.secret_key = os.getenv("FLASK_SECRET_KEY")

# Decorators
def login_required(f):
    """
    Decorator to restrict access to certain routes to logged-in users only.
    If the user is not logged in, they are redirected to the home page.

    Args:
        f: The original function to be wrapped.

    Returns:
        The wrapped function or a redirect to the home page.
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        if "logged_in" in session:  # Check if user is logged in
            return f(*args, **kwargs)  # Proceed to the requested function
        else:
            return redirect("/")  # Redirect to home if not logged in

    return wrap


# Register Routes
app.register_blueprint(user_routes, url_prefix="/user")


# Routes
@app.route("/")
def home():
    """
    Home page route.
    Returns a simple string indicating the home page.
    """
    return "Home"


@app.route("/dashboard")
@login_required  # Apply the login_required decorator to this route
def dashboard():
    """
    Dashboard route.
    Accessible only to logged-in users.
    Returns a string indicating the user's dashboard, along with their session information.
    """
    return (
        "Dashboard: " + session["user"]["name"]
    )  # Display the user's name from the session


@app.route("/status", methods=["GET"])
def status():
    """
    Status route.
    Returns a JSON response indicating that the application is running.
    """
    return jsonify({"message": "Application is running"}), 200

if __name__ == "__main__":
    app.run(debug=True, port=8080)  # Start the application in debug mode on port 8080
