// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5009/api",
  timeout: 10000,
});

export default api;

// Then in your components
import api from "../utils/api";

// Use like this:
const response = await api.get(`/blogposts/tag/${tag}`);
