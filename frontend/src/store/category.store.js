import { create } from 'zustand';
import categoryApi from '../api/category.service';

const useCategoryStore = create((set, get) => ({
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,

  // Actions: Trạng thái loading/error
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Lấy danh sách tất cả danh mục
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await categoryApi.getAll();
      // NestJS thường trả về dữ liệu trực tiếp trong response.data
      set({ categories: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Lấy chi tiết 1 danh mục
  fetchCategoryById: async (id) => {
    set({ loading: true, error: null, selectedCategory: null });
    try {
      const response = await categoryApi.getById(id);
      set({ selectedCategory: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Thêm danh mục mới
  createCategory: async (data) => {
    set({ loading: true });
    try {
      const response = await categoryApi.create(data);
      // Sau khi tạo thành công, cập nhật lại danh sách local
      set((state) => ({ 
        categories: [...state.categories, response.data],
        loading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Cập nhật danh mục
  updateCategory: async (id, data) => {
    set({ loading: true });
    try {
      const response = await categoryApi.update(id, data);
      set((state) => ({
        categories: state.categories.map((cat) => 
          cat.id === id ? response.data : cat
        ),
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Xóa danh mục
  deleteCategory: async (id) => {
    set({ loading: true });
    try {
      await categoryApi.delete(id);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Reset state
  reset: () => set({
    categories: [],
    selectedCategory: null,
    loading: false,
    error: null,
  }),
}));

export default useCategoryStore;