export const RecentOrders = () => {
  const orders = [
    { id: "#1234", name: "John Doe", items: "Adobo Combo, Sinigang", status: "completed", price: "₱850" },
    { id: "#1235", name: "Maria Santos", items: "Lechon Kawali, Rice", status: "preparing", price: "₱450" },
    { id: "#1236", name: "Pedro Cruz", items: "Catering Package", status: "pending", price: "₱15,000" },
  ];

  const statusColors = {
    completed: "bg-green-100 text-green-700",
    preparing: "bg-yellow-100 text-yellow-700",
    pending: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-4 text-lg">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-left text-gray-500 text-sm uppercase">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Orders</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition cursor-pointer">
                <td className="px-4 py-3 font-bold">{order.id}</td>
                <td className="px-4 py-3">{order.name}</td>
                <td className="px-4 py-3 text-gray-500 text-sm">{order.items}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-yellow-600">{order.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
