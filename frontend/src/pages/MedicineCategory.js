import { useEffect, useState } from "react";
import axios from "axios";

const MedicineCategory = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ✅ Load Categories from Backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Add or Update Category
  const handleSave = async () => {
    if (!category.trim()) return;

    try {
      if (editingId) {
        // Update existing category
        await axios.put(`http://localhost:5000/categories/${editingId}`, {
          name: category,
        });
      } else {
        // Add new category
        await axios.post("http://localhost:5000/categories", { name: category });
      }

      setCategory("");
      setEditingId(null);
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // ✅ Edit Category
  const handleEdit = (cat) => {
    setCategory(cat.name);
    setEditingId(cat.id);
  };

  // ✅ Delete Category
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg flex gap-6">
      {/* Left: Category Form */}
      <div className="w-1/3 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-4">
          {editingId ? "Edit" : "Add"} Medicine Category
        </h2>
        <input
          type="text"
          placeholder="Category Name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? "Update" : "Save"}
          </button>
          <button
            onClick={() => {
              setCategory("");
              setEditingId(null);
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Right: Category List */}
      <div className="w-2/3">
        <h2 className="text-lg font-bold mb-4">Category List</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        {/* Category Table */}
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border p-2">S.No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories
              .filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()))
              .map((cat, index) => (
                <tr key={cat.id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{cat.name}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
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
          <button className="bg-gray-500 text-white px-4 py-2 rounded">Previous</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded">Next</button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCategory;
