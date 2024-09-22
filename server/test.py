import unittest
from main import app  # Import the Flask app from main.py

class FlaskStatusTest(unittest.TestCase):

    def setUp(self):
        # Set up a test client for the Flask app
        self.app = app.test_client()
        self.app.testing = True

    # Test the /status endpoint
    def test_status(self):
        response = self.app.get('/status')  # Send GET request to /status
        self.assertEqual(response.status_code, 200)  # Check if status code is 200
        self.assertEqual(response.json, {"message": "Application is running"})  # Check if response data is correct

if __name__ == "__main__":
    unittest.main()
