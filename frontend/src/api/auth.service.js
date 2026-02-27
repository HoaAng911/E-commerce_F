// api/auth.service.js
import api from './axios';

const authApi = {
  // Đăng ký
  register: (data) => api.post('/auth/register', data),

  // Đăng nhập
  login: (credentials) => api.post('/auth/login', credentials),

  // Refresh token
  refreshToken: () => api.post('/auth/refresh'),

  // Đăng xuất
  logout: () => api.post('/auth/logout'),

  // Lấy thông tin user hiện tại
  getMe: () => api.get('/auth/me'),
  getProfile: () => api.get('/auth/profile'),

  // Cập nhật profile
  updateProfile: (data) => api.put('/auth/profile', data),

  // Đổi mật khẩu
  changePassword: (data) => api.post('/auth/change-password', data),
};

export default authApi;