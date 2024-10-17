import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import "@/styles/Navbar.css";

function Navbar() {
  return (
    <nav className="bg-foreground text-background navbar">
        <div className="navbar-container">
            <div className="navbar-left-container">
            <Link to="/" className="navbar-image">
                <Home height={40} className="text-foreground" />
            </Link>
            </div>
        </div>
        <div className="navbar-right-container">
            <ModeToggle />
        </div>
    </nav>
  );
}

export default Navbar;