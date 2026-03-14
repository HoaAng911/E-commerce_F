import { create } from 'zustand';
import orderApi from '../api/order.service';

const useOrderStore = create((set, get) => ({
  orders: [],           // Danh sách đơn hàng
  currentOrder: null,   // Đơn hàng đang xem chi tiết
  isLoading: false,     // Trạng thái chờ
  error: null,          // Thông báo lỗi

  // Hành động: Đặt hàng
  placeOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await orderApi.createOrder(orderData);
      
      set((state) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false
      }));
      return newOrder; 
    } catch (err) {
      const message = err.response?.data?.message || 'Đặt hàng thất bại';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  // Hành động: Lấy danh sách đơn hàng
  fetchMyOrders: async () => {
    set({ isLoading: true });
    try {
      const data = await orderApi.getMyOrders();
      set({ orders: data, isLoading: false });
    } catch (err) {
      set({ error: 'Không thể tải danh sách đơn hàng', isLoading: false });
    }
  },

  // Hành động: Hủy đơn hàng
  cancelMyOrder: async (orderId) => {
    set({ isLoading: true });
    try {
      const updatedOrder = await orderApi.cancelOrder(orderId);
     
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
        currentOrder: state.currentOrder?.id === orderId ? updatedOrder : state.currentOrder,
        isLoading: false
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || 'Không thể hủy đơn', isLoading: false });
      throw err;
    }
  },

  // Hành động: Lấy chi tiết đơn hàng (Dùng cho trang OrderDetail)
  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await orderApi.getOrderDetails(orderId);
      set({ currentOrder: data, isLoading: false });
      return data;
    } catch (err) {
      set({ error: 'Không thể tải chi tiết đơn hàng', isLoading: false });
      throw err;
    }
  },

  // Hành động: Lấy TUẤT CẢ đơn hàng (Dành cho Admin)
  fetchAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await orderApi.getAllOrders();
      set({ orders: data, isLoading: false });
    } catch (err) {
      set({ error: 'Không thể tải tất cả đơn hàng', isLoading: false });
    }
  },

  // Hành động: Cập nhật trạng thái đơn hàng (Dành cho Admin)
  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrder = await orderApi.updateOrderStatus(orderId, status);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
        currentOrder: state.currentOrder?.id === orderId ? updatedOrder : state.currentOrder,
        isLoading: false
      }));
      return updatedOrder;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Cập nhật thất bại', isLoading: false });
      throw err;
    }
  }
}));

export default useOrderStore;