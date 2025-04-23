import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import About from "./About";

const Navbar = () => {
  const [showAbout, setShowAbout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        {/* Logo / Brand */}
        <div className="text-2xl font-extrabold text-blue-700 tracking-wide flex items-center gap-2">
          <img src="/pharmacy-icon.png" alt="PharmaPro" className="h-8 w-8" />
          PMS-AI
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-6 items-center text-gray-700 font-medium">
          <li>
            <Link to="/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/inventory" className="hover:text-blue-600 transition">
              Inventory
            </Link>
          </li>
          <li>
            <Link to="/sales" className="hover:text-blue-600 transition">
              Sales
            </Link>
          </li>
          <li
            className="hover:text-blue-600 cursor-pointer transition"
            onClick={() => setShowAbout(true)}
          >
            About
          </li>
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded shadow-sm transition"
        >
          Logout
        </button>
      </nav>

      {/* About Modal */}
      {showAbout && <About onClose={() => setShowAbout(false)} />}
    </>
  );
};

export default Navbar;
