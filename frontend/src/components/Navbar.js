import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token or user data
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">PMS AI Inventory Predictor</Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex space-x-6 items-center">
        <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
        <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
        <li>
          <button 
            onClick={handleLogout} 
            className="hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </li>
      </ul>

      {/* Mobile Toggle */}
      <button className="md:hidden" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="absolute top-16 left-0 w-full bg-blue-800 flex flex-col items-center space-y-4 py-4 md:hidden">
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li>
            <button onClick={() => { toggleMenu(); handleLogout(); }} className="text-red-300 hover:text-red-500">
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
