import { useEffect, useState } from "react";
import axios from "axios";

const Receiving = () => {
  const [receivings, setReceivings] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    medicine_id: "",
    supplier_id: "",
    quantity: "",
    received_date: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [receivingRes, supplierRes, medicineRes] = await Promise.all([
      axios.get("/receivings"),
      axios.get("/suppliers"),
      axios.get("/medicines"),
    ]);
    setReceivings(receivingRes.data);
    setSuppliers(supplierRes.data);
    setMedicines(medicineRes.data);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting:", formData);

    try {
      const payload = { ...formData };

      if (formData.id) {
        // Edit
        await axios.put(`/receivings/${formData.id}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // Create
        await axios.post("/receivings", payload, {
          headers: { "Content-Type": "application/json" },
        });
      }

      setFormData({ id: null, medicine_id: "", supplier_id: "", quantity: "", received_date: "" });
      fetchData();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (item) => {
    const formattedDate = new Date(item.received_date).toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm

    setFormData({
      id: item.id,
      medicine_id: item.medicine_id,
      supplier_id: item.supplier_id,
      quantity: item.quantity,
      received_date: formattedDate,
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`/receivings/${id}`);
    fetchData();
  };

  const filteredReceivings = receivings.filter((r) =>
    r.medicine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Receiving Report</h2>

      {/* Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <select
            name="supplier_id"
            value={formData.supplier_id}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            name="medicine_id"
            value={formData.medicine_id}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="">Select Medicine</option>
            {medicines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />

          <input
            type="datetime-local"
            name="received_date"
            value={formData.received_date}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {formData.id ? "Update Receiving" : "Add Receiving"}
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Receiving..."
        className="border p-2 w-full mb-4"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 border">S.No</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Medicine</th>
              <th className="p-2 border">Supplier</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceivings.length > 0 ? (
              filteredReceivings.map((r, idx) => (
                <tr key={r.id} className="text-center border-t">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{r.received_date}</td>
                  <td className="p-2 border">{r.medicine_name}</td>
                  <td className="p-2 border">{r.supplier_name}</td>
                  <td className="p-2 border">{r.quantity}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-gray-500 p-4 text-center">
                  No receiving entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button className="bg-gray-500 text-white px-4 py-2 rounded">Previous</button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
};

export default Receiving;
