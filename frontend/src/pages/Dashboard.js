import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const Dashboard = () => {
  const [topForecasts, setTopForecasts] = useState([]);
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartType, setChartType] = useState('bar');

  const fetchForecasts = () => {
    axios.get('http://localhost:5000/predict-inventory', {
      params: {
        category,
        start_date: startDate,
        end_date: endDate
      }
    })
      .then(res => {
        const data = res.data;

        const forecastsArray = Object.entries(data).map(([id, item]) => {
          const totalForecast = item.predictions.reduce((sum, row) => sum + row.predicted_sales, 0);
          return {
            medicine_name: item.medicine_name,
            totalForecast: parseFloat(totalForecast.toFixed(2)),
            predictions: item.predictions
          };
        });

        const sortedTop5 = forecastsArray
          .sort((a, b) => b.totalForecast - a.totalForecast)
          .slice(0, 5);

        setTopForecasts(sortedTop5);
      })
      .catch(err => console.error("Error fetching forecast data:", err));
  };

  useEffect(() => {
    fetchForecasts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Top 5 Forecasted Medicines (Next 7 Days)</h2>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Tablet">Tablet</option>
          <option value="Capsule">Capsule</option>
          <option value="Syrup">Syrup</option>
          {/* Add dynamic categories if needed */}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={fetchForecasts}
        >
          Apply Filters
        </button>

        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="ml-auto border px-3 py-2 rounded"
        >
          <option value="bar">Bar Chart</option>
          <option value="area">Area Chart</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-96 mb-10 bg-white border rounded shadow p-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={topForecasts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="medicine_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalForecast" fill="#3b82f6" name="Total Forecast" />
            </BarChart>
          ) : (
            <AreaChart data={topForecasts}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="medicine_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="totalForecast" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Forecast Tables */}
      {topForecasts.map((item, index) => (
        <div key={index} className="mb-10 border border-gray-300 rounded-lg shadow p-4 bg-white">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">
            {item.medicine_name} — Total: {item.totalForecast}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-left">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-2">Forecast Date</th>
                  <th className="p-2">Predicted Sales</th>
                </tr>
              </thead>
              <tbody>
                {item.predictions.map((row, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-100">
                    <td className="p-2">{row.date}</td>
                    <td className="p-2">{row.predicted_sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
