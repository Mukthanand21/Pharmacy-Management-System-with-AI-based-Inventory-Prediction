import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const AIPredictor = () => {
  const [predictions, setPredictions] = useState({});
  const [selectedMedicine, setSelectedMedicine] = useState("all");
  const [interval, setInterval] = useState("7d");
  const [chartType, setChartType] = useState("line");
  const [summary, setSummary] = useState({});
  const [medicineList, setMedicineList] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const intervals = [
    { label: "7 Days", value: "7d" },
    { label: "2 Weeks", value: "2w" },
    { label: "1 Month", value: "1m" },
    { label: "3 Months", value: "3m" },
    { label: "6 Months", value: "6m" }
  ];

  useEffect(() => {
    axios.get("http://localhost:5000/ai-predictor", {
      params: { medicine_id: selectedMedicine, interval }
    }).then((res) => {
      setPredictions(res.data.predictions);
      setSummary(res.data.summary);
    });

    axios.get("http://localhost:5000/medicines-with-sales")
      .then((res) => setMedicineList(res.data));
  }, [selectedMedicine, interval]);

  const chartData = selectedMedicine === "all"
    ? Object.entries(predictions).flatMap(([_, med]) => med.predictions)
    : predictions[selectedMedicine]?.predictions || [];

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="predicted_sales_amount" fill="#8884d8" />
            <Bar dataKey="predicted_quantity" fill="#82ca9d" />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorQ" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="predicted_quantity" stroke="#8884d8" fillOpacity={1} fill="url(#colorQ)" />
          </AreaChart>
        );
      default:
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="predicted_sales_amount" stroke="#00C49F" />
            <Line type="monotone" dataKey="predicted_quantity" stroke="#FF8042" />
          </LineChart>
        );
    }
  };

  const topMedicine = selectedMedicine === "all"
    ? Object.entries(predictions).reduce((top, [_, med]) => {
        const total = med.predictions.reduce((sum, d) => sum + d.predicted_quantity, 0);
        return total > top.total ? { name: med.medicine_name, total } : top;
      }, { name: "-", total: 0 })
    : {
        name: predictions[selectedMedicine]?.medicine_name || "-",
        total: predictions[selectedMedicine]?.predictions?.reduce((sum, d) => sum + d.predicted_quantity, 0) || 0
      };

  const getCardStyle = () => {
    if (topMedicine.total >= 50) return "bg-green-100 text-green-700";
    if (topMedicine.total >= 20) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getTrendArrow = () => {
    if (topMedicine.total >= 50) return "↑";
    if (topMedicine.total >= 20) return "→";
    return "↓";
  };

  const pieData = Object.entries(predictions).slice(0, 6).map(([_, item]) => ({
    name: item.medicine_name,
    value: item.predictions.reduce((sum, d) => sum + d.predicted_quantity, 0)
  }));

  const getFormattedCurrency = (val) => "₹" + val.toLocaleString();

  const buildForecastData = () => {
    const today = new Date();
    const daysMap = { "7d": 7, "2w": 14, "1m": 30, "3m": 90, "6m": 180 };

    if (selectedMedicine === "all") {
      return Object.entries(predictions).map(([_, item]) => {
        let totalQty = 0, totalSales = 0;

        item.predictions.forEach(p => {
          const days = (new Date(p.date) - today) / (1000 * 3600 * 24);
          if (days <= daysMap[interval]) {
            totalQty += p.predicted_quantity;
            totalSales += parseFloat(p.predicted_sales_amount || 0);

          }
        });

        return {
          name: item.medicine_name,
          predicted_quantity: totalQty,
          predicted_sales_amount: totalSales
        };
      });
    } else {
      const item = predictions[selectedMedicine];
      let totalQty = 0, totalSales = 0;

      item?.predictions?.forEach(p => {
        const days = (new Date(p.date) - today) / (1000 * 3600 * 24);
        if (days <= daysMap[interval]) {
          totalQty += p.predicted_quantity;
          totalSales += parseFloat(p.predicted_sales_amount || 0);

        }
      });

      return [{
        name: item?.medicine_name || "-",
        predicted_quantity: totalQty,
        predicted_sales_amount: totalSales
      }];
    }
  };

  const sortedForecastData = () => {
    const data = buildForecastData();
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">AI Sales Predictor</h1>

      <div className="flex gap-4 mb-4">
        <select value={selectedMedicine} onChange={e => setSelectedMedicine(e.target.value)} className="border p-2 rounded">
          <option value="all">All Medicines</option>
          {medicineList.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        <select value={interval} onChange={e => setInterval(e.target.value)} className="border p-2 rounded">
          {intervals.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
        </select>

        <select value={chartType} onChange={e => setChartType(e.target.value)} className="border p-2 rounded">
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="area">Area</option>
        </select>
      </div>

      {selectedMedicine === "all" && (
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-white rounded shadow text-center">
            <h2 className="text-xl text-gray-500">Total Revenue</h2>
            <p className="text-3xl font-bold text-green-700">{getFormattedCurrency(summary.total_revenue || 0)}</p>
            <p className="text-green-500 text-sm">↑ 13% vs previous 7 days</p>
          </div>

          <div className={`p-4 rounded shadow text-center ${getCardStyle()}`}>
            <h2 className="text-xl">Top Predicted Seller</h2>
            <p className="text-2xl font-bold">{topMedicine.name}</p>
            <p className="text-sm">Predicted Qty: {topMedicine.total} {getTrendArrow()}</p>
          </div>

          <div className="p-4 bg-white rounded shadow text-center">
            <h2 className="text-xl text-gray-500">Total Quantity</h2>
            <p className="text-3xl font-bold text-purple-700">{summary.total_quantity}</p>
          </div>
        </div>
      )}

      <div className="h-[400px] bg-white p-4 rounded shadow mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {selectedMedicine === "all" && (
        <div className="h-[300px] bg-white p-4 rounded shadow mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F", "#FF8042"][index % 6]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Forecast Table - {intervals.find(i => i.value === interval)?.label}</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort("name")}>Medicine Name</th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort("predicted_quantity")}>Predicted Quantity</th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort("predicted_sales_amount")}>Predicted Sales</th>
            </tr>
          </thead>
          <tbody>
            {sortedForecastData().map((row, idx) => (
              <tr key={idx} className={`border-t ${idx === 0 ? "bg-green-100 font-semibold" : ""}`}>
                <td className="py-2 px-4">{row.name}</td>
                <td className="py-2 px-4">{row.predicted_quantity}</td>
                <td className="py-2 px-4">{getFormattedCurrency(row.predicted_sales_amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AIPredictor;
