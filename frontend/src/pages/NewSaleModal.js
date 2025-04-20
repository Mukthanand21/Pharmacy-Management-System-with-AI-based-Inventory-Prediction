import React, { useEffect, useState } from "react";
import axios from "axios";

const NewSaleModal = ({ onClose }) => {
  const [customers, setCustomers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [saleItems, setSaleItems] = useState([]);
  const [showPay, setShowPay] = useState(false);
  const [amountTendered, setAmountTendered] = useState("");

  useEffect(() => {
    fetchCustomers();
    fetchMedicines();
  }, []);

  const fetchCustomers = async () => {
    const res = await axios.get("http://localhost:5000/customers");
    setCustomers(res.data);
  };

  const fetchMedicines = async () => {
    const res = await axios.get("http://localhost:5000/medicines");
    setMedicines(res.data);
  };

  const handleAddToList = () => {
    const product = medicines.find((m) => m.id === parseInt(selectedMedicine));
    if (!product || quantity <= 0) return;

    const existing = saleItems.find((item) => item.id === product.id);
    if (existing) {
      setSaleItems((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + parseInt(quantity) }
            : item
        )
      );
    } else {
      setSaleItems((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          quantity: parseInt(quantity),
        },
      ]);
    }

    setSelectedMedicine("");
    setQuantity(1);
  };

  const generateReferenceNumber = () => {
    return "SALE-" + Math.floor(100000 + Math.random() * 900000);
  };

  const handlePay = async () => {
    const total = saleItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const change = parseFloat(amountTendered) - total;

    if (!amountTendered || isNaN(amountTendered)) {
      alert("Please enter the amount tendered.");
      return;
    }

    if (change < 0) {
      alert("Amount tendered is less than total.");
      return;
    }

    try {
      const payload = {
        customer_id: parseInt(selectedCustomer),
        reference: generateReferenceNumber(),
        total_amount: total,
        items: saleItems.map((item) => ({
          medicine_id: item.id,
          quantity: item.quantity,
        })),
      };

      await axios.post("http://localhost:5000/sales", payload);
      alert("Sale recorded successfully.");
      setShowPay(false);
      onClose();
    } catch (err) {
      console.error("Error saving sale:", err.response?.data || err.message);
      alert("Error saving sale.");
    }
  };

  const totalAmount = saleItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 w-[700px] rounded-lg shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">New Sale</h2>

        {/* Customer Selection */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Customer</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">-- Select Customer --</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.id}>
                {cust.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Row */}
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div>
            <label className="block font-medium mb-1">Product</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
            >
              <option value="">-- Select Product --</option>
              {medicines.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Qty</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddToList}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            >
              Add to List
            </button>
          </div>
        </div>

        {/* Sale List */}
        <table className="w-full mb-4 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Product</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {saleItems.map((item) => (
              <tr key={item.id}>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total & Pay */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">Total: ₹{totalAmount}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPay(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              disabled={saleItems.length === 0 || !selectedCustomer}
            >
              Pay
            </button>
            <button
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Payment Popup */}
        {showPay && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Payment</h3>
              <p>Total: ₹{totalAmount}</p>
              <div className="mt-3">
                <label className="block mb-1">Amount Tendered</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={amountTendered}
                  onChange={(e) => setAmountTendered(e.target.value)}
                />
              </div>
              <div className="mt-3 text-right">
                <button
                  onClick={handlePay}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2"
                >
                  Pay
                </button>
                <button
                  onClick={() => setShowPay(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewSaleModal;
