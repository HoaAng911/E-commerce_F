import api from '../lib/axios';

const cartApi = {
  
  getCart: () => api.get(`/cart`),

  addToCart: (data) => api.post(`/cart/add`, data),

  updateItem: (data) => api.patch(`/cart/update`, data),

  selectItem: (data) => api.patch(`/cart/select`, data),

  removeItem: (itemId) => api.delete(`/cart/item/${itemId}`),

  clearCart: () => api.delete(`/cart/clear`),
};

export default cartApi;