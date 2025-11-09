import axios from "axios";

 const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ✅ points to backend
  withCredentials: true, // ✅ allow cookies (JWT)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

