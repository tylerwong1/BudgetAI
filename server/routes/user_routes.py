from flask import Blueprint

from models.user import User
from utils.decorators import login_required

user_routes = Blueprint("user", __name__)


@user_routes.route("/signup", methods=["POST"])
def signup():
    """
    Handle user signup requests.
    Calls the signup method from the User model to create a new user.
    Expects a JSON payload with user details.
    """
    return User().signup()


@user_routes.route("/login", methods=["POST"])
def login():
    """
    Handle user login requests.
    Calls the login method from the User model to authenticate a user.
    Expects a JSON payload with login credentials.
    """
    return User().login()


@user_routes.route("/signout")
@login_required
def signout():
    """
    Handle user sign-out requests.
    Calls the signout method from the User model to log the user out.
    """
    return User().signout()


@user_routes.route("/wipe", methods=["POST"])
@login_required
def wipe():
    """
    Enables wiping the user's data.
    """
    return User().wipe()
