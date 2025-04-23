import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (res.data && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 1500,
          onClose: () => navigate("/dashboard"),
        });
      } else {
        toast.error("Invalid login response.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex flex-col items-center mb-6">
          <img src="/pharmacy-icon.png" alt="Pharmacy" className="w-16 h-16 mb-2" />
          <h2 className="text-3xl font-extrabold text-blue-700">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Please login to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline font-medium"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
