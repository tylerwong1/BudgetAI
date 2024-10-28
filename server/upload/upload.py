import csv
import logging
import os
import uuid
from datetime import datetime

from flask import jsonify, request, session
from werkzeug.utils import secure_filename

from database import get_budgetai_db


class Upload:
    def __init__(self):
        self.db, self.client = get_budgetai_db()

    def __del__(self):
        self.client.close()

    class Transaction:
        """
        Transaction class that represents a user's financial transaction.
        This class serves as a simple data structure for transaction attributes.
        """

        def __init__(
            self, _id, user_id, transaction_date, description, category, amount
        ):
            """
            Initializes a transaction with the given attributes.

            Parameters:
                _id (str): Transaction's unique identifier.
                user_id (str): ID of the user associated with the transaction.
                transaction_date (str): Date of the transaction.
                description (str): Description of the transaction.
                category (str): Category of the transaction.
                amount (float): Amount of the transaction.
            """
            self._id = _id
            self.user_id = user_id
            self.transaction_date = transaction_date
            self.description = description
            self.category = category
            self.amount = amount

    def create_transactions(self, transactions):
        """
        Creates multiple transactions in the database.

        Parameters:
            transactions (list): A list of Transaction instances to insert.
        """
        # Implement the actual bulk database insertion logic here
        try:
            transaction_data = [
                transaction.__dict__ for transaction in transactions
            ]  # Convert to dict
            self.db["transactions"].insert_many(
                transaction_data
            )  # Example of bulk insert using pymongo
        except Exception as e:
            logging.error(f"Error inserting transactions into database: {str(e)}")

    def process_tuple(self, row, user_id):
        """
        Processes a valid row into a Transaction instance.

        Parameters:
            row (dict): The row data from the CSV.
            user_id (str): The ID of the user associated with the transaction.

        Returns:
            Transaction: An instance of Transaction, or None if creation fails.
        """
        try:
            transaction_date = row["Transaction Date"]
            description = row["Description"]
            category = row["Category"]
            type = row["Type"]
            amount = float(row["Amount"]) * -1

            # Validate transaction date format
            try:
                datetime.strptime(transaction_date, "%m/%d/%Y")
            except ValueError:
                logging.error(
                    f"Invalid date format for transaction_date: '{transaction_date}' in row: {row}. Expected format: MM/DD/YYYY."
                )
                return None  # Return None for invalid date formats

            # Check if the transaction type is 'Sale'
            if type != "Sale":
                logging.error(
                    f"Invalid transaction type: '{type}' for row: {row}. Only 'Sale' transactions are accepted."
                )
                return None

            # Create a Transaction instance
            transaction = self.Transaction(
                _id=uuid.uuid4().hex,  # Generate unique transaction ID
                user_id=user_id,
                transaction_date=transaction_date,
                description=description,
                category=category,
                amount=amount,
            )
            return transaction
        except Exception as e:
            logging.error(
                f"Error processing row into transaction: {row}, Error: {str(e)}"
            )
            return None  # Return None if there was an error

    def process_csv(self, file_path):
        """
        Processes the uploaded CSV file and creates transactions.

        Parameters:
            file_path (str): The path to the CSV file.
        """
        user_id = session["user"]["_id"]  # Get user ID from session
        transactions = []  # To accumulate transactions for bulk insert

        with open(file_path, "r") as f:
            csv_reader = csv.DictReader(f)  # Use DictReader for easier handling

            for row in csv_reader:
                # Process the valid row into a Transaction
                transaction = self.process_tuple(row, user_id)
                if transaction:  # Only add if transaction creation was successful
                    transactions.append(transaction)  # Accumulate the transaction

        # Prepare to bulk insert transactions into the database
        if transactions:
            self.create_transactions(transactions)  # Bulk insert transactions
