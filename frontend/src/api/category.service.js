import api from './axios';

const categoryApi = {
  // Lấy tất cả danh mục
  getAll: () => api.get('/categories'),

  // Lấy chi tiết một danh mục
  getById: (id) => api.get(`/categories/${id}`),

  // Tạo danh mục mới
  create: (data) => api.post('/categories', data),

  // Cập nhật danh mục
  update: (id, data) => api.patch(`/categories/${id}`, data),

  // Xóa danh mục
  delete: (id) => api.delete(`/categories/${id}`),
};

export default categoryApi;