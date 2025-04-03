import { useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const MedicalList = () => {
  // Dummy data for dropdowns (Replace with API later)
  const medicineCategories = ["Painkiller", "Antibiotic", "Antiseptic"];
  const medicineTypes = ["Tablet", "Capsule", "Syrup", "Injection"];

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([
    { id: 1, sku: "MD001", category: "Painkiller", type: "Tablet", name: "Paracetamol", description: "For fever & pain relief", price: 50, warning: "" },
    { id: 2, sku: "MD002", category: "Antibiotic", type: "Capsule", name: "Amoxicillin", description: "Requires prescription", price: 120, warning: "⚠ Prescription Required" },
  ]);

  const [form, setForm] = useState({ sku: "", category: "", type: "", name: "", measurement: "", description: "", price: "" });

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!form.name || !form.sku || !form.category || !form.type) return alert("All fields are required!");
    setProducts([...products, { id: products.length + 1, ...form, warning: form.description.includes("prescription") ? "⚠ Prescription Required" : "" }]);
    setForm({ sku: "", category: "", type: "", name: "", measurement: "", description: "", price: "" });
  };

  return (
    <div className="p-6 bg-gray-100 flex gap-6">
      {/* Left Panel - Form */}
      <div className="w-1/3 bg-white p-4 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <input type="text" name="sku" placeholder="SKU" value={form.sku} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
        
        {/* Category Dropdown */}
        <select name="category" value={form.category} onChange={handleInputChange} className="w-full p-2 border rounded mb-2">
          <option value="">Select Category</option>
          {medicineCategories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Type Dropdown */}
        <select name="type" value={form.type} onChange={handleInputChange} className="w-full p-2 border rounded mb-2">
          <option value="">Select Type</option>
          {medicineTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>

        <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
        <input type="text" name="measurement" placeholder="Measurement" value={form.measurement} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleInputChange} className="w-full p-2 border rounded mb-2"></textarea>
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Save</button>
          <button onClick={() => setForm({ sku: "", category: "", type: "", name: "", measurement: "", description: "", price: "" })} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
        </div>
      </div>

      {/* Right Panel - Product List */}
      <div className="w-2/3 bg-white p-4 shadow rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Product List</h2>
          <div className="relative">
            <input type="text" placeholder="Search..." className="p-2 border rounded pl-8" onChange={(e) => setSearch(e.target.value)} />
            <FaSearch className="absolute left-2 top-3 text-gray-500" />
          </div>
        </div>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Product Info</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
              .map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">
                    <div className="text-sm font-semibold">{product.name} ({product.sku})</div>
                    <div className="text-xs text-gray-600">{product.category} - {product.description}</div>
                    {product.warning && <div className="text-yellow-500 text-xs font-bold">{product.warning}</div>}
                  </td>
                  <td className="p-2 border">{product.type}</td>
                  <td className="p-2 border">${product.price}</td>
                  <td className="p-2 border flex gap-2">
                    <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-400"><FaEdit /></button>
                    <button className="bg-red-500 text-white p-2 rounded hover:bg-red-400"><FaTrash /></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicalList;
