import { useState } from "react";

const ExpiringList = () => {
  // Sample data for testing
  const [expiringProducts, setExpiringProducts] = useState([
    { id: 1, dateEncoded: "2025-03-01", dateExpired: "2025-06-01", product: "Paracetamol", qty: 10 },
    { id: 2, dateEncoded: "2025-02-15", dateExpired: "2025-05-15", product: "Ibuprofen", qty: 5 },
  ]);

  const [search, setSearch] = useState("");

  // Function to delete an item
  const handleDelete = (id) => {
    const updatedList = expiringProducts.filter((item) => item.id !== id);
    setExpiringProducts(updatedList);
  };

  // Filtered products based on search query
  const filteredProducts = expiringProducts.filter((item) =>
    item.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 flex-1">
      <h1 className="text-2xl font-bold mb-4">Expiring List</h1>

      {/* Search & New Entry Button */}
      <div className="flex justify-between mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + New Entry
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Expiring List Table */}
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
                  <td className="p-3">{item.dateEncoded}</td>
                  <td className="p-3 text-red-600 font-bold">{item.dateExpired}</td>
                  <td className="p-3">{item.product}</td>
                  <td className="p-3">{item.qty}</td>
                  <td className="p-3">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
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

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Previous</button>
        <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Next</button>
      </div>
    </div>
  );
};

export default ExpiringList;
