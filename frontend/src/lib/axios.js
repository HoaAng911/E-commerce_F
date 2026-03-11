import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true, // Để gửi refresh token qua cookie
});

api.interceptors.request.use((config) => {
  const storage = localStorage.getItem('auth-storage');
  if (storage) {
    const { state } = JSON.parse(storage);
    if (state.accessToken) {
      config.headers.Authorization = `Bearer ${state.accessToken}`;
    }
  }
  return config;
});

// Interceptor cho Response (để handle logout hoặc refresh token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Khi bị 401, xóa sạch local và đẩy về login
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;