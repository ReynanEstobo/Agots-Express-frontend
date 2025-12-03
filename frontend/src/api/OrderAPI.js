import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

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

/**
 * Place a new order
 * @param {Object} orderData - {
 *   customer_id: number,
 *   items: [{ menu_id, quantity, price }],
 *   paymentMethod: 'cash' | 'card',
 *   deliveryAddress: {
 *     first_name, last_name, phone, email, address, delivery_instructions, latitude, longitude
 *   }
 * }
 */
export const placeOrder = async (orderData) => {
  if (
    !orderData.customer_id ||
    !orderData.items?.length ||
    !orderData.deliveryAddress
  ) {
    throw new Error("Customer, items, and delivery address are required");
  }

  return apiRequest("POST", API_URL, orderData, { "Content-Type": "application/json" });
};
