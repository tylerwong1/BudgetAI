import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import LandingPage from "./components/UserPages/LandingPage";
import CsvUploadPage from "./components/UserPages/Upload";
import { ThemeProvider } from "@/components/ThemeProvider"
import "./styles/App.css";

function App() {
  return (

    <div className="site-holder">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router basename="/BudgetAI">
        <Navbar />
          <div className="page-holder">
            <Routes>
              {/* Removed for now, add back later!!!  
              <Route path="/" Component={Home} /> */}
              <Route path="/" Component={SignUp} />
              <Route path="/signup" Component={SignUp} />
              <Route path="/login" Component={Login} />

              {/* All protected pages requiring the user to log in first! */}
              <Route path="/home" Component={LandingPage} />
              <Route path="/upload" Component={CsvUploadPage} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
