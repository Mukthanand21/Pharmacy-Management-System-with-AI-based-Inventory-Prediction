import StatsCard from "../components/StatsCard";
import SalesChart from "../components/SalesChart";
import RecentOrders from "../components/RecentOrders";
import { FaDollarSign, FaBoxOpen, FaClock, FaClipboardList, FaCapsules } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 flex-1">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-6">
        <StatsCard title="Total Sales" value="$12,000" icon={<FaDollarSign />} />
        <StatsCard title="Low Stock" value="5 Items" icon={<FaBoxOpen />} />
        <StatsCard title="Expiring Soon" value="3 Items" icon={<FaClock />} />
        <StatsCard title="Medicine Categories" value="10 Categories" icon={<FaClipboardList />} />
        <StatsCard title="Medicine Types" value="7 Types" icon={<FaCapsules />} />
      </div>

      {/* Sales Chart & Recent Orders */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <SalesChart />
        <RecentOrders />
      </div>
    </div>
  );
};

export default Dashboard;
