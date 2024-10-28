import os

from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename

from utils.decorators import login_required
from utils.upload import Upload

upload_routes = Blueprint("upload", __name__)


@upload_routes.route("/csv", methods=["POST"])
@login_required
def upload():
    """
    Upload route for processing a CSV file.
    This route accepts a file upload directly.

    Returns:
        JSON response indicating success or failure of the upload process.
    """
    # Validate the file
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save the file to the flask upload folder
    filename = secure_filename(file.filename)  # Secure the file name
    file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)  # Save the file to the upload folder

    # Process the CSV file
    Upload().process_csv(file_path)

    return jsonify(
        {"message": "File uploaded and processed successfully"}), 200
