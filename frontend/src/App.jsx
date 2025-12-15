import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AlertProvider } from "./contexts/AlertContext"; // Replaced ToastProvider
import { CartProvider } from "./contexts/CartContext";
import { SocketProvider } from "./contexts/SocketContext";

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

// Unauthorized Page
const Unauthorized = () => (
  <div className="flex justify-center items-center min-h-screen">
    <h1 className="text-2xl font-bold">Unauthorized Access</h1>
    <p>You do not have permission to view this page.</p>
  </div>
);

function App() {
  return (
    <AlertProvider>
      {" "}
      {/* Replaced ToastProvider with AlertProvider */}
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
                  <ProtectedRoute roles={["admin"]} fallback={<Unauthorized />}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute
                    roles={["customer"]}
                    fallback={<Unauthorized />}
                  >
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff-dashboard"
                element={
                  <ProtectedRoute roles={["staff"]} fallback={<Unauthorized />}>
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rider-dashboard"
                element={
                  <ProtectedRoute roles={["rider"]} fallback={<Unauthorized />}>
                    <RiderDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Pages */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute
                    roles={["admin", "staff", "rider"]}
                    fallback={<Unauthorized />}
                  >
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute
                    roles={["admin", "staff"]}
                    fallback={<Unauthorized />}
                  >
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/menu"
                element={
                  <ProtectedRoute
                    roles={["admin", "staff"]}
                    fallback={<Unauthorized />}
                  >
                    <Menu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute
                    roles={["admin", "staff", "rider", "customer"]}
                    fallback={<Unauthorized />}
                  >
                    <Feedback />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/announcements"
                element={
                  <ProtectedRoute
                    roles={["admin", "staff"]}
                    fallback={<Unauthorized />}
                  >
                    <Announcements />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute roles={["admin"]} fallback={<Unauthorized />}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              {/* Order menu + checkout */}
              <Route
                path="/order-menu"
                element={
                  <ProtectedRoute
                    roles={["customer"]}
                    fallback={<Unauthorized />}
                  >
                    <OrderMenu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute
                    roles={["customer"]}
                    fallback={<Unauthorized />}
                  >
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </CartProvider>
    </AlertProvider>
  );
}

export default App;
