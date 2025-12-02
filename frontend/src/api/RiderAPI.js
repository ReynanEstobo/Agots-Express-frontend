// api/RiderAPI.js
import axios from "axios";

// Use full backend URL during development so requests hit Express directly.
// Change origin if your backend runs on a different host/port.
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchRiderById = async (id) => {
  const response = await axios.get(`${BASE_URL}/rider/${id}`);
  return response.data;
};
