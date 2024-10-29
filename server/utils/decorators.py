from functools import wraps

from flask import redirect, session


def login_required(f):
    """
    Decorator to restrict access to certain routes to logged-in users only.
    If the user is not logged in, they are redirected to the home page.
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        if "logged_in" in session:
            return f(*args, **kwargs)  # Proceed to the requested function
        else:
            return redirect("/")  # Redirect to home if not logged in

    return wrap
