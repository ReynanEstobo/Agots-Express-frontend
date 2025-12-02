import {
  CheckCircle2,
  MapPin,
  Package,
  Phone,
  Star,
  TrendingUp,
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
import { useToast } from "../hooks/use-toast";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";

// Modal to view delivery details
const DeliveryModal = ({ delivery, onClose }) => {
  if (!delivery) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Delivery Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {[
            "orderId",
            "id",
            "customer",
            "address",
            "phone",
            "items",
            "amount",
            "status",
            "completedAt",
          ].map((key) => (
            <div className="flex justify-between" key={key}>
              <span className="font-medium text-gray-600">
                {key === "id"
                  ? "Delivery ID:"
                  : key === "completedAt"
                  ? "Completed At:"
                  : key.charAt(0).toUpperCase() + key.slice(1) + ":"}
              </span>
              <span className="font-semibold">
                {key === "completedAt" && delivery[key]
                  ? new Date(delivery[key]).toLocaleString("en-PH")
                  : delivery[key]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            style={{ backgroundColor: "#0A1A3F", color: "#FFF" }}
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

const RiderDashboard = () => {
  const { addToast } = useToast();
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

  const riderId = sessionStorage.getItem("user_id");

  // Fetch rider info
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
        addToast({ title: "Error", description: "Failed to fetch rider info" });
        setRider({ name: "Unknown Rider", riderId });
      }
    };
    getRiderInfo();
  }, [riderId, addToast]);

  // Fetch deliveries
  const fetchDeliveries = async () => {
    try {
      const assigned = await fetchRiderOrders(riderId, "assigned");
      const onTheWay = await fetchRiderOrders(riderId, "on the way");
      const completed = await fetchRiderOrders(riderId, "completed");

      setActiveDeliveries(
        [...assigned, ...onTheWay].map((order) => ({
          id: order.id,
          orderId: `ORD-${String(order.id).padStart(3, "0")}`,
          customer: order.customer_name,
          address: order.customer_address,
          phone: order.customer_phone,
          items: order.items.length,
          amount: `₱${order.total_amount}`,
          status: order.status,
        }))
      );

      setDeliveryHistory(
        completed.map((order) => ({
          id: order.id,
          orderId: `ORD-${String(order.id).padStart(3, "0")}`,
          customer: order.customer_name,
          completedAt: order.completed_at,
          amount: `₱${order.total_amount}`,
          rating: order.rating || 0,
        }))
      );
    } catch (err) {
      console.error(err);
      addToast({ title: "Error", description: "Failed to fetch deliveries" });
    }
  };

  useEffect(() => {
    if (riderId) fetchDeliveries();
  }, [riderId]);

  // Fetch stats
  const fetchStats = async () => {
    try {
      const data = await fetchRiderStats(riderId);
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
      addToast({ title: "Error", description: "Failed to fetch stats" });
    }
  };

  useEffect(() => {
    if (riderId) fetchStats();
  }, [riderId, deliveryHistory]);

  // Accept delivery
  const handleAcceptDelivery = async (deliveryId) => {
    try {
      await acceptDelivery(riderId, deliveryId);
      addToast({
        title: "Delivery Accepted",
        description: `You've accepted delivery ORD-${String(
          deliveryId
        ).padStart(3, "0")}`,
      });

      setActiveDeliveries((prev) =>
        prev.map((d) =>
          d.id === deliveryId ? { ...d, status: "on the way" } : d
        )
      );
      fetchStats();
    } catch (err) {
      console.error(err);
      addToast({ title: "Error", description: "Failed to accept delivery" });
    }
  };

  // Mark delivery as completed
  const handleMarkDelivered = async (deliveryId) => {
    try {
      await completeDelivery(riderId, deliveryId);
      addToast({
        title: "Delivery Completed",
        description: `Delivery ORD-${String(deliveryId).padStart(
          3,
          "0"
        )} marked as delivered`,
      });

      // Move delivery from active to history instantly
      const delivered = activeDeliveries.find((d) => d.id === deliveryId);
      if (delivered) {
        setDeliveryHistory((prev) => [
          {
            ...delivered,
            completedAt: new Date().toISOString(),
            rating: 0,
          },
          ...prev,
        ]);
      }

      setActiveDeliveries((prev) => prev.filter((d) => d.id !== deliveryId));

      fetchStats();
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        description: "Failed to mark delivery as completed",
      });
    }
  };

  const handleViewInfo = (delivery) => setSelectedDelivery(delivery);
  const closeModal = () => setSelectedDelivery(null);

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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F5F5" }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#0A1A3F",
          color: "#FFF",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "1rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700" }}>
              Rider Dashboard
            </h1>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
              {rider.name} • Rider ID: {rider.riderId}
            </p>
          </div>
          <Badge
            style={{
              backgroundColor: "#F2C94C",
              color: "#0A1A3F",
              fontSize: "1.125rem",
              padding: "0.5rem 1rem",
            }}
          >
            Available
          </Badge>
        </div>
      </header>

      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {[ 
            { icon: Package, title: "Today's Deliveries", value: stats.totalDeliveries, color: "#0A1A3F", extra: `From delivery history` },
            { icon: TrendingUp, title: "Today's Earnings", value: `₱${stats.totalEarnings}`, color: "#F2C94C", extra: `From ${stats.totalDeliveries} deliveries` },
            { icon: Star, title: "Average Rating", value: stats.avgRating.toFixed(1), color: "#0A1A3F", extra: `Based on ${stats.totalReviews} reviews` },
          ].map((card, idx) => (
            <Card key={idx}>
              <CardHeader style={{ paddingBottom: "0.75rem" }}>
                <CardTitle style={{ fontSize: "0.875rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.5rem", color: "#6B7280" }}>
                  <card.icon style={{ width: "1rem", height: "1rem" }} /> {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: "1.875rem", fontWeight: "700", color: card.color }}>
                  {card.value}
                </div>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.25rem" }}>{card.extra}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="assigned" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 gap-4">
            <TabsTrigger value="assigned">
              Assigned Deliveries ({activeDeliveries.length})
            </TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>

          {/* Active Deliveries */}
          <TabsContent value="assigned" className="space-y-4">
            {activeDeliveries.length === 0 ? (
              <Card>
                <CardContent
                  style={{ padding: "3rem 1rem", textAlign: "center" }}
                >
                  <Package
                    style={{
                      height: "3rem",
                      width: "3rem",
                      margin: "0 auto 1rem",
                      color: "#6B7280",
                    }}
                  />
                  <p style={{ color: "#6B7280" }}>
                    No active deliveries at the moment
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeDeliveries.map((delivery) => (
                <Card key={delivery.id} style={{ marginBottom: "1rem" }}>
                  <CardHeader>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <CardTitle style={{ fontSize: "1.125rem", marginBottom: "0.25rem" }}>
                          {delivery.orderId}
                        </CardTitle>
                        <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                          {delivery.id}
                        </p>
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
                  <CardContent style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1.5rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                          <MapPin style={{ width: "1.25rem", height: "1.25rem", color: "#6B7280", marginTop: "0.125rem" }} />
                          <div>
                            <p style={{ fontWeight: 500 }}>{delivery.customer}</p>
                            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>{delivery.address}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Phone style={{ width: "1.25rem", height: "1.25rem", color: "#6B7280" }} />
                          <p style={{ fontSize: "0.875rem" }}>{delivery.phone}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Items</span>
                          <span style={{ fontWeight: 700 }}>{delivery.items}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Amount</span>
                          <span style={{ fontWeight: 700 }}>{delivery.amount}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
                      {delivery.status === "assigned" ? (
                        <Button style={{ flex: 1, backgroundColor: "#F2C94C", color: "#0A1A3F" }} onClick={() => handleAcceptDelivery(delivery.id)}>
                          <CheckCircle2 style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
                          Accept Delivery
                        </Button>
                      ) : (
                        <Button style={{ flex: 1, backgroundColor: "#2BA94C", color: "#FFF" }} onClick={() => handleMarkDelivered(delivery.id)}>
                          <CheckCircle2 style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
                          Mark as Delivered
                        </Button>
                      )}
                      <Button variant="outline" style={{ flex: 1 }} onClick={() => handleViewInfo(delivery)}>
                        View Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Delivery History */}
          <TabsContent value="history" className="space-y-4">
            {deliveryHistory.length === 0 ? (
              <Card>
                <CardContent style={{ padding: "3rem 1rem", textAlign: "center" }}>
                  <Package style={{ height: "3rem", width: "3rem", margin: "0 auto 1rem", color: "#6B7280" }} />
                  <p style={{ color: "#6B7280" }}>No delivery history</p>
                </CardContent>
              </Card>
            ) : (
              deliveryHistory.map((delivery) => {
                const completedDate = delivery.completedAt
                  ? new Date(delivery.completedAt).toLocaleString("en-PH")
                  : "-";
                return (
                  <Card key={delivery.id} style={{ marginBottom: "1rem" }}>
                    <CardContent style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                      <div>
                        <p style={{ fontWeight: 500 }}>{delivery.customer}</p>
                        <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "0.25rem" }}>
                          {delivery.orderId} • Completed on {completedDate}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontWeight: 700, color: "#F2C94C" }}>{delivery.amount}</p>
                        <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "0.25rem" }}>Rating: {delivery.rating} ⭐</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      <DeliveryModal delivery={selectedDelivery} onClose={closeModal} />
    </div>
  );
};

export default RiderDashboard;
