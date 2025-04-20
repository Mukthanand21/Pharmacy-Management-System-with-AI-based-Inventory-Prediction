import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Line, Bar
} from 'react-chartjs-2';

const ForecastDashboard = () => {
  const [forecast, setForecast] = useState([]);
  const [category, setCategory] = useState('');
  const [medicine, setMedicine] = useState('');
  const [chartType, setChartType] = useState('line');

  const fetchForecast = async () => {
    const res = await axios.get('http://localhost:5000/api/forecast', {
      params: {
        category,
        name: medicine,
      },
    });
    setForecast(res.data);
  };

  useEffect(() => {
    fetchForecast();
  }, [category, medicine]);

  const groupByMedicine = forecast.reduce((acc, item) => {
    const name = item.medicine_name;
    acc[name] = acc[name] || [];
    acc[name].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sales Forecast Dashboard</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Filter by medicine name"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2"
        />
        <select
          onChange={(e) => setChartType(e.target.value)}
          value={chartType}
          className="border p-2"
        >
          <option value="line">Line</option>
          <option value="bar">Bar</option>
        </select>
      </div>

      {Object.entries(groupByMedicine).map(([name, data], index) => {
        const chartData = {
          labels: data.map(item => item.ds),
          datasets: [{
            label: `Forecast for ${name}`,
            data: data.map(item => item.yhat),
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'teal',
          }],
        };

        const chartOptions = {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
          },
        };

        return (
          <div key={index} className="mb-8 bg-white p-4 shadow">
            {chartType === 'line' ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ForecastDashboard;
