import unittest

from app import app


class FlaskStatusTest(unittest.TestCase):
    """
    FlaskStatusTest is a unit test class that verifies the status endpoint of the Flask application.
    It checks if the application is running and responding correctly to requests.
    """

    def setUp(self):
        """
        Set up a test client for the Flask app.
        Enables testing mode for the application.
        """
        self.app = app.test_client()
        self.app.testing = True

    def test_status(self):
        """
        Test the /status endpoint of the application.
        Sends a GET request to the /status route and checks:
        - That the status code of the response is 200 (OK).
        - That the response JSON contains the expected message indicating the application is running.
        """
        response = self.app.get("/status")  # Send GET request to /status
        self.assertEqual(response.status_code, 200)  # Check if status code is 200
        self.assertEqual(
            response.json, {"message": "Application is running"}
        )  # Check if response data is correct


if __name__ == "__main__":
    unittest.main()
