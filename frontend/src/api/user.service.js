import axios from '../lib/axios';

const userService = {
  // Lấy danh sách toàn bộ người dùng (có hỗ trợ phân trang)
  getAllUsers: async (page = 1, limit = 10) => {
    const response = await axios.get('/users', {
      params: { page, limit }
    });
    return response.data;
  },

  // Cập nhật trạng thái người dùng (Khóa / Mở khóa)
  updateUserStatus: async (id, isActive) => {
    const response = await axios.patch(`/users/${id}`, { isActive });
    return response.data;
  },

  // Xóa cứng người dùng
  deleteUser: async (id) => {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
  }
};

export default userService;
