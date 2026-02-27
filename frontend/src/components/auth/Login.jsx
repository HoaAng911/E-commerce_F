
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import useAuthStore from '../../store/auth.store';

export default function Login() {
  const { login, isLoading, error, setError, setLoading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
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

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErrors({});
    if (error) setError(null);

    if (!validateForm()) return;

    try {
      const userData = {
        email: form.email.trim(),
        password: form.password,
      };
      await login(userData);
      alert('Đăng nhập thành công');
      navigate('/');
    } catch (err) {
      console.error('Đăng nhập thất bại:', err);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mở popup đăng nhập Facebook
      window.open(
        'http://localhost:3001/auth/facebook',
        'facebook-login',
        'width=600,height=600,scrollbars=yes'
      );
      
      // Lắng nghe message từ popup
      const messageHandler = (event) => {
        if (event.origin !== 'http://localhost:3001') return;
        
        if (event.data.type === 'facebook-login-success') {
          const { access_token, user } = event.data;
          
          useAuthStore.setState({
            accessToken: access_token,
            user: user,
            isLoading: false,
          });
          
          alert('Đăng nhập bằng Facebook thành công!');
          navigate('/');
          window.removeEventListener('message', messageHandler);
        } else if (event.data.type === 'facebook-login-error') {
          setError(event.data.message || 'Đăng nhập Facebook thất bại');
          setLoading(false);
          window.removeEventListener('message', messageHandler);
        }
      };
      
      window.addEventListener('message', messageHandler);
    } catch (err) {
      setError('Đăng nhập Facebook thất bại');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-white">
      <div className="w-full max-w-sm">
        {/* Title */}
        <h1 className="mb-8 text-2xl font-bold text-center text-gray-900 uppercase">
          ĐĂNG NHẬP
        </h1>

        {/* Global Error từ store */}
        {error && (
          <div className="px-4 py-3 mb-6 text-sm text-center text-red-700 border border-red-200 rounded-md bg-red-50">
            {error}
          </div>
        )}

        {/* Form Email/Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            {localErrors.email && (
              <p className="mt-1 text-xs text-red-600">{localErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Mật khẩu *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            {localErrors.password && (
              <p className="mt-1 text-xs text-red-600">{localErrors.password}</p>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center flex-1 py-2 font-semibold text-white transition-colors bg-black rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
            <Link
              to="/forgot-password"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 text-sm text-gray-500 uppercase bg-white">HOẶC</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          {/* Facebook Button */}
          <button
            onClick={handleFacebookLogin}
            disabled={isLoading}
            className="flex items-center justify-center w-full h-12 px-4 space-x-3 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaFacebookF className="w-5 h-5 text-white" />
            <span>Đăng nhập bằng Facebook</span>
          </button>

          {/* Google Login Button - TẮT AUTO LOGIN */}
          <div className="w-full">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const credential = credentialResponse.credential;
                if (!credential) return;

                setLoading(true);
                setError(null);

                try {
                  const res = await fetch('http://localhost:3000/auth/google/credential', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ credential }),
                  });

                  if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || 'Đăng nhập Google thất bại');
                  }

                  const data = await res.json();

                  useAuthStore.setState({
                    accessToken: data.access_token,
                    user: data.user,
                    isLoading: false,
                  });

                  alert('Đăng nhập bằng Google thành công!');
                  navigate('/');
                } catch (err) {
                  setError(err.message || 'Đăng nhập Google thất bại');
                  setLoading(false);
                }
              }}
              onError={() => {
                setError('Đăng nhập Google thất bại');
              }}
              // QUAN TRỌNG: Tắt các tính năng tự động đăng nhập
              useOneTap={false}
              auto_select={false}
              ux_mode="popup"
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              logo_alignment="left"
              width='384px'
              height='48px'
              containerProps={{
                style: {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center'
                }
              }}
            />
          </div>
        </div>

        {/* Register link */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 underline hover:text-blue-700">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
