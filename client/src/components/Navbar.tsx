import { Link, useNavigate } from "react-router-dom";
import { NavigationState, useNavigationState } from "./UserPages/HandleUser";
import "@/styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const currentState = useNavigationState();

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const loginNavbar = (
    <div className="navbar-left-container">
      <h1 className="text-accent">BudgetAI</h1>
    </div>
  );

  const MainNavbar = (
    <div className="navbar-left-container">
      <Link to="/home" className="nav-links">
        BudgetAI
      </Link>
      <Link to="/upload" className="nav-links">
        Upload
      </Link>
      <Link to="/analysis" className="nav-links">
        Transactions
      </Link>
      <Link to="/chat" className="nav-links">
        Chat
      </Link>
      <div className="nav-links" onClick={handleSignOut}>
        Sign Out
      </div>
    </div>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {currentState == NavigationState.MAIN_PAGES ? MainNavbar : loginNavbar}
      </div>
      {/* <div className="navbar-right-container">
            <div className="navbar-image">
              <ModeToggle />
            </div>
        </div> */}
    </nav>
  );
}

export default Navbar;
