import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import "@/styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
        <div className="navbar-container">
            <div className="navbar-left-container">
            <Link to="/" className="navbar-image">
                <Home className="text-foreground" />
            </Link>
            </div>
        </div>
        <div className="navbar-right-container">
            <div className="navbar-image">
              <ModeToggle />
            </div>
        </div>
    </nav>
  );
}

export default Navbar;