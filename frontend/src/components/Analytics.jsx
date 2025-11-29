import {
  DollarSign,
  ShoppingCart,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { DashboardHeader } from "../ui/DashboardHeader";
import { DashboardSidebar } from "../ui/DashboardSidebar";

// Data
const revenueData = [
  { month: "Jan", revenue: 45000, orders: 320 },
  { month: "Feb", revenue: 52000, orders: 380 },
  { month: "Mar", revenue: 48000, orders: 350 },
  { month: "Apr", revenue: 61000, orders: 420 },
  { month: "May", revenue: 55000, orders: 390 },
  { month: "Jun", revenue: 67000, orders: 480 },
  { month: "Jul", revenue: 72000, orders: 520 },
];

const categoryData = [
  { name: "Main Courses", value: 45, color: "hsl(var(--accent))" },
  { name: "Appetizers", value: 20, color: "hsl(var(--secondary))" },
  { name: "Desserts", value: 15, color: "hsl(var(--warning))" },
  { name: "Beverages", value: 12, color: "hsl(var(--success))" },
  { name: "Catering", value: 8, color: "hsl(var(--primary))" },
];

const popularItems = [
  { name: "Chicken Adobo", orders: 324, revenue: "₱90,720" },
  { name: "Lechon Kawali", orders: 298, revenue: "₱113,240" },
  { name: "Sisig", orders: 276, revenue: "₱88,320" },
  { name: "Sinigang", orders: 245, revenue: "₱85,750" },
  { name: "Kare-Kare", orders: 198, revenue: "₱83,160" },
];

const keyMetrics = [
  {
    title: "Total Revenue",
    value: "₱425,000",
    change: "+12.5% from last month",
    changeType: "positive",
    icon: DollarSign,
    iconColor: "bg-blue-400",
  },
  {
    title: "Total Orders",
    value: "2,860",
    change: "+8.2% from last month",
    changeType: "positive",
    icon: ShoppingCart,
    iconColor: "bg-yellow-400",
  },
  {
    title: "New Customers",
    value: "342",
    change: "-2.4% from last month",
    changeType: "negative",
    icon: Users,
    iconColor: "bg-green-500",
  },
  {
    title: "Avg Rating",
    value: "4.8",
    change: "+0.3 from last month",
    changeType: "positive",
    icon: Star,
    iconColor: "bg-orange-400",
  },
];

const Analytics = () => {
  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <DashboardSidebar />

      <div className="pl-64 transition-all duration-300">
        <DashboardHeader />

        <main className="p-6 space-y-6">
          {/* Page Title */}
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

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Area Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Orders Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
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
                    <YAxis stroke="hsl(var(--muted-foreground))" />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--accent))"
                      strokeWidth={3}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
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

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={popularItems}>
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
