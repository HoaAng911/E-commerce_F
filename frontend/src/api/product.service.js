// api/product.js
import api from './axios';

const productApi = {
  // ===== PAGINATION =====
  getPaginated: (params) => api.get('/products/paginated', { params }),

  // Lấy tất cả sản phẩm (cũ)
  getAll: (params) => api.get('/products', { params }),

  // Lấy sản phẩm theo ID
  getById: (id) => api.get(`/products/${id}`),

  // Lấy sản phẩm theo slug
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),

  // Tạo sản phẩm mới
  create: (data) => api.post('/products', data),

  // Cập nhật sản phẩm
  update: (id, data) => api.patch(`/products/${id}`, data),

  // Xóa sản phẩm
  delete: (id) => api.delete(`/products/${id}`),

  // ===== HOMEPAGE =====
  getHomepageData: () => api.get('/products/homepage/data'),

  getFeatured: (limit) => api.get('/products/homepage/featured', { params: { limit } }),

  getNewArrivals: (limit) => api.get('/products/homepage/new-arrivals', { params: { limit } }),

  getBestSellers: (limit) => api.get('/products/homepage/best-sellers', { params: { limit } }),

  getDiscounted: (limit) => api.get('/products/homepage/discounted', { params: { limit } }),

  getTopRated: (limit) => api.get('/products/homepage/top-rated', { params: { limit } }),

  getFlashSale: (limit) => api.get('/products/homepage/flash-sale', { params: { limit } }),

  // ===== FILTER =====
  getByBrand: (brand, limit) => api.get(`/products/brand/${brand}`, { params: { limit } }),
};

export default productApi;