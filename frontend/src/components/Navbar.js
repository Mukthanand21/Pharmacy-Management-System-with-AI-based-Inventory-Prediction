import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white flex gap-4">
      <Link to="/" className="font-bold text-lg">Home</Link>
      <Link to="/inventory" className="font-bold text-lg">Inventory</Link>
      <Link to="/prediction" className="font-bold text-lg">AI Prediction</Link>
    </nav>
  );
}

export default Navbar;
