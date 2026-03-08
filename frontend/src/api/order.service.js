import axios from './axios';

const orderApi = {
  // 1. Tạo đơn hàng mới
  // Payload bao gồm: fullName, phone, address, note, paymentMethod
  createOrder: async (orderData) => {
    const response = await axios.post('/orders', orderData);
    return response.data;
  },

  // 2. Lấy danh sách đơn hàng của người dùng hiện tại
  getMyOrders: async () => {
    const response = await axios.get('/orders/my-orders');
    return response.data;
  },

  // 3. Lấy chi tiết một đơn hàng cụ thể theo ID
  getOrderDetails: async (orderId) => {
    const response = await axios.get(`/orders/${orderId}`);
    return response.data;
  },

  // 4. Hủy đơn hàng (Chỉ áp dụng cho đơn hàng trạng thái 'pending')
  cancelOrder: async (orderId) => {
    const response = await axios.patch(`/orders/${orderId}/cancel`);
    return response.data;
  }
};

export default orderApi;