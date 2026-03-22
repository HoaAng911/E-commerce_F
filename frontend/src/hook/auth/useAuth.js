import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';
import { toast } from 'sonner';

export const useAuth = () => {
  const navigate = useNavigate();
  const { loginAction, registerAction, setError, isLoading } = useAuthStore();
  const [localErrors, setLocalErrors] = useState({});

  // Logic Validate chung
  const validate = (data, type = 'login') => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.email) errors.email = 'Email là bắt buộc';
    else if (!emailRegex.test(data.email)) errors.email = 'Email không hợp lệ';

    if (!data.password) errors.password = 'Mật khẩu là bắt buộc';
    else if (data.password.length < 6) errors.password = 'Mật khẩu tối thiểu 6 ký tự';

    if (type === 'signup' && data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (credentials) => {
    if (!validate(credentials, 'login')) return;
    try {
      await loginAction(credentials);
      navigate('/');
    } catch (err) {
      // Error đã được Store xử lý
    }
  };

  const handleSignup = async (userData) => {
    if (!validate(userData, 'signup')) return;
    try {
      await registerAction(userData);
      toast.success('Đăng ký thành công!');
      navigate('/login');
    } catch (err) {}
  };

  return {
    handleLogin,
    handleSignup,
    localErrors,
    isLoading,
    setLocalErrors
  };
};