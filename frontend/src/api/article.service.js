import api from '../lib/axios';

const articleApi = {
  findAll: () => api.get('/articles'),

  findBySlug: (slug) => api.get(`/articles/${slug}`),

  create: (data) => api.post('/articles', data),

  update: (id, data) => api.patch(`/articles/${id}`, data),

  delete: (id) => api.delete(`/articles/${id}`),

  getAllForAdmin: () => api.get('/articles/admin/all'),
};

export default articleApi;