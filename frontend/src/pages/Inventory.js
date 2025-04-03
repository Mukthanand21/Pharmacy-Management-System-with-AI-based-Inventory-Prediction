import { useState } from "react";

const Inventory = () => {
  // Sample inventory data (Replace with API data in the future)
  const [inventory, setInventory] = useState([
    { id: 1, name: "Paracetamol", stockIn: 50, stockOut: 10, expired: 2, available: 38 },
    { id: 2, name: "Amoxicillin", stockIn: 40, stockOut: 5, expired: 1, available: 34 },
    { id: 3, name: "Cetirizine", stockIn: 30, stockOut: 8, expired: 0, available: 22 },
    { id: 4, name: "Aspirin", stockIn: 20, stockOut: 3, expired: 2, available: 15 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Filtered data based on search input
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header with Search */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Inventory</h2>
        <input
          type="text"
          placeholder="Search Product..."
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 text-left">S NO.</th>
              <th className="p-3 text-left">Product Name</th>
              <th className="p-3 text-left">Stock In</th>
              <th className="p-3 text-left">Stock Out</th>
              <th className="p-3 text-left">Expired</th>
              <th className="p-3 text-left">Stock Available</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.stockIn}</td>
                  <td className="p-3">{item.stockOut}</td>
                  <td className="p-3">{item.expired}</td>
                  <td className="p-3">{item.available}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
