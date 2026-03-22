import { useState } from 'react';
import authApi from '../../api/auth.service';
import useAuthStore from '../../store/auth.store';
import { toast } from 'sonner';

export const useProfile = (initialUser) => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const updateProfile = async (userId, formData) => {
    setLoading(true);
    try {
      const response = await authApi.updateProfile(userId, formData);
      // Cập nhật lại thông tin user trong Store toàn cục
      setUser(response.data);
      toast.success('Cập nhật thông tin thành công!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Logic xử lý mảng địa chỉ (Dùng cho ProfileForm)
  const formatAddresses = (addresses) => {
    return addresses.filter(addr => addr.trim() !== '');
  };

  return {
    updateProfile,
    formatAddresses,
    loading
  };
};