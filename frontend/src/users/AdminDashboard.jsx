import axios from "axios";
import { motion } from "framer-motion";
import { MessageSquare, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardHeader } from "../ui/DashboardHeader";
import { DashboardSidebar } from "../ui/DashboardSidebar";
import { OrdersChart } from "../ui/OrdersChart";
import { RecentOrders } from "../ui/RecentOrders";
import { SalesChart } from "../ui/SalesChart";
import { StatsCard } from "../ui/StatsCard";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/dashboard/stats");
        setStats(res.data);

        const ordersRes = await axios.get(
          "http://localhost:5000/dashboard/recent-orders"
        );
        setRecentOrders(ordersRes.data || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };
    loadDashboard();
  }, []);

  const getChangePercent = (current, previous) => {
    current = Number(current || 0);
    previous = Number(previous || 0);
    if (previous === 0 && current === 0) return "0%";
    if (previous === 0) return "+100%";
    const percent = ((current - previous) / previous) * 100;
    return (percent > 0 ? "+" : "") + percent.toFixed(1) + "%";
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <DashboardSidebar />
      <div className="pl-64 transition-all duration-300">
        <DashboardHeader />

        <motion.main
          key="dashboard-content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="p-6 space-y-6"
        >
          {/* Loading Skeleton */}
          {!stats && (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {stats && (
            <>
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Dashboard Overview
                </h1>
                <p className="text-gray-500">
                  Welcome back! Here's what's happening today.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Today's total Orders"
                  value={stats.totalOrders}
                  change={
                    getChangePercent(
                      stats.totalOrders,
                      stats.totalOrdersPrevious
                    ) + " from yesterday"
                  }
                  changeType={
                    stats.totalOrders >= stats.totalOrdersPrevious
                      ? "positive"
                      : "negative"
                  }
                  icon={ShoppingCart}
                  iconColor="bg-yellow-400"
                />
                <StatsCard
                  title="Customers"
                  value={stats.totalCustomers}
                  change={
                    getChangePercent(
                      stats.totalCustomers,
                      stats.totalCustomersPrevious
                    ) + " from last week"
                  }
                  changeType={
                    stats.totalCustomers >= stats.totalCustomersPrevious
                      ? "positive"
                      : "negative"
                  }
                  icon={Users}
                  iconColor="bg-blue-400"
                />
                <StatsCard
                  title="Revenue Today"
                  value={`₱${stats.todayRevenue}`}
                  change={
                    getChangePercent(
                      stats.todayRevenue,
                      stats.revenuePrevious
                    ) + " from yesterday"
                  }
                  changeType={
                    stats.todayRevenue >= stats.revenuePrevious
                      ? "positive"
                      : "negative"
                  }
                  icon={TrendingUp}
                  iconColor="bg-green-500"
                />
                <StatsCard
                  title="Feedback"
                  value={stats.averageFeedback}
                  change={
                    getChangePercent(
                      stats.averageFeedback,
                      stats.feedbackPrevious
                    ) + " satisfaction"
                  }
                  changeType={
                    stats.averageFeedback >= stats.feedbackPrevious
                      ? "positive"
                      : "negative"
                  }
                  icon={MessageSquare}
                  iconColor="bg-orange-400"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesChart />
                <OrdersChart />
              </div>

              <RecentOrders orders={recentOrders} />
            </>
          )}
        </motion.main>
      </div>
    </div>
  );
};

export default AdminDashboard;
