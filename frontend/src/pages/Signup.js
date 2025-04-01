import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/signup", { name, email, password });
      if (response.data.success) {
        alert("Sign-up successful! Please log in.");
        navigate("/login"); // Redirect to login page
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error signing up. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-4">📝 Sign Up</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input type="text" placeholder="Full Name" className="border p-2 rounded" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" className="border p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="border p-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="bg-green-600 text-white p-2 rounded">Sign Up</button>
        </form>
        <p className="text-center mt-4">Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
      </div>
    </div>
  );
}

export default Signup;
