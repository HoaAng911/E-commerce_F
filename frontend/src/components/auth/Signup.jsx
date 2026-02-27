// components/Auth/RegisterForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store'

export default function RegisterForm() {
  const { register, isLoading, error, setError } = useAuthStore()

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [localErrors, setLocalErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};


    const email = form.email?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email là bắt buộc';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Vui lòng nhập địa chỉ email hợp lệ';
    }


    if (!form.password) {
      errors.password = 'Mật khẩu là bắt buộc';
    } else if (form.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }


    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu không khớp';
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    setLocalErrors({});
    if (error) setError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {

      const userData = {
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword

      };
      const response = await register(userData);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');

    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (localErrors[name]) {
      setLocalErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="p-8 rounded-lg">
          {/* Title */}
          <h2 className="mb-8 text-2xl font-bold text-center text-gray-900 uppercase">
            Đăng ký
          </h2>

          {/* Server Error từ store */}
          {error && (
            <div className="px-4 py-3 mb-6 text-sm text-center text-red-700 border border-red-200 rounded-md bg-red-50">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Nhập email"
                className={`w-full px-4 py-3 transition border rounded-md focus:outline-none focus:ring-1 focus:ring-black ${localErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {localErrors.email && (
                <p className="mt-1 text-sm text-red-500">{localErrors.email}</p>
              )}
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className={`w-full px-4 py-3 transition border rounded-md focus:outline-none focus:ring-1 focus:ring-black ${localErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {localErrors.password && (
                <p className="mt-1 text-sm text-red-500">{localErrors.password}</p>
              )}
            </div>

            {/* Nhắc lại mật khẩu */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Nhắc lại mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                className={`w-full px-4 py-3 transition border rounded-md focus:outline-none focus:ring-1 focus:ring-black ${localErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {localErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{localErrors.confirmPassword}</p>
              )}
            </div>

            {/* Divider với "or" */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white">
                  <div className="flex items-center justify-center w-10 h-10 text-xs font-bold text-gray-500 border-2 border-gray-300 rounded-full">
                    or
                  </div>
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-medium text-white transition bg-black rounded-md hover:bg-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>

            {/* Footer Note */}
            <p className="mt-6 text-xs leading-relaxed text-center text-gray-600">
              Thông tin cá nhân của bạn sẽ được dùng để điền vào hóa đơn,
              <br />
              giúp bạn thanh toán nhanh chóng và dễ dàng
            </p>

            {/* Login Link */}
            <p className="mt-6 text-sm text-center">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-semibold text-blue-600 underline hover:text-blue-700"
              >
                Đăng nhập ngay
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}