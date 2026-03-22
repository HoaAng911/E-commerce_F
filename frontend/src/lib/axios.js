import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/",
  withCredentials: true,
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Dùng axios thuần để tránh import vòng (Circular Dependency)
        const response = await axios.post(`${api.defaults.baseURL}auth/refresh`, {}, {
          withCredentials: true // Gửi cookie chứa refresh_token
        });
        const { access_token } = response.data;
        
        // Cập nhật accessToken trong auth-storage (JSON định dạng của zustand persist)
        const storage = JSON.parse(localStorage.getItem('auth-storage'));
        if (storage) {
          storage.state.accessToken = access_token;
          localStorage.setItem('auth-storage', JSON.stringify(storage));
        }

        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        processQueue(null, access_token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;