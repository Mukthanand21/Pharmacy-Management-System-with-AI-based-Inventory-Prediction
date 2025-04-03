import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaPills, FaChartLine, FaBox, FaSignOutAlt, FaTruck, 
  FaClipboardList, FaCapsules, FaList, FaUsers, FaClock 
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-blue-900 text-white p-5 flex flex-col overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Pharmacy Dashboard</h2>
      <ul className="space-y-2">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`
            }
          >
            <FaPills /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/inventory" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`
            }
          >
            <FaBox /> Inventory
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/sales" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`
            }
          >
            <FaChartLine /> Sales
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/receiving" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`
            }
          >
            <FaTruck /> Receiving
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/medicine-category" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`
            }
          >
            <FaClipboardList /> Medicine Category
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/medicine-type" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`
            }
          >
            <FaCapsules /> Medicine Type
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/medical-list" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`
            }
          >
            <FaList /> Medical List
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/supplier-list" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`
            }
          >
            <FaUsers /> Supplier List
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/expiring-list" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`
            }
          >
            <FaClock /> Expiring List
          </NavLink>
        </li>
        <li>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 hover:bg-red-600 rounded w-full text-left"
          >
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
