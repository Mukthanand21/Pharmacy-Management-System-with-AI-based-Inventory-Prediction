import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const MedicalList = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    sku: "",
    category_id: "",
    type_id: "",
    name: "",
    measurement: "",
    description: "",
    price: "",
    stock: 0,
  });

  // Fetch categories, types, and medicines
  useEffect(() => {
    axios.get("/categories").then((res) => setCategories(res.data));
    axios.get("/types").then((res) => setTypes(res.data));
    fetchMedicines();
  }, []);

  const fetchMedicines = () => {
    axios.get("/medicines").then((res) => setProducts(res.data));
  };

  const handleInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    const endpoint = editingId ? `/medicines/${editingId}` : "/medicines";
    const method = editingId ? "put" : "post";

    if (!form.name || !form.sku || !form.category_id || !form.type_id)
      return alert("All fields are required!");

    axios[method](endpoint, form).then(() => {
      fetchMedicines();
      setForm({
        sku: "",
        category_id: "",
        type_id: "",
        name: "",
        measurement: "",
        description: "",
        price: "",
        stock: 0,
      });
      setEditingId(null);
    });
  };

  const handleEdit = (product) => {
    setForm({
      sku: product.sku,
      category_id: categories.find((c) => c.name === product.category)?.id || "",
      type_id: types.find((t) => t.name === product.type)?.id || "",
      name: product.name,
      measurement: product.measurement || "",
      description: product.description || "",
      price: product.price,
      stock: product.stock || 0,
    });
    setEditingId(product.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios.delete(`/medicines/${id}`).then(fetchMedicines);
    }
  };

  const getCategoryName = (id) =>
    categories.find((c) => c.id === id)?.name || "N/A";

  const getTypeName = (id) => types.find((t) => t.id === id)?.name || "N/A";

  return (
    <div className="p-6 bg-gray-100 flex gap-6">
      {/* Left Panel - Form */}
      <div className="w-1/3 bg-white p-4 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        />

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          name="type_id"
          value={form.type_id}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">Select Type</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="text"
          name="measurement"
          placeholder="Measurement"
          value={form.measurement}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            {editingId ? "Update" : "Save"}
          </button>
          <button
            onClick={() => {
              setForm({
                sku: "",
                category_id: "",
                type_id: "",
                name: "",
                measurement: "",
                description: "",
                price: "",
                stock: 0,
              });
              setEditingId(null);
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Right Panel - Product List */}
      <div className="w-2/3 bg-white p-4 shadow rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Product List</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 border rounded pl-8"
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-2 top-3 text-gray-500" />
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Product Info</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="p-2 border">{product.id}</td>
                  <td className="p-2 border">
                    <div className="text-sm font-semibold">
                      {product.name} ({product.sku})
                    </div>
                    <div className="text-xs text-gray-600">
                      {product.category} - {product.description}
                    </div>
                  </td>
                  <td className="p-2 border">{product.type}</td>
                  <td className="p-2 border">₹{product.price}</td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-400"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-400"
                    >
                      <FaTrash />
                    </button>
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
