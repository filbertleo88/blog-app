// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 10000,
});

export default api;
