import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Replace with your actual token key
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

// ----------------------------
// Dashboard Stats
// ----------------------------
export const fetchDashboardStats = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/staff/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    return res.data.success ? res.data.data : null;
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    if (err.response?.status === 401) window.location.href = "/login";
    throw err;
  }
};

// ----------------------------
// Active Orders + Riders
// ----------------------------
export const fetchActiveOrders = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/staff/dashboard/orders`, {
      headers: getAuthHeaders(),
    });
    return res.data.success ? res.data.data : null;
  } catch (err) {
    console.error("Error fetching active orders:", err);
    if (err.response?.status === 401) window.location.href = "/login";
    throw err;
  }
};

// ----------------------------
// Update Order Status
// ----------------------------
export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/staff/orders/${orderId}/status`,
      { status },
      { headers: getAuthHeaders() }
    );
    return res.data.success ? res.data : null;
  } catch (err) {
    console.error("Error updating order status:", err);
    if (err.response?.status === 401) window.location.href = "/login";
    throw err;
  }
};

// ----------------------------
// Assign Rider to Order
// ----------------------------
export const assignRiderToOrder = async (orderId, riderId) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/staff/orders/${orderId}/assign`,
      { riderId },
      { headers: getAuthHeaders() }
    );
    return res.data.success ? res.data : null;
  } catch (err) {
    console.error("Error assigning rider:", err);
    if (err.response?.status === 401) window.location.href = "/login";
    throw err;
  }
};
