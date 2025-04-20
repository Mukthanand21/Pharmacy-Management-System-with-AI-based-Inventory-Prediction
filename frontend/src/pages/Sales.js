import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import NewSaleModal from "./NewSaleModal"; // we'll create this next

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/sales");
      setSales(res.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const filteredSales = sales.filter((sale) =>
    sale.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Sales</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <FaPlus /> New Sale
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by reference or customer"
          className="border px-3 py-2 rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sales Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm bg-white">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="p-3 border">S.No</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Reference</th>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale, index) => (
                <tr key={sale.id} className="text-center">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{sale.date}</td>
                  <td className="p-2 border">{sale.reference}</td>
                  <td className="p-2 border">{sale.customer}</td>
                  <td className="p-2 border">₹{sale.total_amount}</td>
                  <td className="p-2 border flex justify-center gap-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 border text-center" colSpan="6">
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Sale Modal */}
      {showModal && (
        <NewSaleModal
          onClose={() => {
            setShowModal(false);
            fetchSales(); // refresh sales list after new sale
          }}
        />
      )}
    </div>
  );
};

export default Sales;
