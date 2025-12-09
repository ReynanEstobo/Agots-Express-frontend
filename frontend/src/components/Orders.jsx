import axios from "axios";
import { Search, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { DashboardHeader } from "../ui/DashboardHeader";
import { DashboardSidebar } from "../ui/DashboardSidebar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

import { fetchAllOrders } from "../api/StatsAPI";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    totalOrdersAll: 0,
    preparing: 0,
    pending: 0,
    completed: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // -----------------------
  // Load all orders & stats
  // -----------------------
  const loadOrders = async () => {
    try {
      const data = await fetchAllOrders();

      const sortedData = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setOrders(sortedData);

      // Stats (FIX: Use ALL orders)
      setStats({
        totalOrdersAll: data.length,
        pending: data.filter((o) => o.status === "pending").length,
        preparing: data.filter((o) => o.status === "preparing").length,
        completed: data.filter((o) => o.status === "completed").length,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    loadOrders();
    const intervalId = setInterval(loadOrders, 30000); // refresh every 30s
    return () => clearInterval(intervalId);
  }, []);

  // -----------------------
  // Filter orders for table
  // -----------------------
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search);
    return matchesStatus && matchesSearch;
  });

  // -----------------------
  // View order modal
  // -----------------------
  const handleViewOrder = async (orderId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/dashboard/order-items/${orderId}`
      );
      setSelectedOrderItems(res.data);
      setSelectedOrderId(orderId);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch order items:", err);
    }
  };

  // -----------------------
  // Stats cards configuration
  // -----------------------
  const statsCards = [
    {
      title: "Total Orders",
      value: stats.totalOrdersAll,
      iconColor: "bg-blue-400",
    },
    { title: "Preparing", value: stats.preparing, iconColor: "bg-orange-400" },
    { title: "Pending", value: stats.pending, iconColor: "bg-yellow-400" },
    { title: "Completed", value: stats.completed, iconColor: "bg-green-500" },
  ];

  const gradientMap = {
    "bg-yellow-400": "bg-gradient-to-br from-yellow-400 to-yellow-300",
    "bg-blue-400": "bg-gradient-to-br from-blue-400 to-blue-300",
    "bg-green-500": "bg-gradient-to-br from-green-500 to-green-400",
    "bg-orange-400": "bg-gradient-to-br from-orange-400 to-orange-300",
  };

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <DashboardSidebar />
      <div className="pl-64">
        <DashboardHeader />
        <main className="px-8 py-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1b2559]">
                Orders Management
              </h1>
              <p className="text-gray-500 mb-7">
                Monitor all restaurant orders
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {statsCards.map((card, idx) => {
              const gradientClass =
                gradientMap[card.iconColor] || "bg-gray-400";
              const textColor = card.iconColor.replace("bg-", "text-");
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 relative flex items-start gap-4"
                >
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-lg ${gradientClass} absolute -top-6 left-5 shadow-lg`}
                  >
                    <ShoppingCart className="text-white w-6 h-6" />
                  </div>
                  <div className="flex-1 pl-20">
                    <p className="text-gray-500 text-sm">{card.title}</p>
                    <p className={`text-2xl font-bold mt-1 ${textColor}`}>
                      {card.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1b2559]">
                All Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search orders, customers..."
                    className="pl-10 border-gray-300 bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select defaultValue="all" onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] border-gray-300 bg-white">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="on the way">On the Way</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="border border-gray-200 rounded-xl overflow-x-auto">
                <Table>
                  <TableHeader className="bg-white">
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-semibold text-[#1b2559]">
                          #{order.id}
                        </TableCell>
                        <TableCell>{order.customer_name}</TableCell>
                        <TableCell className="text-yellow-600 font-semibold">
                          ₱{Number(order.total_amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              order.status === "pending"
                                ? "bg-yellow-400 text-yellow-900"
                                : order.status === "preparing"
                                ? "bg-orange-400 text-orange-900"
                                : order.status === "completed"
                                ? "bg-green-500 text-white"
                                : order.status === "ready"
                                ? "bg-blue-500 text-white"
                                : order.status === "on the way"
                                ? "bg-purple-500 text-white"
                                : "bg-gray-400 text-white"
                            } px-2 py-1 rounded-full text-sm font-semibold`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleViewOrder(order.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg z-50">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center text-[#1b2559]">
                Order #{selectedOrderId} Details
              </DialogTitle>
            </DialogHeader>
            <DialogClose asChild>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                X
              </button>
            </DialogClose>

            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Food</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.food_name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        ₱{Number(item.price).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ₱{Number(item.total).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Orders;
