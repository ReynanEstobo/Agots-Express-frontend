import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Phone,
  Star,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchRiderById } from "../api/RiderAPI";
import { useToast } from "../hooks/use-toast";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";

// Mock data for demonstration
const mockAssignedDeliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-045",
    customer: "Juan Dela Cruz",
    address: "123 Rizal St, Manila",
    phone: "+63 912 345 6789",
    items: 3,
    amount: "₱850",
    status: "assigned",
    distance: "2.5 km",
  },
  {
    id: "DEL-002",
    orderId: "ORD-046",
    customer: "Maria Santos",
    address: "456 Bonifacio Ave, Quezon City",
    phone: "+63 917 654 3210",
    items: 2,
    amount: "₱620",
    status: "assigned",
    distance: "1.8 km",
  },
];

const mockDeliveryHistory = [
  {
    id: "DEL-098",
    orderId: "ORD-042",
    customer: "Pedro Reyes",
    completedAt: "2 hours ago",
    amount: "₱950",
    rating: 5,
  },
  {
    id: "DEL-097",
    orderId: "ORD-041",
    customer: "Ana Garcia",
    completedAt: "3 hours ago",
    amount: "₱720",
    rating: 5,
  },
  {
    id: "DEL-096",
    orderId: "ORD-040",
    customer: "Jose Lim",
    completedAt: "4 hours ago",
    amount: "₱480",
    rating: 4,
  },
];

