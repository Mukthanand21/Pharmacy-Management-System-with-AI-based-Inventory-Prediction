const StatsCard = ({ title, value, icon }) => {
    return (
      <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-4">
        <div className="text-3xl text-blue-600">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    );
  };
  
  export default StatsCard;
  