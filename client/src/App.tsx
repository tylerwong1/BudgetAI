import { Routes, Route, BrowserRouter } from "react-router-dom";
// import Home from "./components/Home";
// import Login from "./components/Login";
import SignUp from "./components/SignUp";

import "./styles/App.css";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
