import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/auth.store';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileInfo from '../components/profile/ProfileInfo';
import { User, LogOut, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, currentUser, getProfile, updateProfile, logout } = useAuthStore();
  const currentUserData = currentUser() || user;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false); // Trạng thái tải profile lần đầu
  const [message, setMessage] = useState({ type: '', text: '' });

  // Lấy profile khi component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setFetchingProfile(true);
      try {
        await getProfile();
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setFetchingProfile(false);
      }
    };

    // Luôn gọi fetchProfile khi vào trang để đảm bảo data mới nhất từ DB
    fetchProfile();

  }, [getProfile]); // Thêm getProfile vào dependency

  const handleUpdateProfile = async (formData) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Lọc các trường undefined hoặc null
      const filteredData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      await updateProfile(filteredData);

      setMessage({
        type: 'success',
        text: 'Cập nhật thông tin thành công!'
      });
      setIsEditing(false);

      // Refresh profile data
      await getProfile();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Cập nhật thất bại'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Màn hình Skeleton Loading
  if (fetchingProfile) {
    return (
      <div className="min-h-screen px-4 py-8 bg-gray-50 md:py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="w-1/3 h-10 mx-auto bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="h-32 p-6 border-b border-gray-100 md:p-8 animate-pulse bg-gray-50"></div>
            <div className="p-6 space-y-6 md:p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUserData) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="w-full max-w-md p-10 text-center bg-white border border-gray-100 shadow-xl rounded-2xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full ring-4 ring-gray-50">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Bạn chưa đăng nhập</h2>
          <p className="mb-8 text-gray-600">Vui lòng đăng nhập để xem thông tin cá nhân và quản lý đơn hàng.</p>
          <a
            href="/login"
            className="inline-block w-full px-8 py-3.5 text-white font-semibold transition-all duration-200 bg-black rounded-xl hover:bg-gray-800 transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-black/10"
          >
            Đăng nhập ngay
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 md:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
            TÀI KHOẢN CỦA BẠN
          </h1>
          <p className="text-lg text-gray-600">
            Quản lý thông tin cá nhân và địa chỉ giao hàng
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-8 p-5 rounded-xl border flex items-start gap-3 transform transition-all animate-fade-in ${message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800 shadow-inner shadow-green-100/50'
            : 'bg-red-50 border-red-200 text-red-800 shadow-inner shadow-red-100/50'
            }`}>
            <div className={`p-1.5 rounded-full ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              {message.type === 'success' ? '✓' : '✕'}
            </div>
            <div>
              <p className="font-semibold">{message.type === 'success' ? 'Thành công!' : 'Có lỗi xảy ra'}</p>
              <p className="text-sm opacity-90">{message.text}</p>
            </div>
          </div>
        )}

        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
          {/* Profile Header */}
          <ProfileHeader
            user={currentUserData}
            isEditing={isEditing}
            onEditToggle={() => setIsEditing(!isEditing)}
            onLogout={handleLogout}
            loading={loading}
          />

          {/* Profile Content */}
          <div className="p-6 md:p-8">
            {isEditing ? (
              <ProfileForm
                user={currentUserData}
                onSubmit={handleUpdateProfile}
                onCancel={() => setIsEditing(false)}
                loading={loading}
              />
            ) : (
              <ProfileInfo user={currentUserData} />
            )}
          </div>
        </div>

        {/* Logout button for mobile */}
        <div className="px-4 mt-8 text-center md:hidden">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2.5 px-6 py-3.5 text-gray-700 font-semibold transition-all bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 active:scale-95 shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất tài khoản
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;