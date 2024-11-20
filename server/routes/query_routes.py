from flask import Blueprint

from utils.decorators import login_required
from utils.query import Query

query_routes = Blueprint("query", __name__)


@query_routes.route("/transactions", methods=["GET"])
@login_required
def get_all_transactions():
    return Query().get_transactions()


@query_routes.route("/transactions/category", methods=["POST"])
@login_required
def get_transactions_by_category():
    return Query().get_by_category()


@query_routes.route("/transactions/amount", methods=["POST"])
@login_required
def get_transactions_by_amount():
    return Query().get_by_amount_range()


@query_routes.route("/transactions/date", methods=["POST"])
@login_required
def get_transactions_by_date():
    return Query().get_by_date_range()

@query_routes.route("/transactions/date_range", methods=["GET"])
@login_required
def get_transaction_date_range():
    return Query().get_transaction_range()
