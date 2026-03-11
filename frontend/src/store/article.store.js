import { create } from 'zustand';
import articleApi from '../api/article.service';

const useArticleStore = create((set, get) => ({
  articles: [],
  currentArticle: null,
  isLoading: false,
  error: null,

  // Hành động: Lấy tất cả bài viết
  fetchArticles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await articleApi.findAll();
      set({ articles: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Không thể tải danh sách bài viết', 
        isLoading: false 
      });
    }
  },

  // Hành động: Lấy chi tiết bài viết theo slug
  fetchArticleBySlug: async (slug) => {
    set({ isLoading: true, error: null, currentArticle: null });
    try {
      const response = await articleApi.findBySlug(slug);
      set({ currentArticle: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Không tìm thấy bài viết', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Hành động: Tạo bài viết mới
  createArticle: async (articleData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await articleApi.create(articleData);
      // Sau khi tạo xong, có thể thêm vào danh sách hiện tại
      set((state) => ({
        articles: [response.data, ...state.articles],
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Tạo bài viết thất bại', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Reset trạng thái bài viết hiện tại (dùng khi thoát trang chi tiết)
  clearCurrentArticle: () => set({ currentArticle: null, error: null })
}));

export default useArticleStore;