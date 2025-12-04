// const API_BASE_URL = process.env.BACKEND_URL;

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009/api';

export default API_BASE_URL;