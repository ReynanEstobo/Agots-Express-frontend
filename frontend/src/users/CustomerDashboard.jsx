import { Calendar, Clock, LogOut, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { ProvideOrderFeedback } from "../ui/ProvideOrderFeedback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";

import {
  fetchCustomerOrderHistory,
  fetchCustomerOrders,
  fetchCustomerProfile,
  fetchCustomerStats,
  updateCustomerProfile,
} from "../api/CustomerAPI";

import { fetchAnnouncements } from "../api/AnnouncementAPI";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });
  const [announcements, setAnnouncements] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // --- Load all data on mount ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await fetchCustomerProfile();
        if (profileRes.success) {
          const { first_name, email, phone, address } = profileRes.data;
          setProfile({ fullName: first_name, email, phone, address });
        }

        const ordersRes = await fetchCustomerOrders();
        if (ordersRes.success) setOrders(ordersRes.data);

        const historyRes = await fetchCustomerOrderHistory();
        if (historyRes.success) setCompletedOrders(historyRes.data);

        const statsRes = await fetchCustomerStats();
        if (statsRes.success) setStats(statsRes.data);

        const announceRes = await fetchAnnouncements();
        if (Array.isArray(announceRes)) setAnnouncements(announceRes);
      } catch (err) {
        console.error("Error loading customer dashboard data:", err);
      }
    };

    loadData();
  }, []);

  // --- Announcement rotation ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (announcements.length > 0) {
        setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements]);

  // --- Profile handlers ---
  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSaveProfile = async () => {
    try {
      const res = await updateCustomerProfile({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
      });
      if (res.success) {
        alert("Profile updated successfully!");
        setEditModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  // --- Helpers ---
  const getTypeColor = (type) => {
    const map = {
      update: "bg-blue-500 text-white",
      promo: "bg-pink-500 text-white",
      alert: "bg-red-500 text-white",
      event: "bg-green-500 text-white",
      info: "bg-purple-500 text-white",
    };
    return map[type] || "bg-gray-300 text-black";
  };

  const getStatusColor = (status) => {
    const map = {
      pending: "bg-yellow-400 text-white",
      preparing: "bg-yellow-400 text-white",
      ready: "bg-blue-500 text-white",
      "on the way": "bg-blue-500 text-white",
      delivered: "bg-green-600 text-white",
    };
    return map[status.toLowerCase()] || "bg-gray-300 text-black";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1c2540] pb-16 md:pb-16">
      {/* HEADER */}
      <header className="bg-[#1c2540] text-white border-b border-[#1c254040]">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                className="w-6 h-6 cursor-pointer transition-all duration-100 hover:animate-pulse"
              >
                <path
                  fill="#000000"
                  d="M30.456 20.765c0 2.024-1.844 4.19-4.235 4.19v34.164c0 4.851-6.61 4.851-6.61 0V24.955c-2.328 0-4.355-1.793-4.355-4.479V1.674c0-1.636 2.364-1.698 2.364.064v13.898h1.98V1.61c0-1.503 2.278-1.599 2.278.064v13.963h2.046V1.63c0-1.572 2.21-1.635 2.21.062v13.945h2.013V1.63c0-1.556 2.309-1.617 2.309.062v19.074zm17.633-14.72v53.059c0 4.743-6.624 4.673-6.624 0V38.051h-3.526V6.045c0-7.451 10.151-7.451 10.151 0z"
                />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-bold">
              Agot's Restaurant
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/order-menu">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm sm:text-base px-3 sm:px-4 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  className="w-4 h-4 mr-2"
                >
                  <path
                    fill="#000000"
                    d="M30.456 20.765c0 2.024-1.844 4.19-4.235 4.19v34.164c0 4.851-6.61 4.851-6.61 0V24.955c-2.328 0-4.355-1.793-4.355-4.479V1.674c0-1.636 2.364-1.698 2.364.064v13.898h1.98V1.61c0-1.503 2.278-1.599 2.278.064v13.963h2.046V1.63c0-1.572 2.21-1.635 2.21.062v13.945h2.013V1.63c0-1.556 2.309-1.617 2.309.062v19.074zm17.633-14.72v53.059c0 4.743-6.624 4.673-6.624 0V38.051h-3.526V6.045c0-7.451 10.151-7.451 10.151 0z"
                  />
                </svg>
                Order Now
              </Button>
            </Link>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base px-3 sm:px-4 py-2"
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/";
              }}
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* WELCOME */}
        <div className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 bg-[#1c2540]">
            <AvatarFallback className="text-lg sm:text-xl text-white">
              {profile.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome back, {profile.fullName || "Customer"}!
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Manage your orders and profile
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Total Recent Orders
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-yellow-400/20">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Spent</p>
                <p className="text-xl sm:text-2xl font-bold">
                  ₱{stats.totalSpent}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-[#3b4a6b1a]">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#3b4a6b]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ANNOUNCEMENTS - Using Header Color Scheme */}
        {announcements.length > 0 && (
          <div className="mb-6 sm:mb-8 w-full">
            <div className="bg-[#1c2540] rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
              {/* Announcement Header */}
              <div className="bg-[#1c2540] px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#1c254040]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium text-sm sm:text-base">
                    Announcement
                  </span>
                </div>
                <Badge
                  className={`${getTypeColor(
                    announcements[currentAnnouncement].type
                  )} text-xs sm:text-sm font-medium`}
                >
                  {announcements[currentAnnouncement].type.toUpperCase()}
                </Badge>
              </div>

              {/* Announcement Content */}
              <div className="bg-white p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {announcements[currentAnnouncement].title}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
                  {announcements[currentAnnouncement].content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(announcements[currentAnnouncement].date)}
                    </span>
                  </div>

                  {/* Progress Indicators */}
                  <div className="flex items-center gap-1">
                    {announcements.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentAnnouncement(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentAnnouncement === index
                            ? "bg-yellow-400 w-6"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to announcement ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEPARATOR - Only show when tabs become nav at bottom (mobile) */}
        <div className="relative mb-6 sm:mb-8 sm:hidden">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#f5f5f5] text-gray-500">Your Orders</span>
          </div>
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Desktop Tabs - Centered */}
          <div className="flex justify-center mb-4 sm:mb-6 hidden sm:block">
            <TabsList className="flex gap-6 sm:gap-8">
              <TabsTrigger value="recent">Recent Order</TabsTrigger>
              <TabsTrigger value="completed">My Orders</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
          </div>

          {/* RECENT ORDERS */}
          <TabsContent value="recent" className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No recent orders.
              </p>
            ) : (
              orders.map((order) => (
                <Card
                  key={order.id}
                  className="mb-4 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base sm:text-lg">
                          #{order.id}
                        </span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div>
                        {order.items?.map((item, idx) => (
                          <p
                            key={idx}
                            className="text-gray-700 text-sm sm:text-base"
                          >
                            {item}
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                        {formatDate(order.created_at)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-bold text-yellow-500">
                        ₱{order.total_amount}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* COMPLETED ORDERS */}
          <TabsContent value="completed" className="space-y-4">
            {completedOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No completed orders.
              </p>
            ) : (
              completedOrders.map((order) => (
                <Card
                  key={order.id}
                  className="mb-4 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base sm:text-lg">
                          #{order.id}
                        </span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div>
                        {order.items?.map((item, idx) => (
                          <p
                            key={idx}
                            className="text-gray-700 text-sm sm:text-base"
                          >
                            {item}
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                        {formatDate(order.completed_at)}
                      </div>
                    </div>
                    <div className="text-right flex flex-col gap-2 items-end">
                      <p className="text-xl sm:text-2xl font-bold text-yellow-500">
                        ₱{order.total_amount}
                      </p>
                      <ProvideOrderFeedback
                        orderId={order.id}
                        style={{
                          backgroundColor: "#f2c94c",
                          color: "#1c2540",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* PROFILE */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="shadow-md rounded-xl border border-gray-200 p-4 sm:p-6">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow-sm text-sm sm:text-base px-4 py-2"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden md:hidden z-50">
        <div className="flex justify-around py-2">
          <button
            onClick={() => setActiveTab("recent")}
            className={`flex-1 py-3 px-4 text-center ${
              activeTab === "recent"
                ? "text-[#1c2540] font-medium"
                : "text-gray-500"
            }`}
          >
            <div className="flex flex-col items-center">
              <ShoppingBag className="w-5 h-5 mb-1" />
              <span className="text-xs">Recent</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-3 px-4 text-center ${
              activeTab === "completed"
                ? "text-[#1c2540] font-medium"
                : "text-gray-500"
            }`}
          >
            <div className="flex flex-col items-center">
              <Clock className="w-5 h-5 mb-1" />
              <span className="text-xs">Orders</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 px-4 text-center ${
              activeTab === "profile"
                ? "text-[#1c25-40] font-medium"
                : "text-gray-500"
            }`}
          >
            <div className="flex flex-col items-center">
              <Avatar className="h-5 w-5 mb-1">
                <AvatarFallback className="text-xs">
                  {profile.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">Profile</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
