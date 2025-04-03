const orders = [
    { id: 1, customer: "John Doe", total: "$45", status: "Completed" },
    { id: 2, customer: "Jane Smith", total: "$30", status: "Pending" },
  ];
  
  const RecentOrders = () => {
    return (
      <div className="bg-white p-5 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Recent Orders</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2">Customer</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-2">{order.customer}</td>
                <td className="p-2">{order.total}</td>
                <td className="p-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default RecentOrders;
  