import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

from routes.query_routes import query_routes
from routes.upload_routes import upload_routes
from routes.user_routes import user_routes
from routes.chat_routes import chat_routes

# Application
app = Flask(__name__)
CORS(app) # enables CORS for all routes
load_dotenv()
app.secret_key = os.getenv("FLASK_SECRET_KEY")

app.config["SESSION_COOKIE_NAME"] = "budgetai_session"
app.config["SESSION_TYPE"] = "filesystem"
app.config["UPLOAD_FOLDER"] = "files"

# Register Routes
app.register_blueprint(query_routes, url_prefix="/query")
app.register_blueprint(upload_routes, url_prefix="/upload")
app.register_blueprint(user_routes, url_prefix="/user")
app.register_blueprint(chat_routes, url_prefix="/chat")

# App Routes
@app.route("/")
def home():
    # TODO: Create infra to serve React App within this file
    return "Home"


@app.route("/status", methods=["GET"])
def status():
    """
    Status route.
    Returns a JSON response indicating that the application is running.
    """
    return jsonify({"message": "Application is running"}), 200

if __name__ == "__main__":
    app.run(debug=True, port=8080)
