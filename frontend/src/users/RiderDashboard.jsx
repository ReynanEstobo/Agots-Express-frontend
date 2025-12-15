import {
  CheckCircle2,
  LogOut,
  MapPin,
  Package,
  Phone,
  Star,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  acceptDelivery,
  completeDelivery,
  fetchRiderById,
  fetchRiderOrders,
  fetchRiderStats,
} from "../api/RiderAPI";
import { useAlert } from "../contexts/AlertContext"; // Changed import
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";

// -------------------- SMALL FIELD --------------------
const Info = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 sm:gap-1">
    <span className="text-xs sm:text-sm font-medium text-gray-500">
      {label}
    </span>
    <span className="text-sm sm:text-base font-semibold text-gray-800 break-words">
      {value || "—"}
    </span>
  </div>
);

// -------------------- LARGE BLOCK FIELD --------------------
const BlockInfo = ({ label, value }) => (
  <div className="flex flex-col gap-1 sm:gap-1.5">
    <span className="text-xs sm:text-sm font-medium text-gray-500">
      {label}
    </span>
    <div className="w-full p-3 sm:p-4 rounded-lg bg-gray-50 border text-sm sm:text-base text-gray-800 leading-relaxed break-words whitespace-pre-line">
      {value || "—"}
    </div>
  </div>
);

