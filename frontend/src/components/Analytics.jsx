import {
  DollarSign,
  ShoppingCart,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  fetchKeyMetrics,
  fetchRevenueTrend,
  fetchSalesByCategory,
  fetchTopItems,
} from "../api/AnalyticsAPI";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { DashboardHeader } from "../ui/DashboardHeader";
import { DashboardSidebar } from "../ui/DashboardSidebar";

const Analytics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [keyMetrics, setKeyMetrics] = useState([]);

  // Percentage change helper with percentage first
  const calcPercentChange = (current, prev) => {
    current = Number(current ?? 0);
    prev = Number(prev ?? 0);

    if (prev === 0 && current === 0) return "0% from last month";
    if (prev === 0) return "+100% from last month";

    const percent = ((current - prev) / prev) * 100;
    const sign = percent > 0 ? "+" : "";
    return `${sign}${percent.toFixed(1)}% from last month`;
  };

  const fetchAnalyticsData = async () => {
    try {
      const revenueTrend = await fetchRevenueTrend();
      const salesByGroup = await fetchSalesByCategory();
      const topItems = await fetchTopItems();
      const metrics = await fetchKeyMetrics();

      setRevenueData(
        revenueTrend.length
          ? revenueTrend
          : [{ month: "No Data", revenue: 0, orders: 0 }]
      );

      setGroupData(
        salesByGroup.length
          ? salesByGroup.map((g) => ({
              ...g,
              color: g.color || "hsl(var(--accent))",
            }))
          : [
              { name: "Main Course", value: 0, color: "#8884d8" },
              { name: "Dessert", value: 0, color: "#82ca9d" },
              { name: "Appetizer", value: 0, color: "#ffc658" },
              { name: "Beverage", value: 0, color: "#ff7f50" },
              { name: "Combo Meal", value: 0, color: "#a569bd" },
            ]
      );

      setPopularItems(
        topItems.length ? topItems : [{ name: "No Data", orders: 0 }]
      );

      // Key metrics
      const metricsData = [
        {
          title: "Total Revenue",
          value: `₱${Number(metrics.total_revenue ?? 0).toLocaleString()}`,
          change: calcPercentChange(
            metrics.total_revenue,
            metrics.prev_total_revenue
          ),
          icon: DollarSign,
          iconColor: "bg-blue-400",
        },
        {
          title: "Total Orders",
          value: Number(metrics.total_orders ?? 0).toLocaleString(),
          change: calcPercentChange(
            metrics.total_orders,
            metrics.prev_total_orders
          ),
          icon: ShoppingCart,
          iconColor: "bg-yellow-400",
        },
        {
          title: "New Customers",
          value: Number(metrics.new_customers ?? 0).toLocaleString(),
          change: (() => {
            const current = Number(metrics.new_customers ?? 0);
            const prev = Number(metrics.prev_new_customers ?? 0);

            if (prev === 0 && current === 0) return "0% from last month";
            if (prev === 0) return "+100% from last month";

            let percent = Math.round(((current - prev) / prev) * 100); // round to whole number
            if (percent > 100) percent = 100; // cap at 100%
            const sign = percent > 0 ? "+" : "";
            return `${sign}${percent}% from last month`; // no decimal
          })(),
          icon: Users,
          iconColor: "bg-green-500",
        },
        {
          title: "Avg Rating",
          value: Number(metrics.avg_rating ?? 0).toFixed(1),
          change: calcPercentChange(
            metrics.avg_rating ?? 0,
            metrics.prev_avg_rating ?? 0
          ),
          icon: Star,
          iconColor: "bg-orange-400",
        },
      ];

      const formattedMetrics = metricsData.map((m) => ({
        ...m,
        changeType: m.change.startsWith("-") ? "negative" : "positive",
      }));

      setKeyMetrics(formattedMetrics);
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
    }
  };

  // Fetch every 20 seconds
  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(() => {
      fetchAnalyticsData();
    }, 20000); // 20 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <DashboardSidebar />
      <div className="pl-64 transition-all duration-300">
        <DashboardHeader />

        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Analytics & Reports
            </h1>
            <p className="text-muted-foreground mb-10">
              Track your restaurant performance and insights
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyMetrics.map((metric, idx) => {
              const ArrowIcon =
                metric.changeType === "positive"
                  ? TrendingUp
                  : metric.changeType === "negative"
                  ? TrendingDown
                  : null;

              const changeColor =
                metric.changeType === "positive"
                  ? "text-green-600"
                  : metric.changeType === "negative"
                  ? "text-red-600"
                  : "text-gray-600";

              const gradientMap = {
                "bg-yellow-400":
                  "bg-gradient-to-br from-yellow-400 to-yellow-300",
                "bg-blue-400": "bg-gradient-to-br from-blue-400 to-blue-300",
                "bg-green-500": "bg-gradient-to-br from-green-500 to-green-400",
                "bg-orange-400":
                  "bg-gradient-to-br from-orange-400 to-orange-300",
              };

              const gradientClass =
                gradientMap[metric.iconColor] ||
                "bg-gradient-to-br from-gray-400 to-gray-300";

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 relative flex items-start gap-4"
                >
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-lg ${gradientClass} absolute -top-6 left-5 shadow-lg`}
                  >
                    {metric.icon && (
                      <metric.icon size={28} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1 pl-20">
                    <p className="text-gray-500 text-sm">{metric.title}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                    {metric.change && (
                      <div className="flex items-center gap-1 mt-2 text-sm">
                        {ArrowIcon && (
                          <ArrowIcon size={14} className={changeColor} />
                        )}
                        <span className={changeColor}>{metric.change}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Orders Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={revenueData}
                    cursor={false}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--accent))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--accent))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue (₱)"
                      stroke="hsl(var(--accent))"
                      strokeWidth={3}
                      fill="url(#revenueGradient)"
                      activeDot={false} // remove active dot
                      isAnimationActive
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      name="Orders"
                      stroke="#FF7F50"
                      fill="rgba(255,127,80,0.2)"
                      activeDot={false} // remove active dot
                      isAnimationActive
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Group</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart onClick={(e) => e.stopPropagation()}>
                    <Pie
                      data={groupData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      dataKey="value"
                      stroke="none"
                    >
                      {groupData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={popularItems}
                  cursor={false}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="hsl(var(--accent))"
                    radius={[8, 8, 0, 0]}
                    stroke="none"
                    isAnimationActive
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
