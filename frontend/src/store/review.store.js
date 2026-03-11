import { create } from 'zustand';
import reviewApi from '../api/review.service';

const useReviewStore = create((set, get) => ({
  reviews: [],
  isLoading: false,
  error: null,

  // Lấy danh sách review cho một sản phẩm cụ thể
  fetchReviewsByProduct: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewApi.findByProduct(productId);
      set({ reviews: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Không thể tải đánh giá',
        isLoading: false,
      });
    }
  },

  // Thêm review mới
  addReview: async (reviewData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewApi.create(reviewData);
      
      // Cập nhật danh sách review local sau khi thêm thành công
      set((state) => ({
        reviews: [response.data, ...state.reviews],
        isLoading: false
      }));
      
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Gửi đánh giá thất bại',
        isLoading: false
      });
      throw error;
    }
  },

  // Xóa review
  deleteReview: async (id) => {
    set({ isLoading: true });
    try {
      await reviewApi.remove(id);
      set((state) => ({
        reviews: state.reviews.filter((r) => r.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Xóa đánh giá thất bại',
        isLoading: false
      });
    }
  },

  clearReviews: () => set({ reviews: [], error: null, isLoading: false })
}));

export default useReviewStore;