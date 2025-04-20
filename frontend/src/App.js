import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import InventoryPredictor from "./pages/InventoryPredictor"; // 👈 Import new page

function App() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar onLogout={handleLogout} />
          <div className="p-6 bg-gray-100 flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/ai-inventory-predictor" element={<InventoryPredictor />} /> {/* 👈 New route */}
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
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
