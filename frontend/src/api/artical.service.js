import api from './axios';

const articleApi = {
  findAll: () => api.get('/articles'),

  findBySlug: (slug) => api.get(`/articles/${slug}`),

  create: (data) => api.post('/articles', data),
};

export default articleApi;