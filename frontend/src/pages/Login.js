import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", { email, password });
      if (response.data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("token", response.data.token); // Save token
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("Error logging in");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-4">🔐 Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" className="border p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="border p-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
