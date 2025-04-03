import { useState } from "react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Signup Successful, Please Login!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/pharmacy-bg2.jpg')" }}
      ></div>

      {/* Signup Box */}
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600">Create an Account</h2>
        <form onSubmit={handleSignup} className="mt-6">
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
