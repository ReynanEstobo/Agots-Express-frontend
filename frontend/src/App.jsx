import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { SocketProvider } from "./contexts/SocketContext";
import { ToastProvider } from "./hooks/use-toast";

import Analytics from "./components/Analytics.jsx";
import Announcements from "./components/Announcement.jsx";
import Customers from "./components/Customer.jsx";
import Feedback from "./components/Feedback.jsx";
import Login from "./components/Login.jsx";
import Menu from "./components/Menu.jsx";
import OrderMenu from "./components/OrderMenu.jsx";
import Orders from "./components/Orders.jsx";

// Dashboards
import AdminDashboard from "./users/AdminDashboard.jsx";
import CustomerDashboard from "./users/CustomerDashboard.jsx";
import RiderDashboard from "./users/RiderDashboard.jsx";
import StaffDashboard from "./users/StaffDashboard.jsx";

// Landing Page
import Landing from "./components/Landing.jsx";

// Checkout Page
import Checkout from "./components/Checkout.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              {/* Dashboards */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute roles={["customer"]}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff-dashboard"
                element={
                  <ProtectedRoute roles={["staff"]}>
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rider-dashboard"
                element={
                  <ProtectedRoute roles={["rider"]}>
                    <RiderDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Pages */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute roles={["admin", "staff", "rider"]}>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute roles={["admin", "staff"]}>
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/menu"
                element={
                  <ProtectedRoute roles={["admin", "staff"]}>
                    <Menu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute
                    roles={["admin", "staff", "rider", "customer"]}
                  >
                    <Feedback />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/announcements"
                element={
                  <ProtectedRoute roles={["admin", "staff"]}>
                    <Announcements />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              {/* Order menu + checkout */}
              <Route
                path="/order-menu"
                element={
                  <ProtectedRoute roles={["customer"]}>
                    <OrderMenu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute roles={["customer"]}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
