import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/signup", {
        name,
        email,
        password,
      });

      if (res.data && res.data.user) {
        toast.success("Signup successful!", {
          position: "top-right",
          autoClose: 1500,
          onClose: () => navigate("/login"),
        });
      } else {
        toast.error("Signup failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 via-blue-100 to-blue-200">
      <ToastContainer />
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex flex-col items-center mb-6">
          <img src="/pharmacy-icon.png" alt="Pharmacy Logo" className="w-16 h-16 mb-2" />
          <h2 className="text-3xl font-extrabold text-green-700">Create Your Account</h2>
          <p className="text-gray-500 text-sm">Start managing your pharmacy today</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Full Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <div className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-green-600 cursor-pointer hover:underline font-medium"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
