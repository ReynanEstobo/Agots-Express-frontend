import { CreditCard, UtensilsCrossed, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../hooks/use-toast";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { RadioGroup, RadioGroupItem } from "../ui/Radio-group";
import { Separator } from "../ui/Separator";
import { Textarea } from "../ui/Textarea";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import { placeOrder } from "../api/OrderAPI";

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Balayan bounds
const BALAYAN_BOUNDS = { north: 14.0, south: 13.9, east: 120.78, west: 120.69 };

// Clamp coordinates to Balayan
const clampToBounds = (lat, lng) => [
  Math.max(BALAYAN_BOUNDS.south, Math.min(BALAYAN_BOUNDS.north, lat)),
  Math.max(BALAYAN_BOUNDS.west, Math.min(BALAYAN_BOUNDS.east, lng)),
];

// Draggable Marker
const DraggableMarker = ({ coordinates, setCoordinates, setAddress }) => {
  const [position, setPosition] = useState(coordinates);

  const map = useMapEvents({
    click(e) {
      const [lat, lng] = clampToBounds(e.latlng.lat, e.latlng.lng);
      setPosition([lat, lng]);
      setCoordinates([lat, lng]);
      fetchAddress(lat, lng);
    },
  });

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      setAddress(data.display_name || "");
    } catch {
      setAddress("");
    }
  };

  useEffect(() => {
    if (position) fetchAddress(position[0], position[1]);
  }, []);

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const latlng = clampToBounds(
            marker.getLatLng().lat,
            marker.getLatLng().lng
          );
          setPosition([latlng[0], latlng[1]]);
          setCoordinates([latlng[0], latlng[1]]);
          fetchAddress(latlng[0], latlng[1]);
        },
      }}
    />
  );
};

// Map Selector
const MapSelector = ({ coordinates, setCoordinates, setAddress }) => (
  <MapContainer
    center={coordinates}
    zoom={14}
    style={{ height: "300px", width: "100%", borderRadius: "10px" }}
    scrollWheelZoom={false}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <DraggableMarker
      coordinates={coordinates}
      setCoordinates={setCoordinates}
      setAddress={setAddress}
    />
  </MapContainer>
);

// Checkout Component
const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [coordinates, setCoordinates] = useState([13.9503, 120.7334]);
  const [address, setAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [instructions, setInstructions] = useState("");
  const deliveryFee = 50;
  const finalTotal = paymentMethod === "cash" ? total + deliveryFee : total;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !phone || !address) {
      addToast({
        title: "Missing Information",
        description: "Please fill all required fields.",
      });
      return;
    }

    if (!items || items.length === 0) {
      addToast({
        title: "Cart Empty",
        description: "Add items to your cart before placing an order.",
      });
      return;
    }

    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
      addToast({
        title: "Not Logged In",
        description: "Please log in to place an order.",
      });
      return;
    }

    try {
      const orderData = {
        customer_id: userId,
        items: items.map((item) => ({
          menu_id: item.menu_id || item.id,
          quantity: item.quantity,
          price: item.price,
          special_instructions: item.specialInstructions || "",
        })),
        paymentMethod,
        deliveryAddress: {
          first_name: firstName,
          last_name: lastName,
          phone,
          email,
          address,
          delivery_instructions: instructions,
          latitude: coordinates[0],
          longitude: coordinates[1],
        },
      };

      const res = await placeOrder(orderData);

      addToast({
        title: "Order Placed!",
        description: `Your order #${res.order_id} has been confirmed.`,
      });

      clearCart();
      navigate("/customer-dashboard");
    } catch (err) {
      addToast({ title: "Failed to place order", description: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-[hsl(var(--primary))] text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-[hsl(var(--accent))] flex items-center justify-center">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Checkout</h1>
            <p className="text-xs text-white/70">Complete your order</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MapSelector
                    coordinates={coordinates}
                    setCoordinates={setCoordinates}
                    setAddress={setAddress}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="manualAddress">Address *</Label>
                    <Input
                      id="manualAddress"
                      value={address}
                      placeholder="Type your address here..."
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryInstructions">
                      Delivery Instructions
                    </Label>
                    <Textarea
                      id="deliveryInstructions"
                      placeholder="Any special instructions..."
                      rows={3}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer mb-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label
                        htmlFor="cash"
                        className="flex items-center gap-2 flex-1 cursor-pointer"
                      >
                        <Wallet className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-semibold">Cash on Delivery</div>
                          <div className="text-sm text-gray-400">
                            Pay when you receive your order
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-2 flex-1 cursor-pointer"
                      >
                        <CreditCard className="h-5 w-5 text-[hsl(var(--accent))]" />
                        <div>
                          <div className="font-semibold">Credit/Debit Card</div>
                          <div className="text-sm text-gray-400">
                            Pay securely online
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="flex-1">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-semibold">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₱{total.toFixed(2)}</span>
                    </div>
                    {paymentMethod === "cash" && (
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>₱{deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-[hsl(var(--accent))]">
                      ₱{finalTotal.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--primary))] py-3 text-base"
                  >
                    Place Order
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    By placing your order, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
