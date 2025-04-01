import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup"
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Prediction from "./pages/Prediction";
import Navbar from "./components/Navbar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/inventory" element={isAuthenticated ? <Inventory /> : <Navigate to="/login" />} />
        <Route path="/prediction" element={isAuthenticated ? <Prediction /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
