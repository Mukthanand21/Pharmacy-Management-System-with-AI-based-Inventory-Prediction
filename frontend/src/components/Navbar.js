const Navbar = () => {
  return (
    <div className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Welcome, Admin</span>
        <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
      </div>
    </div>
  );
};

export default Navbar;
