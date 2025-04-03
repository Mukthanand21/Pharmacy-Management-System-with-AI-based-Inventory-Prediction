import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Prediction from "./pages/Prediction";
import Home from "./pages/Home";
import Sales from "./pages/Sales";
import Receiving from "./pages/Receiving";
import MedicineCategory from "./pages/MedicineCategory";
import MedicineType from "./pages/MedicineType";
import MedicalList from "./pages/MedicalList";
import SupplierList from "./pages/SupplierList";
import ExpiringList from "./pages/ExpiringList";  // ✅ Import Expiring List Page

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar onLogout={handleLogout} />
            <div className="p-6 bg-gray-100 flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/receiving" element={<Receiving />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/home" element={<Home />} />
                <Route path="/medicine-category" element={<MedicineCategory />} />
                <Route path="/medicine-type" element={<MedicineType />} />
                <Route path="/medical-list" element={<MedicalList />} />
                <Route path="/supplier-list" element={<SupplierList />} />
                <Route path="/expiring-list" element={<ExpiringList />} /> {/* ✅ Expiring List Route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
