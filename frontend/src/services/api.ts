import axios from "axios";

// Ganti port 3000 dengan port backend Anda jika berbeda
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Menambahkan token JWT otomatis ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;