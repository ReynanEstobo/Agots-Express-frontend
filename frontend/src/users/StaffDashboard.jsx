import {
  Bike,
  CheckCircle2,
  Clock,
  Filter,
  Package,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  assignRiderToOrder,
  fetchActiveOrders,
  fetchDashboardStats,
  updateOrderStatus,
} from "../api/StaffAPI";
import { useToast } from "../hooks/use-toast";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { DashboardHeader } from "../ui/DashboardHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";
import { Input } from "../ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Tables";

const StaffDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [availableRiders, setAvailableRiders] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    readyForDelivery: 0,
    availableRiders: 0,
  });

  const { addToast } = useToast();
  const navigate = useNavigate();
  const userRole = "Staff";

  // ---------------- LOGIN PROTECTION ----------------
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    if (!token || role !== "staff") {
      alert("You must be logged in as staff to view this page.");
      navigate("/login");
    }
  }, [navigate]);

  // ---------------- LOAD DASHBOARD DATA ----------------
  const loadDashboardData = async () => {
    try {
      const statData = await fetchDashboardStats();
      setStats(statData);

      const orderData = await fetchActiveOrders();
      setOrders(orderData.orders || []);
      setAvailableRiders(orderData.riders || []);
    } catch (err) {
      addToast({
        title: "Error",
        description: "Failed to load dashboard data",
      });
    }
  };

  useEffect(() => {
    loadDashboardData(); // initial load
    const interval = setInterval(loadDashboardData, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // ---------------- STATUS & PRIORITY COLORS ----------------
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-[#F2C94C] text-[#0A1A3F]";
      case "preparing":
        return "bg-[#13A4E9] text-white";
      case "ready":
        return "bg-[#2CC48C] text-white";
      case "assigned":
        return "bg-[#0A1A3F] text-white";
      default:
        return "bg-[#F5F5F5] text-[#0A1A3F]";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-[#D9464F]";
      case "medium":
        return "border-l-4 border-[#F2C94C]";
      case "low":
        return "border-l-4 border-[#F5F5F5]";
      default:
        return "";
    }
  };

  // ---------------- HANDLE STATUS UPDATES ----------------
  const handlePrepareOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, "preparing");
      addToast({
        title: "Order Updated",
        description: `Order ${orderId} is now preparing`,
      });
      loadDashboardData();
    } catch {
      addToast({
        title: "Error",
        description: `Failed to update order ${orderId}`,
      });
    }
  };

  const handleMarkAsReady = async (orderId) => {
    try {
      await updateOrderStatus(orderId, "ready");
      addToast({
        title: "Order Updated",
        description: `Order ${orderId} is ready for delivery`,
      });
      loadDashboardData();
    } catch {
      addToast({
        title: "Error",
        description: `Failed to mark order ${orderId} as ready`,
      });
    }
  };

  const handleAssignRider = async (orderId, riderId) => {
    try {
      await assignRiderToOrder(orderId, riderId);
      addToast({
        title: "Rider Assigned",
        description: `Order ${orderId} assigned to rider ${riderId}`,
      });
      loadDashboardData();
    } catch {
      addToast({
        title: "Error",
        description: `Failed to assign rider to order ${orderId}`,
      });
    }
  };

  // ---------------- FILTER ORDERS (SAFE IMPLEMENTATION) ----------------
  const filteredOrders = orders.filter((order) => {
    try {
      // Check if order has required properties
      if (!order || typeof order !== "object") return false;

      const matchesStatus =
        filterStatus === "all" || order.status === filterStatus;

      // Only perform search if there's a query
      if (!searchQuery) return matchesStatus;

      // Ensure properties exist and are strings before converting to lowercase
      const customer = order.customer
        ? String(order.customer).toLowerCase()
        : "";
      const items = order.items ? String(order.items).toLowerCase() : "";
      const id = order.id ? String(order.id).toLowerCase() : "";
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        customer.includes(query) || items.includes(query) || id.includes(query);

      return matchesStatus && matchesSearch;
    } catch (error) {
      console.error("Error filtering order:", error);
      return false;
    }
  });

  return (
    <div className="flex-1 bg-[#F5F5F5] text-[#0A1A3F]">
      <DashboardHeader userRole={userRole} />
      <main className="p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
            {userRole} Dashboard
          </h1>
          <p className="text-sm sm:text-base text-[#6B7280]">
            Manage orders and coordinate deliveries
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={<Clock />}
            title="Pending Orders"
            value={stats.pending}
            color="text-[#F2C94C]"
            desc="Waiting to prepare"
          />
          <StatCard
            icon={<Package />}
            title="In Preparation"
            value={stats.preparing}
            color="text-[#13A4E9]"
            desc="Being prepared"
          />
          <StatCard
            icon={<CheckCircle2 />}
            title="Ready for Delivery"
            value={stats.readyForDelivery}
            color="text-[#2CC48C]"
            desc="Awaiting riders"
          />
          <StatCard
            icon={<Bike />}
            title="Available Riders"
            value={stats.availableRiders}
            color="text-[#F2C94C]"
            desc="Ready to deliver"
          />
        </div>

        {/* Filters */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 border-[#D1D5DB]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280] hover:text-[#0A1A3F] transition-colors"
                  >
                    <X className="h-full w-full" />
                  </button>
                )}
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48 border-[#D1D5DB]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-lg sm:text-xl">
              Active Orders{" "}
              {filteredOrders.length !== orders.length && (
                <span className="text-sm text-[#6B7280] font-normal">
                  ({filteredOrders.length} of {orders.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="overflow-x-auto">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-sm sm:text-base text-[#6B7280]">
                    {orders.length === 0
                      ? "No orders found"
                      : searchQuery
                      ? "No orders match your search"
                      : "No orders match the selected filter"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[80px]">Order ID</TableHead>
                      <TableHead className="min-w-[120px]">Customer</TableHead>
                      <TableHead className="min-w-[150px]">Items</TableHead>
                      <TableHead className="min-w-[100px]">Time</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className={getPriorityColor(order.priority)}
                      >
                        <TableCell className="font-medium text-sm sm:text-base">
                          {order.id}
                        </TableCell>
                        <TableCell className="text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                          {order.customer}
                        </TableCell>
                        <TableCell className="text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
                          {order.items}
                        </TableCell>
                        <TableCell className="text-sm sm:text-base">
                          {order.time}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs sm:text-sm ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right flex flex-col sm:flex-row sm:space-y-0 sm:space-x-2 justify-end items-end sm:items-center">
                          {order.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handlePrepareOrder(order.id)}
                              className="bg-[#13A4E9] hover:bg-[#0F8AD1] text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                            >
                              <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />{" "}
                              Prepare
                            </Button>
                          )}
                          {order.status === "preparing" && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkAsReady(order.id)}
                              className="bg-[#2CC48C] hover:bg-[#28B17F] text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                            >
                              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />{" "}
                              Mark Ready
                            </Button>
                          )}
                          {order.status === "ready" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="bg-[#F2C94C] hover:bg-[#D9B73C] text-[#0A1A3F] text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                                  <Bike className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />{" "}
                                  Assign Rider
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-[90vw] sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-base sm:text-lg">
                                    Assign Rider to Order {order.id}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
                                  {availableRiders.length > 0 ? (
                                    availableRiders.map((rider) => (
                                      <div
                                        key={rider.id}
                                        className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-[#F5F5F5] transition-colors"
                                      >
                                        <div>
                                          <p className="font-medium text-sm sm:text-base">
                                            {rider.name}
                                          </p>
                                          <p className="text-xs sm:text-sm text-[#6B7280]">
                                            {rider.deliveries} deliveries
                                            completed
                                          </p>
                                        </div>
                                        <Button
                                          onClick={() =>
                                            handleAssignRider(
                                              order.id,
                                              rider.id
                                            )
                                          }
                                          className="bg-[#0A1A3F] hover:bg-[#0A1A3F]/90 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                                        >
                                          Assign
                                        </Button>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm sm:text-base text-[#6B7280]">
                                      No available riders at the moment
                                    </p>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StaffDashboard;

// ----------------------------
// Stat Card Component
// ----------------------------
const StatCard = ({ icon, title, value, color, desc }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
      <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2 text-[#6B7280]">
        {icon} {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
      <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${color}`}>
        {value}
      </div>
      <p className="text-xs sm:text-sm text-[#6B7280] mt-1">{desc}</p>
    </CardContent>
  </Card>
);
