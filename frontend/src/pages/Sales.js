const Sales = () => {
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-lg font-bold mb-4">Sales Report</h2>
      
      <input type="text" placeholder="Search Sales..." className="border p-2 w-full mb-4" />

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="border p-2">S.No</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Reference</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="border p-2">1</td>
            <td className="border p-2">2025-04-04</td>
            <td className="border p-2">#REF1234</td>
            <td className="border p-2">John Doe</td>
            <td className="border p-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded mr-2">Edit</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Sales;
