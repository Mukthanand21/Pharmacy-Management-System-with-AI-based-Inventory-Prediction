import { useEffect, useState } from "react";
import axios from "axios";

const MedicineTypes = () => {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ✅ Load all types from backend
  const fetchTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/types");
      setTypes(res.data);
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // ✅ Add or Update Type
  const handleSave = async () => {
    if (!newType.trim()) return;

    try {
      if (editingId) {
        // Update
        await axios.put(`http://localhost:5000/types/${editingId}`, {
          name: newType,
        });
      } else {
        // Add
        await axios.post("http://localhost:5000/types", {
          name: newType,
        });
      }

      setNewType("");
      setEditingId(null);
      fetchTypes();
    } catch (err) {
      console.error("Error saving type:", err);
    }
  };

  // ✅ Start editing
  const handleEdit = (type) => {
    setNewType(type.name);
    setEditingId(type.id);
  };

  // ✅ Delete a type
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/types/${id}`);
      fetchTypes();
    } catch (err) {
      console.error("Error deleting type:", err);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6 bg-white shadow-lg rounded-lg">
      {/* Medicine Type Form */}
      <div className="col-span-1 bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">
          {editingId ? "Edit" : "Add"} Medicine Type
        </h2>
        <label className="block mb-2">Type</label>
        <input
          type="text"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Enter medicine type"
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update" : "Save"}
          </button>
          <button
            onClick={() => {
              setNewType("");
              setEditingId(null);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Medicine Type List */}
      <div className="col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Medicine Type List</h2>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-1/3"
          />
        </div>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border p-2">S.No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {types
              .filter((type) =>
                type.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((type, index) => (
                <tr key={type.id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{type.name}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(type)}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination (Optional Placeholder) */}
        <div className="flex justify-between mt-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Previous
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineTypes;
