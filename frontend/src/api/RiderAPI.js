import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// -------------------------------
// Fetch rider info
// -------------------------------
export const fetchRiderById = async (riderId) => {
  const res = await axios.get(`${BASE_URL}/rider/${riderId}`);
  return res.data;
};

// -------------------------------
// Fetch deliveries by status
// assigned | on the way | completed
// -------------------------------
export const fetchRiderOrders = async (riderId, status) => {
  const res = await axios.get(`${BASE_URL}/rider/${riderId}/orders`, {
    params: { status },
  });
  return res.data;
};

// -------------------------------
// Fetch rider stats (earnings, deliveries, ratings)
// -------------------------------
export const fetchRiderStats = async (riderId) => {
  const res = await axios.get(`${BASE_URL}/rider/${riderId}/stats`);
  return res.data;
};

// -------------------------------
// Accept a delivery (assigned → on the way)
// -------------------------------
export const acceptDelivery = async (riderId, orderId) => {
  const res = await axios.patch(
    `${BASE_URL}/rider/${riderId}/orders/${orderId}/accept`
  );
  return res.data;
};

// -------------------------------
// Complete delivery (on the way → completed)
// -------------------------------
export const completeDelivery = async (riderId, orderId) => {
  const res = await axios.patch(
    `${BASE_URL}/rider/${riderId}/orders/${orderId}/complete`
  );
  return res.data;
};