const RiderDashboard = () => {
  const { addToast } = useToast(); // <-- fixed toast
  const [deliveries, setDeliveries] = useState(mockAssignedDeliveries);
  const [rider, setRider] = useState({ name: "Loading...", riderId: "" });

  // Fetch rider info
  useEffect(() => {
    // Use sessionStorage to allow different tabs different sessions
    const riderId = sessionStorage.getItem("user_id");
    console.log("SessionStorage user_id:", riderId);

    if (!riderId) {
      setRider({ name: "Unknown Rider", riderId: "N/A" });
      return;
    }

    let cancelled = false;

    const getRiderInfo = async () => {
      try {
        const data = await fetchRiderById(riderId);
        if (cancelled) return;
        console.log("Rider data:", data);

        setRider({
          name: data?.name || "Unknown Rider",
          riderId: data?.riderId || riderId,
        });
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch rider info:", err);
        addToast({
          title: "Error",
          description: "Failed to fetch rider info",
        });
        setRider({ name: "Unknown Rider", riderId });
      }
    };

    getRiderInfo();

    return () => {
      cancelled = true;
    };
  }, [addToast]);

  const handleAcceptDelivery = (deliveryId) => {
    setDeliveries(
      deliveries.map((d) =>
        d.id === deliveryId ? { ...d, status: "in-transit" } : d
      )
    );
    addToast({
      title: "Delivery Accepted",
      description: `You've accepted delivery ${deliveryId}`,
    });
  };

  const handleMarkDelivered = (deliveryId) => {
    setDeliveries(deliveries.filter((d) => d.id !== deliveryId));
    addToast({
      title: "Delivery Completed",
      description: `Delivery ${deliveryId} marked as delivered`,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return {
          backgroundColor: "#F2E26D",
          color: "#0A1A3F",
          padding: "0.25rem 1rem",
          fontWeight: "500",
        };
      case "in-transit":
        return {
          backgroundColor: "#33C3FF",
          color: "#FFFFFF",
          padding: "0.25rem 1rem",
          fontWeight: "500",
        };
      default:
        return {
          backgroundColor: "#F5F5F5",
          color: "#374151",
          padding: "0.25rem 1rem",
          fontWeight: "500",
        };
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
          color: "#FFFFFF",
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
            alignItems: "center",
            justifyContent: "space-between",
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
          {/* Today's Deliveries */}
          <Card style={{ transition: "box-shadow 0.2s", cursor: "pointer" }}>
            <CardHeader style={{ paddingBottom: "0.75rem" }}>
              <CardTitle
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#6B7280",
                }}
              >
                <Package style={{ width: "1rem", height: "1rem" }} />
                Today's Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "700",
                  color: "#0A1A3F",
                }}
              >
                {deliveries.length}
              </div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#6B7280",
                  marginTop: "0.25rem",
                }}
              >
                +3 from yesterday
              </p>
            </CardContent>
          </Card>

          {/* Today's Earnings */}
          <Card style={{ transition: "box-shadow 0.2s", cursor: "pointer" }}>
            <CardHeader style={{ paddingBottom: "0.75rem" }}>
              <CardTitle
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#6B7280",
                }}
              >
                <TrendingUp style={{ width: "1rem", height: "1rem" }} />
                Today's Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "700",
                  color: "#F2C94C",
                }}
              >
                ₱840
              </div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#6B7280",
                  marginTop: "0.25rem",
                }}
              >
                From {deliveries.length} deliveries
              </p>
            </CardContent>
          </Card>

          {/* Average Rating */}
          <Card style={{ transition: "box-shadow 0.2s", cursor: "pointer" }}>
            <CardHeader style={{ paddingBottom: "0.75rem" }}>
              <CardTitle
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#6B7280",
                }}
              >
                <Star style={{ width: "1rem", height: "1rem" }} />
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "700",
                  color: "#0A1A3F",
                }}
              >
                4.9
              </div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#6B7280",
                  marginTop: "0.25rem",
                }}
              >
                Based on 156 reviews
              </p>
            </CardContent>
          </Card>

          {/* Avg Delivery Time */}
          <Card style={{ transition: "box-shadow 0.2s", cursor: "pointer" }}>
            <CardHeader style={{ paddingBottom: "0.75rem" }}>
              <CardTitle
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#6B7280",
                }}
              >
                <Clock style={{ width: "1rem", height: "1rem" }} />
                Avg. Delivery Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "700",
                  color: "#2BA94C",
                }}
              >
                18 min
              </div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#6B7280",
                  marginTop: "0.25rem",
                }}
              >
                Below target of 25min
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="assigned" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="assigned">
              Assigned Deliveries ({deliveries.length})
            </TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>

          <TabsContent value="assigned">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {deliveries.length === 0 ? (
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
                      No assigned deliveries at the moment
                    </p>
                  </CardContent>
                </Card>
              ) : (
                deliveries.map((delivery) => (
                  <Card
                    key={delivery.id}
                    style={{ transition: "box-shadow 0.2s", cursor: "pointer" }}
                  >
                    <CardHeader>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <CardTitle style={{ fontSize: "1.125rem" }}>
                            {delivery.orderId}
                          </CardTitle>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "#6B7280",
                              marginTop: "0.25rem",
                            }}
                          >
                            {delivery.id}
                          </p>
                        </div>
                        <Badge style={getStatusColor(delivery.status)}>
                          {delivery.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "0.5rem",
                            }}
                          >
                            <MapPin
                              style={{
                                width: "1.25rem",
                                height: "1.25rem",
                                color: "#6B7280",
                                marginTop: "0.125rem",
                              }}
                            />
                            <div>
                              <p style={{ fontWeight: 500 }}>
                                {delivery.customer}
                              </p>
                              <p
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#6B7280",
                                }}
                              >
                                {delivery.address}
                              </p>
                              <p
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#F2C94C",
                                  marginTop: "0.25rem",
                                }}
                              >
                                {delivery.distance} away
                              </p>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Phone
                              style={{
                                width: "1.25rem",
                                height: "1.25rem",
                                color: "#6B7280",
                              }}
                            />
                            <p style={{ fontSize: "0.875rem" }}>
                              {delivery.phone}
                            </p>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span
                              style={{ fontSize: "0.875rem", color: "#6B7280" }}
                            >
                              Items:
                            </span>
                            <span style={{ fontWeight: 500 }}>
                              {delivery.items} items
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span
                              style={{ fontSize: "0.875rem", color: "#6B7280" }}
                            >
                              Amount:
                            </span>
                            <span
                              style={{
                                fontSize: "1.125rem",
                                fontWeight: 700,
                                color: "#F2C94C",
                              }}
                            >
                              {delivery.amount}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          paddingTop: "0.5rem",
                        }}
                      >
                        {delivery.status === "assigned" ? (
                          <Button
                            onClick={() => handleAcceptDelivery(delivery.id)}
                            style={{
                              flex: 1,
                              backgroundColor: "#F2C94C",
                              color: "#0A1A3F",
                            }}
                          >
                            <CheckCircle2
                              style={{
                                width: "1rem",
                                height: "1rem",
                                marginRight: "0.5rem",
                              }}
                            />
                            Accept Delivery
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleMarkDelivered(delivery.id)}
                            style={{
                              flex: 1,
                              backgroundColor: "#2BA94C",
                              color: "#FFFFFF",
                            }}
                          >
                            <CheckCircle2
                              style={{
                                width: "1rem",
                                height: "1rem",
                                marginRight: "0.5rem",
                              }}
                            />
                            Mark as Delivered
                          </Button>
                        )}
                        <Button variant="outline" style={{ flex: 1 }}>
                          View Route
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {mockDeliveryHistory.map((delivery) => (
                    <div
                      key={delivery.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem",
                        border: "1px solid #D1D5DB",
                        borderRadius: "0.5rem",
                        transition: "background-color 0.2s",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <p style={{ fontWeight: 500 }}>{delivery.orderId}</p>
                          <Badge
                            style={{
                              fontSize: "0.75rem",
                              border: "1px solid #D1D5DB",
                              padding: "0.125rem 0.5rem",
                            }}
                          >
                            Completed
                          </Badge>
                        </div>
                        <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                          {delivery.customer}
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "#6B7280",
                            marginTop: "0.25rem",
                          }}
                        >
                          {delivery.completedAt}
                        </p>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.25rem",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: 700,
                            color: "#F2C94C",
                          }}
                        >
                          {delivery.amount}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Star
                            style={{
                              width: "0.75rem",
                              height: "0.75rem",
                              color: "#F2C94C",
                            }}
                          />
                          <span style={{ fontSize: "0.875rem" }}>
                            {delivery.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RiderDashboard;
