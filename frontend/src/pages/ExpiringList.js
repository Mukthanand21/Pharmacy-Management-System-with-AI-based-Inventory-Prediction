import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpiringList = () => {
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ medicine_id: "", date_expired: "", quantity: "" });
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchExpiries = async () => {
    const res = await axios.get("http://localhost:5000/expiry-list");
    setExpiringProducts(res.data);
  };

  const fetchMedicines = async () => {
    const res = await axios.get("http://localhost:5000/medicines");
    setMedicines(res.data);
  };

  useEffect(() => {
    fetchExpiries();
    fetchMedicines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/expiry-list/${editId}`, form);
        toast.success("Entry updated successfully!");
      } else {
        await axios.post("http://localhost:5000/expiry-list", form);
        toast.success("New entry added!");
      }
      setForm({ medicine_id: "", date_expired: "", quantity: "" });
      setEditId(null);
      fetchExpiries();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/expiry-list/${id}`);
    toast.info("Entry deleted");
    fetchExpiries();
  };

  const handleEdit = (item) => {
    setForm({
      medicine_id: item.medicine_id,
      date_expired: item.date_expired,
      quantity: item.quantity,
    });
    setEditId(item.id);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ medicine_id: "", date_expired: "", quantity: "" });
    toast.info("Edit cancelled");
  };

  const filteredProducts = expiringProducts.filter((item) =>
    item.product?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 flex-1">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Expiring List</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            required
            className="border p-2 rounded w-full md:w-1/3"
            value={form.medicine_id}
            onChange={(e) => setForm({ ...form, medicine_id: e.target.value })}
          >
            <option value="">Select Medicine</option>
            {medicines.map((med) => (
              <option key={med.id} value={med.id}>
                {med.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            required
            className="border p-2 rounded w-full md:w-1/3"
            value={form.date_expired}
            onChange={(e) => setForm({ ...form, date_expired: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            required
            className="border p-2 rounded w-full md:w-1/3"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
        </div>
        <div className="mt-4 flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editId ? "Update Entry" : "Save Entry"}
          </button>
          {editId && (
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search Bar */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="p-3">S.No</th>
              <th className="p-3">Date Encoded</th>
              <th className="p-3">Date Expired</th>
              <th className="p-3">Product</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.date_encoded}</td>
                  <td className="p-3 text-red-600 font-bold">{item.date_expired}</td>
                  <td className="p-3">{item.product}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No expiring products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpiringList;
