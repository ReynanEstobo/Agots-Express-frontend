import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // adjust to your backend URL

// Place a new order
export const placeOrder = async ({
  customer_id,
  items,
  paymentMethod,
  deliveryAddress,
}) => {
  try {
    const res = await axios.post(`${BASE_URL}/orders/place`, {
      user_id: customer_id,
      items, // directly send items from frontend
      paymentMethod,
      deliveryAddress,
    });
    return res.data;
  } catch (err) {
    console.error("placeOrder error:", err);
    throw err;
  }
};

// Fetch orders for a user
export const fetchUserOrders = async (user_id) => {
  try {
    const res = await axios.get(`${BASE_URL}/orders/user/${user_id}`);
    return res.data;
  } catch (err) {
    console.error("fetchUserOrders error:", err);
    throw err;
  }
};

// Fetch a specific order by ID
export const fetchOrderById = async (order_id) => {
  try {
    const res = await axios.get(`${BASE_URL}/orders/${order_id}`);
    return res.data;
  } catch (err) {
    console.error("fetchOrderById error:", err);
    throw err;
  }
};
