import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const OrdersChart = () => {
  const data = {
    labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"],
    datasets: [
      {
        label: "Orders",
        data: [10, 22, 35, 28, 30, 50, 40],
        backgroundColor: "#F59E0B",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#6B7280" } },
      y: { grid: { color: "#E5E7EB" }, ticks: { color: "#6B7280" } },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-4">Today's Orders by Time</h3>
      <Bar data={data} options={options} />
    </div>
  );
};
