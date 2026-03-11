import api from '../lib/axios';

const reviewApi = {

  findByProduct: (productId) => api.get(`/reviews`, { params: { productId } }),

  create: (data) => api.post('/reviews', data),

  update: (id, data) => api.patch(`/reviews/${id}`, data),

  remove: (id) => api.delete(`/reviews/${id}`),
};

export default reviewApi;