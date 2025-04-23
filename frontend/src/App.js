import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
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
import ExpiringList from "./pages/ExpiringList";
import Customers from "./pages/Customers";
import AIPredictor from "./pages/AIPredictor";
import InventoryPredictor from "./pages/InventoryPredictor";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem("user"));
    };

    // Listen to storage changes across tabs
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      {user ? (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <div className="p-6 bg-gray-100 flex-1 overflow-y-auto">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/ai-inventory-predictor" element={<InventoryPredictor />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/receiving" element={<Receiving />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/home" element={<Home />} />
                <Route path="/medicine-category" element={<MedicineCategory />} />
                <Route path="/medicine-type" element={<MedicineType />} />
                <Route path="/medical-list" element={<MedicalList />} />
                <Route path="/supplier-list" element={<SupplierList />} />
                <Route path="/expiring-list" element={<ExpiringList />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/ai-predictor" element={<AIPredictor />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
