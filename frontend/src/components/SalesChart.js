import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 900 },
  { day: "Wed", sales: 1100 },
  { day: "Thu", sales: 1600 },
  { day: "Fri", sales: 1400 },
];

const SalesChart = () => {
  return (
    <div className="bg-white p-5 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Sales Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#1D4ED8" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
