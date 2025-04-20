import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockAlert = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const res = await axios.get('http://localhost:5000/api/alerts');
      setAlerts(res.data);
    };
    fetchAlerts();
  }, []);

  return (
    <div className="p-4 bg-red-50 border-l-4 border-red-500">
      <h2 className="text-lg font-semibold mb-2 text-red-700">⚠️ Low Stock Alerts</h2>
      <ul className="list-disc pl-5">
        {alerts.map(alert => (
          <li key={alert.id}>
            {alert.name} ({alert.category}) – Only {alert.stock} units left!
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockAlert;
