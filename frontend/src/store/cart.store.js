import { create } from 'zustand';
import cartApi from '../api/cart.service';
import useAuthStore from './auth.store'; // Để lấy userId tự động

const useCartStore = create((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  // 1. Lấy dữ liệu giỏ hàng
  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.getCart();
      set({ cart: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Không thể tải giỏ hàng',
        isLoading: false,
      });
    }
  },

  // 2. Thêm sản phẩm (data: { productId, quantity, size, color })
  addToCart: async (data) => {
    set({ isLoading: true });
    try {
      const response = await cartApi.addToCart(data);
      set({ cart: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // 3. Cập nhật số lượng (dùng cho cả tăng/giảm)
  updateItemQuantity: async (cartItemId, quantity) => {
    // Cập nhật tạm thời trên UI (Optimistic Update) cho mượt
    const prevCart = get().cart;
    if (prevCart) {
      const updatedItems = prevCart.items.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      );
      set({ cart: { ...prevCart, items: updatedItems } });
    }

    try {
      const response = await cartApi.updateItem({ cartItemId, quantity });
      set({ cart: response.data });
    } catch (error) {
      // Nếu lỗi thì hoàn tác lại (rollback)
      set({ cart: prevCart });
      console.error(error);
    }
  },

  // 4. Chọn/Bỏ chọn sản phẩm
  selectItem: async (cartItemId, selected) => {
    try {
      const response = await cartApi.selectItem({ cartItemId, selected });
      set({ cart: response.data });
    } catch (error) {
      console.error(error);
    }
  },

  // 5. Xóa 1 sản phẩm
  removeItem: async (itemId) => {
    // Lưu lại trạng thái cũ để hoàn tác nếu lỗi
    const prevCart = get().cart;

    // Cập nhật UI ngay lập tức (Optimistic Update)
    if (prevCart) {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      set({ cart: { ...prevCart, items: updatedItems } });
    }

    try {
      const response = await cartApi.removeItem(itemId);
      set({ cart: response.data, isLoading: false });
    } catch (error) {
      // Hoàn tác nếu gọi API thất bại
      set({ cart: prevCart, error: 'Không thể xóa sản phẩm', isLoading: false });
      console.error("Lỗi xóa sản phẩm:", error);
    }
  },

  // 6. Xóa sạch giỏ hàng
  clearCart: async () => {
    try {
      await cartApi.clearCart();
      set({ cart: { items: [], totalPrice: 0, totalItems: 0 } });
    } catch (error) {
      console.error(error);
    }
  },

  // Reset store (dùng khi logout)
  resetCart: () => set({ cart: null, isLoading: false, error: null }),
}));

export default useCartStore;