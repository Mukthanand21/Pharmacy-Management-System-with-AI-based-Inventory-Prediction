import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState({
    total_medicines: 0,
    sales_today: 0,
    revenue_today: 0,
    expiring_soon: 0,
    low_stock: 0,
    forecast: []
  });

  const [salesTrend, setSalesTrend] = useState([]);
  const [forecastChart, setForecastChart] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [expiryAlerts, setExpiryAlerts] = useState([]);
  const [lowStockWarnings, setLowStockWarnings] = useState([]);

  const [showAll, setShowAll] = useState(false);
  const visibleAlerts = showAll ? expiryAlerts : expiryAlerts.slice(0, 5);
  const [showExpiryAlerts, setShowExpiryAlerts] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);
  const [showTop3Forecast, setShowTop3Forecast] = useState(true);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingSalesTrend, setLoadingSalesTrend] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [loadingTopSelling, setLoadingTopSelling] = useState(true);
  const [loadingExpiry, setLoadingExpiry] = useState(true);
  const [loadingLowStock, setLoadingLowStock] = useState(true);

  const [animatedCounts, setAnimatedCounts] = useState({
    total_medicines: 0,
    sales_today: 0,
    revenue_today: 0,
    expiring_soon: 0,
    low_stock: 0
  });

  useEffect(() => {
    const animateCount = (target, key) => {
      let start = 0;
      const step = () => {
        start += Math.ceil((target - start) / 10);
        if (start >= target) start = target;
        setAnimatedCounts(prev => ({ ...prev, [key]: start }));
        if (start < target) requestAnimationFrame(step);
      };
      step();
    };

    axios.get('http://localhost:5000/api/dashboard')
      .then(res => {
        setData(res.data);
        animateCount(res.data.total_medicines, 'total_medicines');
        animateCount(res.data.sales_today, 'sales_today');
        animateCount(res.data.revenue_today, 'revenue_today');
        animateCount(res.data.expiring_soon, 'expiring_soon');
        animateCount(res.data.low_stock, 'low_stock');
      })
      .catch(err => console.error('Dashboard data error:', err))
      .finally(() => setLoadingStats(false));

    axios.get('http://localhost:5000/api/dashboard/sales-trend')
      .then(res => setSalesTrend(res.data))
      .catch(err => console.error('Sales trend error:', err))
      .finally(() => setLoadingSalesTrend(false));

    axios.get('http://localhost:5000/api/dashboard/inventory-forecast')
      .then(res => setForecastChart(res.data.slice(0, 5)))
      .catch(err => console.error('Forecast error:', err))
      .finally(() => setLoadingForecast(false));

    axios.get('http://localhost:5000/api/dashboard/top-selling')
      .then(res => setTopSelling(res.data))
      .catch(err => console.error('Top selling error:', err))
      .finally(() => setLoadingTopSelling(false));

    axios.get('http://localhost:5000/api/dashboard/expiry-alerts')
      .then(res => setExpiryAlerts(res.data))
      .catch(err => console.error('Expiry alert error:', err))
      .finally(() => setLoadingExpiry(false));

    axios.get('http://localhost:5000/api/dashboard/low-stock-warnings')
      .then(res => setLowStockWarnings(res.data))
      .catch(err => console.error('Low stock warning error:', err))
      .finally(() => setLoadingLowStock(false));
  }, []);

  return (
    <div className="p-6 bg-[#f3fefb] min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Pharmacy Dashboard</h1>

      {/* Stat Cards */}
      {loadingStats ? (
        <LoadingBlock />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card title="Total Medicines" value={animatedCounts.total_medicines} color="purple" />
          <Card title="Sales Today" value={animatedCounts.sales_today} color="green" />
          <Card title="Revenue Today" value={`₹ ${animatedCounts.revenue_today?.toFixed(2)}`} color="blue" />
          <Card title="Low Stock" value={animatedCounts.low_stock} color="yellow" />
          <Card title="Expiring Soon" value={animatedCounts.expiring_soon} color="red" />
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            showExpiryAlerts ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'
          }`}
          onClick={() => setShowExpiryAlerts(prev => !prev)}
        >
          <span className="animate-pulse text-xl">⚠️</span>
          {showExpiryAlerts ? 'Hide' : 'Show'} Expiry Alerts
        </button>
        <button
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            showLowStock ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-600'
          }`}
          onClick={() => setShowLowStock(prev => !prev)}
        >
          <span className="animate-pulse text-xl">⚠️</span>
          {showLowStock ? 'Hide' : 'Show'} Low Stock Warnings
        </button>
        <button
          className={`px-4 py-2 rounded ${showTop3Forecast ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'}`}
          onClick={() => setShowTop3Forecast(prev => !prev)}
        >
          {showTop3Forecast ? 'Hide' : 'Show'} Top 3 Forecast Table
        </button>
      </div>

      {/* Expiry Alerts */}
      {showExpiryAlerts && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-red-600 mb-4">⚠️ Expiry Alerts (Next 15 Days)</h2>
          {loadingExpiry ? <LoadingBlock /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2">
              {expiryAlerts.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 border rounded-lg shadow-md ${item.days_left < 5 ? 'bg-red-100 border-red-400' : 'bg-yellow-50 border-yellow-400'}`}
                >
                  <div className="text-2xl mr-4 animate-pulse">💊</div>
                  <div>
                    <h3 className="font-semibold">{item.medicine_name}</h3>
                    <p className="text-sm">Expiry: {item.expiry_date}</p>
                    <p className={`text-sm font-semibold ${item.days_left < 5 ? 'text-red-700' : 'text-yellow-700'}`}>
                      {item.days_left < 0 ? `Expired ${-item.days_left} day(s) ago` : `${item.days_left} day(s) left`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Low Stock Warnings */}
      {showLowStock && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-yellow-700 mb-4">⚠️ Low Stock Warnings</h2>
          {loadingLowStock ? <LoadingBlock /> : (
            lowStockWarnings.length === 0 ? (
              <p className="text-gray-600">No low stock medicines found.</p>
            ) : (
              <table className="w-full text-sm text-left border">
                <thead className="bg-yellow-100 text-yellow-800">
                  <tr>
                    <th className="px-4 py-2 border">Medicine</th>
                    <th className="px-4 py-2 border">Stock</th>
                    <th className="px-4 py-2 border">Forecasted Demand</th>
                    <th className="px-4 py-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockWarnings.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-yellow-50">
                      <td className="px-4 py-2 border">{item.medicine_name}</td>
                      <td className="px-4 py-2 border">{item.stock}</td>
                      <td className="px-4 py-2 border">{item.forecasted_demand}</td>
                      <td className={`px-4 py-2 border font-semibold ${item.is_critical ? 'text-red-600' : 'text-yellow-600'}`}>
                        {item.is_critical ? 'CRITICAL' : 'Low'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      )}

      {/* Top 3 Forecast Table */}
      {showTop3Forecast && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Top 3 Medicines - Forecast (Next 7 Days)</h2>
          {loadingStats ? <LoadingBlock /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border">
                <thead className="bg-green-100 text-green-800">
                  <tr>
                    <th className="px-4 py-2 border">Medicine</th>
                    <th className="px-4 py-2 border">Predicted Quantity</th>
                    <th className="px-4 py-2 border">Predicted Sales (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.forecast.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-green-50">
                      <td className="px-4 py-2 border">{item.medicine_name}</td>
                      <td className="px-4 py-2 border">{item.predicted_quantity}</td>
                      <td className="px-4 py-2 border">₹ {item.predicted_sales_amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  {data.forecast.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center text-gray-500 py-4">No forecast data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartCard title="📈 Sales Trend (Last 30 Days)" color="blue">
          {loadingSalesTrend ? <LoadingBlock /> : (
            <Line
              data={{
                labels: salesTrend.map(d => d.date),
                datasets: [{
                  label: 'Total Sales (₹)',
                  data: salesTrend.map(d => d.amount),
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  fill: true
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 1500,
                  easing: 'easeInOutQuart'
                },
                plugins: {
                  tooltip: {
                    mode: 'index',
                    intersect: false
                  }
                },
                hover: {
                  mode: 'nearest',
                  intersect: true
                }
              }}
            />
            
          )}
        </ChartCard>

        <ChartCard title="📦 Inventory Forecast (Top 5 Medicines)" color="orange">
          {loadingForecast ? <LoadingBlock /> : (
            <Bar
              data={{
                labels: forecastChart.map(f => f.medicine),
                datasets: [{
                  label: 'Predicted Quantity',
                  data: forecastChart.map(f => f.quantity),
                  backgroundColor: '#f59e0b'
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 1200,
                  easing: 'easeOutBack'
                },
                plugins: {
                  tooltip: {
                    mode: 'index',
                    intersect: false
                  }
                }
              }}
            />
            
          )}
        </ChartCard>
      </div>

      {/* Top Selling Medicines */}
      <div className="grid grid-cols-1 mb-6">
        <ChartCard title="🔥 Top Selling Medicines" color="red">
          {loadingTopSelling ? <LoadingBlock /> : (
            <Bar
              data={{
                labels: topSelling.map(m => m.medicine),
                datasets: [{
                  label: 'Units Sold',
                  data: topSelling.map(m => m.quantity),
                  backgroundColor: '#ef4444'
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y'
              }}
            />
          )}
        </ChartCard>
      </div>
    </div>
  );
};

// Stat Card Component
const Card = ({ title, value, color }) => (
  <div className={`bg-white rounded-lg shadow p-4 border-l-4 border-${color}-500`}>
    <h2 className="text-sm font-medium text-gray-500">{title}</h2>
    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
  </div>
);

// Chart Card Wrapper
const ChartCard = ({ title, color, children }) => (
  <div className="bg-white rounded-lg shadow-md p-4 h-[350px]">
    <h2 className={`text-lg font-semibold text-${color}-600 mb-2`}>{title}</h2>
    <div className="h-[280px]">{children}</div>
  </div>
);

// Spinner Block Component
const LoadingBlock = () => (
  <div className="flex justify-center items-center h-[200px]">
    <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default Dashboard;
