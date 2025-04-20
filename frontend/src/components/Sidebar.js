import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaPills, FaChartLine, FaBox, FaSignOutAlt, FaTruck,
  FaClipboardList, FaCapsules, FaList, FaUsers, FaClock, FaUserPlus, FaChevronLeft
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const navItems = [
    { to: "/", label: "Dashboard", icon: <FaPills /> },
    { to: "/inventory", label: "Inventory", icon: <FaBox /> },
    { to: "/ai-inventory-predictor", label: "AI Inventory Predictor", icon: <FaChartLine /> }, // 👈 NEW ITEM
    { to: "/sales", label: "Sales", icon: <FaChartLine /> },
    { to: "/ai-predictor", label: "AI Predictor", icon: <FaChartLine /> },
    { to: "/receiving", label: "Receiving", icon: <FaTruck /> },
    { to: "/medicine-category", label: "Medicine Category", icon: <FaClipboardList /> },
    { to: "/medicine-type", label: "Medicine Type", icon: <FaCapsules /> },
    { to: "/medical-list", label: "Medical List", icon: <FaList /> },
    { to: "/supplier-list", label: "Supplier List", icon: <FaUsers /> },
    { to: "/expiring-list", label: "Expiring List", icon: <FaClock /> },
    { to: "/customers", label: "Customers", icon: <FaUserPlus /> }
  ];

  return (
    <div className={`relative transition-all duration-300 ${isOpen ? "w-64" : "w-20"} h-screen bg-blue-900 text-white p-5 flex flex-col overflow-y-auto`}>
      
      {/* Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          className="text-white p-2 hover:bg-blue-700 rounded transition-transform"
          onClick={toggleSidebar}
        >
          <FaChevronLeft className={`${isOpen ? "rotate-180" : ""} transition-transform`} />
        </button>
      </div>

      {/* Title */}
      <h2 className={`text-2xl font-bold mb-6 mt-10 ${isOpen ? "block" : "hidden"}`}>Pharmacy Dashboard</h2>

      {/* Navigation */}
      <ul className="space-y-2 mt-2">
        {navItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center ${isOpen ? "gap-3" : "justify-center"} p-3 rounded 
                ${isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700"}`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          </li>
        ))}

        {/* Logout Button */}
        <li>
          <button
            onClick={handleLogout}
            className={`flex items-center ${isOpen ? "gap-3" : "justify-center"} p-3 hover:bg-red-600 rounded w-full text-left`}
          >
            <FaSignOutAlt className="text-lg" />
            {isOpen && <span>Logout</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
