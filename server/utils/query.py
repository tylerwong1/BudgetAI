from datetime import datetime

from flask import jsonify, request, session

from database import get_budgetai_db

class Query:
    def __init__(self):
        self.db, self.client = get_budgetai_db()

    def __del__(self):
        self.client.close()
    
    def get_current_user_id(self):
        # Retrieve the user from the session
        user = session.get("user")
        
        # Check if user is not logged in
        if user is None:
            return None, jsonify({"error": "User not logged in"}), 400
        
        # Retrieve user ID from the session data
        user_id = user.get("_id")
        
        # Check if user_id is missing in the session data
        if user_id is None:
            return None, jsonify({"error": "User ID not found"}), 400
        
        # Return user_id, success message, and 200 status if all checks pass
        return user_id, jsonify({"message": "User found"}), 200

    def get_transactions(self):
        user_id, response, status_code = self.get_current_user_id()
        
        if status_code != 200:
            return response, status_code
        
        transactions = list(self.db["transactions"].find({"user_id": user_id}))
        return jsonify(transactions)

    def get_by_category(self):
        data = request.get_json()
        category = data.get("category")
        
        # Validate category
        if not category:
            return jsonify({"error": "Category field is required"}), 400
        user_id, response, status_code = self.get_current_user_id()
        
        if status_code != 200:
            return response, status_code
        
        transactions = list(self.db["transactions"].find({"user_id": user_id, "category": category}))
        return jsonify(transactions)

    def get_by_amount_range(self):
        data = request.get_json()
        min_amount = data.get("min_amount")
        max_amount = data.get("max_amount")

        # Validate amount range
        if min_amount is None or max_amount is None:
            return jsonify({"error": "Both min_amount and max_amount fields are required"}), 400
        if not isinstance(min_amount, (int, float)) or not isinstance(max_amount, (int, float)):
            return jsonify({"error": "min_amount and max_amount must be numbers"}), 400
        
        user_id, response, status_code = self.get_current_user_id()
        
        if status_code != 200:
            return response, status_code

        # Query transactions by amount range
        transactions = list(self.db["transactions"].find({
            "user_id": user_id,
            "amount": {"$gte": min_amount, "$lte": max_amount}
        }))
        return jsonify(transactions)

    def get_by_date_range(self):
        data = request.get_json()
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        # Validate date range
        if not start_date or not end_date:
            return jsonify({"error": "Both start_date and end_date fields are required"}), 400
        
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
            end_date = datetime.strptime(end_date, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
        
        user_id, response, status_code = self.get_current_user_id()
        
        if status_code != 200:
            return response, status_code

        # Convert date strings to datetime objects
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
            end_date = datetime.strptime(end_date, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

        # Query transactions by date range
        transactions = list(self.db["transactions"].find({
            "user_id": user_id,
            "date": {"$gte": start_date, "$lte": end_date}
        }))
        return jsonify(transactions)
    
        
        