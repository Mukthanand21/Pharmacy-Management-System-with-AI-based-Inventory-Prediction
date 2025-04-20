import { useState, useEffect } from "react";
import axios from "axios";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const [inventoryRes, medicinesRes] = await Promise.all([
        axios.get("/inventory/summary"),
        axios.get("/medicines")
      ]);

      const inventoryData = inventoryRes.data;
      const medicineList = medicinesRes.data;

      // Merge inventory data with medicine name
      const merged = inventoryData.map((item) => {
        const med = medicineList.find((m) => m.id === item.medicine_id);
        return {
          id: item.id,
          name: med ? med.name : "Unknown",
          stock_in: item.stock_in,
          stock_out: item.stock_out,
          expired: item.expired,
          stock_available: item.stock_available,
        };
      });

      setMedicines(medicineList);
      setInventory(merged);
    } catch (error) {
      console.error("Error fetching inventory:", error.message || error);
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Inventory</h2>
        <input
          type="text"
          placeholder="Search Product..."
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 text-left">S.NO.</th>
              <th className="p-3 text-left">Product Name</th>
              <th className="p-3 text-left">Stock IN</th>
              <th className="p-3 text-left">Stock OUT</th>
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
                  <td className="p-3">{item.stock_in}</td>
                  <td className="p-3">{item.stock_out}</td>
                  <td className="p-3">{item.expired}</td>
                  <td className="p-3">{item.stock_available}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No Inventory Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button className="bg-gray-500 text-white px-4 py-2 rounded">Previous</button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
};

export default Inventory;
