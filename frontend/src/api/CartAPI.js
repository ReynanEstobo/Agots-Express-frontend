import axios from "axios";

const CART_API_URL = "http://localhost:5000/api/cart";

// Generic API request handler
const apiRequest = async (method, url, data = null, headers = {}) => {
  try {
    const config = { method, url, data, headers };
    const response = await axios(config);
    return response.data;
  } catch (err) {
    console.error(
      `API Error (${method} ${url}):`,
      err.response ? err.response.data : err.message
    );
    throw new Error(
      err.response ? err.response.data.message : "An error occurred"
    );
  }
};

// ------------------- CART API -------------------

// Get cart items for a user
export const fetchCartItems = async (user_id) =>
  apiRequest("GET", `${CART_API_URL}/${user_id}`);

// Add a cart item or increment quantity
export const addCartItem = async ({ user_id, menu_id, quantity = 1 }) =>
  apiRequest("POST", `${CART_API_URL}/add`, { user_id, menu_id, quantity });

// Update cart item quantity or special instructions
export const updateCartItem = async ({
  user_id,
  menu_id,
  quantity,
  specialInstructions,
}) =>
  apiRequest("PUT", `${CART_API_URL}/update`, {
    user_id,
    menu_id,
    quantity,
    specialInstructions,
  });

// Remove a cart item
export const removeCartItem = async (user_id, menu_id) =>
  apiRequest("DELETE", `${CART_API_URL}/remove/${user_id}/${menu_id}`);

// Clear all cart items for a user
export const clearCartItems = async (user_id) =>
  apiRequest("DELETE", `${CART_API_URL}/clear/${user_id}`);
