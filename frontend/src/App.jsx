import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./hooks/use-toast"; // Toast context wrapper

import Announcements from "./components/Announcement.jsx";
import Customers from "./components/Customer.jsx";
import Feedback from "./components/Feedback.jsx";
import Login from "./components/Login.jsx";
import Menu from "./components/Menu.jsx";
import Orders from "./components/Orders.jsx";

import AdminDashboard from "./users/AdminDashboard.jsx";
import CustomerDashboard from "./users/CustomerDashboard.jsx";
import RiderDashboard from "./users/RiderDashboard.jsx";
import StaffDashboard from "./users/StaffDashboard.jsx";

import Analytics from "./components/Analytics.jsx"; // ✅ ADDED IMPORT

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Default route → Login page */}
          <Route path="/" element={<Login />} />

          {/* Dashboards for each role */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/rider-dashboard" element={<RiderDashboard />} />

          {/* Pages */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/announcements" element={<Announcements />} />

          {/* ✅ NEW ANALYTICS ROUTE */}
          <Route path="/analytics" element={<Analytics />} />

          {/* Optional: 404 Not Found */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
