import api from './axios';

const cartApi = {
  
  getCart: (userId) => api.get(`/cart/${userId}`),

  addToCart: (userId, data) => api.post(`/cart/add/${userId}`, data),

  updateItem: (userId, data) => api.patch(`/cart/update/${userId}`, data),

  selectItem: (userId, data) => api.patch(`/cart/select/${userId}`, data),

  removeItem: (userId, itemId) => api.delete(`/cart/item/${userId}/${itemId}`),

  clearCart: (userId) => api.delete(`/cart/clear/${userId}`),
};

export default cartApi;