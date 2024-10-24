import os
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, request, session
from werkzeug.utils import secure_filename

from upload.upload import Upload
from users.routes import user_routes

# Application
app = Flask(__name__)
load_dotenv()
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config["SESSION_COOKIE_NAME"] = "budgetai_session"
app.config["SESSION_TYPE"] = "filesystem"
app.config["UPLOAD_FOLDER"] = "files"


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
@login_required
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


@app.route("/upload", methods=["POST"])
@login_required
def upload():
    """
    Upload route for processing a CSV file.
    This route accepts a file upload directly.

    Returns:
        JSON response indicating success or failure of the upload process.
    """
    # Check if a file is part of the request
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save the file to the upload folder
    filename = secure_filename(file.filename)  # Secure the file name
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)  # Save the file to the upload folder

    # Process the CSV file (you would replace this with your processing logic)
    upload_instance = Upload()  # Create an instance of your upload processing class
    upload_instance.process_csv(file_path)  # Process the CSV

    return jsonify({"message": "File uploaded and processed successfully"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=8080)  # Start the application in debug mode on port 8080
