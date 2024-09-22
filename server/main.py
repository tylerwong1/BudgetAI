from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/status", methods=['GET'])
def status():
     return jsonify({"message": "Application is running"}), 200

if __name__ == "__main__":
    app.run(debug=True, port=8080)
