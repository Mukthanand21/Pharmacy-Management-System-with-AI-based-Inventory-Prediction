import React from "react";

const About = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">About This App</h2>
        <p className="text-gray-700 mb-4">
          💊 Welcome to <span className="font-semibold">PharmaPro</span> – your AI-powered Pharmacy Management System!
          <br /><br />
          Track inventory, forecast demand, manage expiries, and get smart restock alerts.
          <br />
          Built with ❤️ using <strong>React</strong> & <strong>Flask</strong>.
        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default About;
