import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";
import { NavigationState } from "./UserPages/HandleUser";
import "@/styles/Navbar.css";

function Navbar()  {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState<NavigationState>(NavigationState.LOG_IN);  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/login':
        case '/signup':
        setCurrentState(NavigationState.LOG_IN);
        break;
      
      // For the pages the user will use for analysing their data
      case '/home':
      case '/upload-data':
      case '/analysis':
      case '/chat':
        setCurrentState(NavigationState.MAIN_PAGES);
        break;
      default:
        setCurrentState(NavigationState.LOG_IN);
    }
  }, [location]);

  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn');
    setCurrentState(NavigationState.LOG_IN);
    navigate('/login');
  };

  const loginNavbar = (
    <div className="navbar-left-container">
      <h1 className="text-accent">BudgetAI</h1>
  </div>
  );

  const MainNavbar = (
    <div className="navbar-left-container">
    <Link to="/" className="nav-links">
        BudgetAI
    </Link>
    <Link to="/" className="nav-links">
        Upload Data
    </Link>
    <Link to="/" className="nav-links">
        Analysis
    </Link>
    <Link to="/" className="nav-links">
        Chat
    </Link>
    <div className="nav-links"
    onClick={handleSignOut}>Sign Out</div>
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