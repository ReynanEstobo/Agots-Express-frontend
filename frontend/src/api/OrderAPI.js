import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // adjust to your backend URL

// Place a new order
export const placeOrder = async ({
  user_id,
  cartItems,
  total,
  deliveryAddress,
  specialInstructions,
}) => {
  try {
    const res = await axios.post(`${BASE_URL}/orders`, {
      user_id,
      items: cartItems.map((item) => ({
        menu_id: item.menu_id,
        quantity: item.quantity,
        special_instructions: item.specialInstructions || "",
      })),
      total_amount: total,
      delivery_address: deliveryAddress,
      special_instructions: specialInstructions || "",
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