// -------------------- DELIVERY MODAL --------------------
const DeliveryModal = ({ delivery, onClose }) => {
  if (!delivery) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-6">
      <div className="bg-white w-full max-w-full sm:max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Delivery Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Info label="Order ID" value={delivery.orderId} />
            <Info
              label="Customer Name"
              value={`${delivery.customer_first_name} ${delivery.customer_last_name}`}
            />
            <Info label="Phone" value={delivery.customer_phone} />
            <Info label="Payment Method" value={delivery.payment_method} />
            <Info label="Status" value={delivery.status} />
            <Info label="Total Amount" value={`₱${delivery.total_amount}`} />
          </div>

          <BlockInfo
            label="Delivery Address"
            value={delivery.customer_address}
          />
          {delivery.delivery_instructions && (
            <BlockInfo
              label="Delivery Instructions"
              value={delivery.delivery_instructions}
            />
          )}
        </div>

        {/* FOOTER */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm sm:text-base transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------- HEADER --------------------
const RiderDashboardHeader = ({ riderName, riderId, onLogout }) => {
  // Added onLogout prop
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const toggleAdminMenu = () => setShowAdminMenu(!showAdminMenu);

  return (
    <header className="sticky top-0 bg-[#0A1A3F] text-white border-b border-white/10 z-40">
      <div className="max-w-1280 mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Rider Dashboard</h1>
          <p className="text-sm sm:text-base text-white/70">
            {riderName} • Rider ID: {riderId}
          </p>
        </div>

        {/* PROFILE MENU */}
        <div className="flex items-center gap-6 ml-4 relative">
          <div className="relative">
            <button
              onClick={toggleAdminMenu}
              className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-1 transition"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div className="text-sm">
                <p className="font-semibold">Rider</p>
                <p className="text-white/70">Settings</p>
              </div>
            </button>

            {showAdminMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 text-sm z-20">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:text-gray-900 w-full transition text-black"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// -------------------- RIDER DASHBOARD --------------------
const RiderDashboard = () => {
  const { addAlert } = useAlert(); // Changed to useAlert
  const riderId = sessionStorage.getItem("user_id");

  const [rider, setRider] = useState({ name: "Loading...", riderId: "" });
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    totalEarnings: 0,
    avgRating: 0,
    totalReviews: 0,
  });
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [activeTab, setActiveTab] = useState("assigned");

  // -------------------- FETCH RIDER INFO --------------------
  useEffect(() => {
    if (!riderId) return setRider({ name: "Unknown Rider", riderId: "N/A" });

    const getRiderInfo = async () => {
      try {
        const data = await fetchRiderById(riderId);
        setRider({
          name: data?.name || "Unknown Rider",
          riderId: data?.riderId || riderId,
        });
      } catch (err) {
        console.error(err);
        addAlert("Failed to fetch rider info", "error"); // Changed to addAlert
        setRider({ name: "Unknown Rider", riderId });
      }
    };

    getRiderInfo();
  }, [riderId, addAlert]);

  // -------------------- FETCH DELIVERIES --------------------
  const fetchDeliveries = async () => {
    try {
      const assigned = await fetchRiderOrders(riderId, "assigned");
      const onTheWay = await fetchRiderOrders(riderId, "on the way");
      const completed = await fetchRiderOrders(riderId, "completed");

      // Active deliveries: assigned + on the way
      const uniqueActive = [...assigned, ...onTheWay].filter(
        (order, idx, self) => idx === self.findIndex((o) => o.id === order.id)
      );

      const uniqueCompleted = completed.filter(
        (order, idx, self) => idx === self.findIndex((o) => o.id === order.id)
      );

      setActiveDeliveries(
        uniqueActive.map((order) => ({
          id: order.id,
          orderId: `ORD-${String(order.id).padStart(3, "0")}`,
          customer_first_name: order.customer_first_name,
          customer_last_name: order.customer_last_name,
          customer_address: order.customer_address,
          customer_phone: order.customer_phone,
          payment_method: order.payment_method,
          status: order.status,
          total_amount: order.total_amount,
          items: order.items.length,
          delivery_instructions: order.delivery_instructions,
          rider_name: order.rider_name,
          rider_phone: order.rider_phone,
        }))
      );

      setDeliveryHistory(
        uniqueCompleted.map((order) => ({
          id: order.id,
          orderId: `ORD-${String(order.id).padStart(3, "0")}`,
          customer: `${order.customer_first_name} ${order.customer_last_name}`,
          completedAt: order.completed_at,
          amount: `₱${order.total_amount}`,
          rating: order.rating || 0,
        }))
      );
    } catch (err) {
      console.error(err);
      addAlert("Failed to fetch deliveries", "error"); // Changed to addAlert
    }
  };

  useEffect(() => {
    if (riderId) fetchDeliveries();
  }, [riderId]);

  // -------------------- FETCH STATS --------------------
  const fetchStats = async () => {
    try {
      const data = await fetchRiderStats(riderId);
      setStats(data);
    } catch (err) {
      console.error(err);
      addAlert("Failed to fetch stats", "error"); // Changed to addAlert
    }
  };

  useEffect(() => {
    if (riderId) fetchStats();
  }, [riderId]);

  // -------------------- HANDLE ACCEPT DELIVERY --------------------
  const handleAcceptDelivery = async (deliveryId) => {
    try {
      await acceptDelivery(riderId, deliveryId);
      addAlert(
        `You've accepted delivery ORD-${String(deliveryId).padStart(3, "0")}`,
        "success" // Changed to addAlert with type
      );
      setActiveDeliveries((prev) =>
        prev.map((d) =>
          d.id === deliveryId ? { ...d, status: "on the way" } : d
        )
      );
      fetchStats();
    } catch (err) {
      console.error(err);
      addAlert("Failed to accept delivery", "error"); // Changed to addAlert
    }
  };

  // -------------------- HANDLE MARK DELIVERED --------------------
  const handleMarkDelivered = async (deliveryId) => {
    try {
      await completeDelivery(riderId, deliveryId);
      addAlert(
        `Delivery ORD-${String(deliveryId).padStart(
          3,
          "0"
        )} marked as delivered`,
        "success" // Changed to addAlert with type
      );

      const delivered = activeDeliveries.find((d) => d.id === deliveryId);
      if (delivered) {
        setDeliveryHistory((prev) => [
          { ...delivered, completedAt: new Date().toISOString(), rating: 0 },
          ...prev,
        ]);
      }

      setActiveDeliveries((prev) => prev.filter((d) => d.id !== deliveryId));
      fetchStats();
    } catch (err) {
      console.error(err);
      addAlert("Failed to mark delivery as completed", "error"); // Changed to addAlert
    }
  };

  // -------------------- HANDLE LOGOUT --------------------
  const handleLogout = () => {
    addAlert("Logged out successfully!", "success"); // Changed to addAlert
    sessionStorage.clear();
    window.location.href = "/";
  };

  // -------------------- VIEW MODAL --------------------
  const handleViewInfo = (delivery) => setSelectedDelivery(delivery);
  const closeModal = () => setSelectedDelivery(null);

  // -------------------- STATUS COLOR --------------------
  const getStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return { backgroundColor: "#F2E26D", color: "#0A1A3F" };
      case "on the way":
        return { backgroundColor: "#33C3FF", color: "#FFFFFF" };
      default:
        return { backgroundColor: "#F5F5F5", color: "#374151" };
    }
  };

  // -------------------- RENDER --------------------
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-16">
      {/* HEADER */}
      <RiderDashboardHeader
        riderName={rider.name}
        riderId={rider.riderId}
        onLogout={handleLogout} // Added onLogout prop
      />

      {/* CONTENT */}
      <div className="max-w-1280 mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            {
              icon: Package,
              title: "Today's Deliveries",
              value: stats.totalDeliveries,
              color: "#0A1A3F",
              extra: `From delivery history`,
            },
            {
              icon: TrendingUp,
              title: "Today's Earnings",
              value: `₱${stats.totalEarnings}`,
              color: "#F2C94C",
              extra: `From ${stats.totalDeliveries} deliveries`,
            },
            {
              icon: Star,
              title: "Average Rating",
              value: stats.avgRating.toFixed(1),
              color: "#0A1A3F",
              extra: `Based on ${stats.totalReviews} reviews`,
            },
          ].map((card, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-sm sm:text-base font-medium flex items-center gap-2 text-gray-500">
                  <card.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: card.color }}
                >
                  {card.value}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {card.extra}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Tabs */}
          <TabsList className="grid w-full grid-cols-2 mb-6 gap-4 hidden sm:grid">
            <TabsTrigger value="assigned" className="border-r border-gray-200">
              Active Deliveries ({activeDeliveries.length})
            </TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>

          {/* ACTIVE DELIVERIES */}
          <TabsContent value="assigned" className="space-y-4">
            {activeDeliveries.length === 0 ? (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-sm sm:text-base">
                    No active deliveries at the moment
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg sm:text-xl mb-1">
                          {delivery.orderId}
                        </CardTitle>
                        <p className="text-sm text-gray-500">{delivery.id}</p>
                      </div>
                      <Badge
                        style={{
                          ...getStatusColor(delivery.status),
                          padding: "0.25rem 1rem",
                          fontWeight: "500",
                        }}
                      >
                        {delivery.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 sm:gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium">
                              {delivery.customer_first_name}{" "}
                              {delivery.customer_last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {delivery.customer_address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                          <p className="text-sm sm:text-base">
                            {delivery.customer_phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:gap-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Items</span>
                          <span className="font-bold">{delivery.items}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Amount</span>
                          <span className="font-bold">{`₱${delivery.total_amount}`}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3 pt-2">
                      {delivery.status === "assigned" ? (
                        <Button
                          className="flex-1 bg-[#F2C94C] text-[#0A1A3F]"
                          onClick={() => handleAcceptDelivery(delivery.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Accept Delivery
                        </Button>
                      ) : (
                        <Button
                          className="flex-1 bg-[#2BA94C] text-white"
                          onClick={() => handleMarkDelivered(delivery.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Mark Delivered
                        </Button>
                      )}
                      <Button
                        className="flex-1"
                        onClick={() => handleViewInfo(delivery)}
                      >
                        View Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* DELIVERY HISTORY */}
          <TabsContent value="history" className="space-y-4">
            {deliveryHistory.length === 0 ? (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-sm sm:text-base">
                    No delivery history
                  </p>
                </CardContent>
              </Card>
            ) : (
              deliveryHistory.map((delivery) => {
                const completedDate = delivery.completedAt
                  ? new Date(delivery.completedAt).toLocaleString("en-PH")
                  : "-";
                return (
                  <Card key={delivery.id}>
                    <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6">
                      <div>
                        <p className="font-medium text-base sm:text-lg">
                          {delivery.customer}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {delivery.orderId} • Completed on {completedDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-[#0A1A3F]">
                          {delivery.amount}
                        </p>
                        <div className="flex items-center gap-1 justify-end mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              style={{
                                color:
                                  i < delivery.rating ? "#22C55E" : "#4B5563",
                                fill: i < delivery.rating ? "#22C55E" : "none",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Navigation - Only visible on small screens */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-50">
        {/* Navigation Buttons */}
        <div className="flex justify-around py-2">
          <button
            onClick={() => setActiveTab("assigned")}
            className={`flex-1 py-3 px-4 text-center flex flex-col items-center justify-center transition-colors ${
              activeTab === "assigned"
                ? "text-[#0A1A3F] font-medium"
                : "text-gray-500"
            }`}
          >
            <Package className="w-5 h-5 mb-1" />
            <span className="text-xs">Active</span>
            <span className="text-xs mt-1">({activeDeliveries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 px-4 text-center flex flex-col items-center justify-center transition-colors ${
              activeTab === "history"
                ? "text-[#0A1A3F] font-medium"
                : "text-gray-500"
            }`}
          >
            <TrendingUp className="w-5 h-5 mb-1" />
            <span className="text-xs">History</span>
          </button>
        </div>
      </div>

      <DeliveryModal delivery={selectedDelivery} onClose={closeModal} />
    </div>
  );
};

export default RiderDashboard;
