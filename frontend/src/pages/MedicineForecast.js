import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const MedicineForecast = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/predictions').then((res) => setData(res.data));
  }, []);

  const grouped = data.reduce((acc, row) => {
    (acc[row.medicine_name] = acc[row.medicine_name] || []).push(row);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Forecast by Medicine Name</h2>
      {Object.entries(grouped).map(([name, points], idx) => (
        <div key={idx} className="mb-6">
          <h3 className="text-lg font-semibold">{name}</h3>
          <Line
            data={{
              labels: points.map((d) => d.date),
              datasets: [
                {
                  label: 'Predicted Sales',
                  data: points.map((d) => d.yhat),
                  borderColor: 'rgba(75,192,192,1)',
                  fill: false
                }
              ]
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default MedicineForecast;
