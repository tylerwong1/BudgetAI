from flask import Blueprint

from utils.query import Query

# Create a Blueprint for query-related routes
query_routes = Blueprint("query", __name__)

@query_routes.route("/transactions", methods=["GET"])
def get_all_transactions():
    return Query().get_transactions()

@query_routes.route("/transactions/category", methods=["POST"])
def get_transactions_by_category():
    return Query().get_by_category()

@query_routes.route("/transactions/amount", methods=["POST"])
def get_transactions_by_amount():
    return Query().get_by_amount_range()

@query_routes.route("/transactions/date", methods=["POST"])
def get_transactions_by_date():
    return Query().get_by_date_range()





