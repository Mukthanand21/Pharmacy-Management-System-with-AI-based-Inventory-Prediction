// ... imports remain unchanged
import React, { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryPredictor = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortField, setSortField] = useState("medicine_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [forecastDuration, setForecastDuration] = useState(7);
  const alertsShown = useRef(new Set());

  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`http://localhost:5000/ai-inventory-predictor?days=${forecastDuration}`)
      .then((res) => res.json())
      .then((data) => {
        const withTrends = data.inventory_predictions.map((item) => ({
          ...item,
          stock_trend: generateDummyTrend(item.available_stock, forecastDuration),
        }));
        setData(withTrends);

        withTrends.forEach((item) => {
          const alertKeyRestock = `restock-${item.medicine_id}`;
          const alertKeyExpiry = `expiry-${item.medicine_id}`;

          if (item.status === "Restock Needed" && !alertsShown.current.has(alertKeyRestock)) {
            toast.warn(`${item.medicine_name} needs restocking!`, { autoClose: 3000 });
            alertsShown.current.add(alertKeyRestock);
          }

          if (item.expiry_alert && !alertsShown.current.has(alertKeyExpiry)) {
            toast.error(`${item.medicine_name} is expiring soon!`, { autoClose: 3000 });
            alertsShown.current.add(alertKeyExpiry);
          }
        });
      });
  }, [forecastDuration]);

  const generateDummyTrend = (stock, duration) => {
    const trend = [];
    for (let i = 0; i < duration; i++) {
      trend.push({
        date: `2024-04-${String(13 + i).padStart(2, "0")}`,
        stock: Math.max(0, stock - Math.floor(Math.random() * 10 * i)),
      });
    }
    return trend;
  };

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilterChange = (e) => setFilter(e.target.value);
  const handleExport = () => setShowExportModal(true);
  const closeExportModal = () => setShowExportModal(false);

  const handleSort = (field) => {
    const order = field === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const filteredData = data.filter((item) => {
    const matchSearch = item.medicine_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ||
      (filter === "Restock Needed" && item.status === "Restock Needed") ||
      (filter === "Overstock" && item.overstock_alert);
    return matchSearch && matchFilter;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    renderBarChart();
    renderAreaChart();
  }, [filteredData]);

  const renderBarChart = () => {
    const ctx = document.getElementById("barChart")?.getContext("2d");
    if (!ctx) return;
    if (window.barChart instanceof Chart) window.barChart.destroy();

    const top5 = [...filteredData]
      .sort((a, b) => b.predicted_demand - a.predicted_demand)
      .slice(0, 5);

    window.barChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: top5.map((item) => item.medicine_name),
        datasets: [
          {
            label: "Available Stock",
            data: top5.map((item) => item.available_stock),
            backgroundColor: "#60a5fa",
          },
          {
            label: "Predicted Demand",
            data: top5.map((item) => item.predicted_demand),
            backgroundColor: "#f87171",
          },
        ],
      },
    });
  };

  const renderAreaChart = () => {
    const ctx = document.getElementById("areaChart")?.getContext("2d");
    if (!ctx) return;
    if (window.areaChart instanceof Chart) window.areaChart.destroy();

    const grouped = {};
    filteredData.forEach((item) => {
      item.stock_trend?.forEach(({ date, stock }) => {
        if (!grouped[date]) grouped[date] = 0;
        grouped[date] += stock;
      });
    });

    const sortedDates = Object.keys(grouped).sort();
    const trendData = sortedDates.map((date) => grouped[date]);

    window.areaChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: sortedDates,
        datasets: [
          {
            label: "Stock Trend",
            fill: true,
            backgroundColor: "rgba(96,165,250,0.3)",
            borderColor: "#3b82f6",
            data: trendData,
            tension: 0.4,
          },
        ],
      },
    });
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded w-full sm:w-64"
        />
        <select value={filter} onChange={handleFilterChange} className="p-2 border rounded">
          <option>All</option>
          <option>Restock Needed</option>
          <option>Overstock</option>
        </select>
        <select
          value={forecastDuration}
          onChange={(e) => setForecastDuration(Number(e.target.value))}
          className="p-2 border rounded"
        >
          <option value={7}>7 Days</option>
          <option value={30}>1 Month</option>
          <option value={90}>3 Months</option>
        </select>
        <button onClick={handleExport} className="bg-blue-500 text-white px-4 py-2 rounded">
          Export Filtered
        </button>
      </div>

      {/* Table with expiry column */}
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3">Medicine</th>
              <th className="p-3">Available</th>
              <th className="p-3">Predicted</th>
              <th className="p-3">Shortage</th>
              <th className="p-3">Status</th>
              <th className="p-3">Expiry Alert</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.medicine_id} className="border-b">
                <td className="p-3">{item.medicine_name}</td>
                <td className="p-3">{item.available_stock}</td>
                <td className="p-3">{item.predicted_demand}</td>
                <td className="p-3">{item.shortage}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      item.status === "Restock Needed" ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3">
                  {item.expiry_alert ? (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded">Expiring Soon</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end mt-4 px-4 py-2 gap-2">
          {Array.from({ length: Math.ceil(sortedData.length / itemsPerPage) }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div>
          <h3 className="text-lg font-semibold mb-2">Top 5 Medicines (Bar Chart)</h3>
          <canvas id="barChart" height="200"></canvas>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Stock Trend (Area Chart)</h3>
          <canvas id="areaChart" height="200"></canvas>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Export Filtered Data</h2>
            <pre className="text-xs bg-gray-100 p-2 h-40 overflow-y-scroll rounded mb-4">
              {JSON.stringify(filteredData, null, 2)}
            </pre>
            <div className="flex justify-end gap-2">
              <button onClick={closeExportModal} className="px-4 py-2 bg-gray-300 rounded">
                Close
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(filteredData, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "filtered_inventory.json";
                  link.click();
                  closeExportModal();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPredictor;
