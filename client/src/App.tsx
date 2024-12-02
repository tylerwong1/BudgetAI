import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
//import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Chat from "./components/UserPages/Chat";
import LandingPage from "./components/UserPages/LandingPage";
import CsvUploadPage from "./components/UserPages/Upload";
import Analysis from "./components/UserPages/Analysis";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./styles/App.css";

function App() {
  return (
    <div className="site-holder">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router basename="/BudgetAI">
          <Navbar />
          <div className="page-holder">
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/signup" Component={SignUp} />
              <Route path="/login" Component={Login} />
              {/* All protected pages requiring the user to log in first! */}
              <Route path="/home" Component={LandingPage} />
              <Route path="/upload" Component={CsvUploadPage} />
              <Route path="/analysis" Component={Analysis} />
              <Route path="/chat" Component={Chat} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
