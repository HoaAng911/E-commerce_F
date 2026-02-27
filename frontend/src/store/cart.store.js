import { create } from 'zustand';
import cartApi from '../api/cart.service';
import useAuthStore from './auth.store'; // Để lấy userId tự động

const useCartStore = create((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  // Lấy userId từ authStore
  getUserId: () => useAuthStore.getState().user?.id,

  // 1. Lấy dữ liệu giỏ hàng
  fetchCart: async () => {
    const userId = get().getUserId();
    if (!userId) return;

    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.getCart(userId);
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
    const userId = get().getUserId();
    if (!userId) throw new Error('Vui lòng đăng nhập');

    set({ isLoading: true });
    try {
      const response = await cartApi.addToCart(userId, data);
      set({ cart: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // 3. Cập nhật số lượng (dùng cho cả tăng/giảm)
  updateItemQuantity: async (cartItemId, quantity) => {
    const userId = get().getUserId();
    if (!userId) return;

    // Cập nhật tạm thời trên UI (Optimistic Update) cho mượt
    const prevCart = get().cart;
    if (prevCart) {
      const updatedItems = prevCart.items.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      );
      set({ cart: { ...prevCart, items: updatedItems } });
    }

    try {
      const response = await cartApi.updateItem(userId, { cartItemId, quantity });
      set({ cart: response.data });
    } catch (error) {
      // Nếu lỗi thì hoàn tác lại (rollback)
      set({ cart: prevCart });
      console.error(error);
    }
  },

  // 4. Chọn/Bỏ chọn sản phẩm
  selectItem: async (cartItemId, selected) => {
    const userId = get().getUserId();
    if (!userId) return;

    try {
      const response = await cartApi.selectItem(userId, { cartItemId, selected });
      set({ cart: response.data });
    } catch (error) {
      console.error(error);
    }
  },

  // 5. Xóa 1 sản phẩm
  removeItem: async (itemId) => {
    const userId = get().getUserId();
    if (!userId) return;

    try {
      const response = await cartApi.removeItem(userId, itemId);
      set({ cart: response.data });
    } catch (error) {
      console.error(error);
    }
  },

  // 6. Xóa sạch giỏ hàng
  clearCart: async () => {
    const userId = get().getUserId();
    if (!userId) return;

    try {
      await cartApi.clearCart(userId);
      set({ cart: { items: [], totalPrice: 0, totalItems: 0 } });
    } catch (error) {
      console.error(error);
    }
  },

  // Reset store (dùng khi logout)
  resetCart: () => set({ cart: null, isLoading: false, error: null }),
}));

export default useCartStore;