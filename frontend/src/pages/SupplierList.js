import { useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const SupplierList = () => {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "MediCare Ltd.", contact: "9876543210", address: "Hyderabad, India" },
    { id: 2, name: "Pharma Distributors", contact: "9123456789", address: "Mumbai, India" },
  ]);
  
  const [form, setForm] = useState({ name: "", contact: "", address: "" });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const entriesPerPage = 10;

  // Handle Input Change
  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Save or Update Supplier
  const handleSave = () => {
    if (!form.name || !form.contact || !form.address) return alert("All fields are required!");
    
    if (editingId !== null) {
      setSuppliers(suppliers.map((s) => (s.id === editingId ? { ...s, ...form } : s)));
      setEditingId(null);
    } else {
      setSuppliers([...suppliers, { id: suppliers.length + 1, ...form }]);
    }
    
    setForm({ name: "", contact: "", address: "" });
  };

  // Edit Supplier
  const handleEdit = (supplier) => {
    setForm(supplier);
    setEditingId(supplier.id);
  };

  // Delete Supplier
  const handleDelete = (id) => setSuppliers(suppliers.filter((s) => s.id !== id));

  // Pagination Logic
  const startIndex = (page - 1) * entriesPerPage;
  const filteredSuppliers = suppliers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + entriesPerPage);
  
  return (
    <div className="p-6 bg-gray-100 flex gap-6">
      {/* Left Panel - Form */}
      <div className="w-1/3 bg-white p-4 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Supplier" : "Add Supplier"}</h2>
        <input type="text" name="name" placeholder="Supplier Name" value={form.name} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
        <input type="text" name="contact" placeholder="Contact" value={form.contact} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
        <textarea name="address" placeholder="Address" value={form.address} onChange={handleInputChange} className="w-full p-2 border rounded mb-2"></textarea>
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Save</button>
          <button onClick={() => { setForm({ name: "", contact: "", address: "" }); setEditingId(null); }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
        </div>
      </div>

      {/* Right Panel - Supplier List */}
      <div className="w-2/3 bg-white p-4 shadow rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Supplier List</h2>
          <div className="relative">
            <input type="text" placeholder="Search suppliers..." className="p-2 border rounded pl-8" onChange={(e) => setSearch(e.target.value)} />
            <FaSearch className="absolute left-2 top-3 text-gray-500" />
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Contact</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSuppliers.map((supplier, index) => (
              <tr key={supplier.id} className="hover:bg-gray-100">
                <td className="p-2 border">{startIndex + index + 1}</td>
                <td className="p-2 border">{supplier.name}</td>
                <td className="p-2 border">{supplier.contact}</td>
                <td className="p-2 border">{supplier.address}</td>
                <td className="p-2 border flex gap-2">
                  <button onClick={() => handleEdit(supplier)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-400"><FaEdit /></button>
                  <button onClick={() => handleDelete(supplier.id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-400"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <span>Showing {Math.min(entriesPerPage, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-500"}`}>
              Previous
            </button>
            <button onClick={() => setPage(page + 1)} disabled={startIndex + entriesPerPage >= filteredSuppliers.length} className={`px-4 py-2 rounded ${startIndex + entriesPerPage >= filteredSuppliers.length ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-500"}`}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierList;
