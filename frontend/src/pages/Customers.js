import React, { useState, useEffect } from "react";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/customers/${editId}`, formData);
      } else {
        await axios.post("/customers", formData);
      }
      setFormData({ name: "", contact: "", address: "" });
      setEditId(null);
      fetchCustomers();
    } catch (err) {
      console.error("Error saving customer", err);
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      contact: customer.contact,
      address: customer.address,
    });
    setEditId(customer.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer", err);
    }
  };

  return (
    <div className="flex p-4 gap-6">
      {/* Left Side: Form */}
      <div className="w-1/3 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Customer" : "Add Customer"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Customer Name"
            className="w-full border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Contact"
            className="w-full border p-2 rounded"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            required
          />
          <textarea
            placeholder="Address"
            className="w-full border p-2 rounded"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editId ? "Update" : "Save"}
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => {
                setFormData({ name: "", contact: "", address: "" });
                setEditId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Right Side: Customer List */}
      <div className="w-2/3 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Customer List</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Contact</th>
                <th className="p-2">Address</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust, index) => (
                <tr key={cust.id} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{cust.name}</td>
                  <td className="p-2">{cust.contact}</td>
                  <td className="p-2">{cust.address}</td>
                  <td className="p-2 space-x-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(cust)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(cust.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
