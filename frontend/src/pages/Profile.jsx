import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/auth.store';
import ProfileHeader from '../components/auth/ProfileHeader';
import ProfileForm from '../components/auth/ProfileForm';
import ProfileInfo from '../components/auth/ProfileInfo';
import AddressManager from '../components/auth/AddressManager';
import { LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, currentUser, getProfile, updateProfile, logout } = useAuthStore();
  const currentUserData = currentUser() || user;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Lấy profile khi component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await getProfile();
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    if (!currentUserData) {
      fetchProfile();
    }
  }, []);

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

  if (!currentUserData) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="mb-6 text-gray-600">Vui lòng đăng nhập để xem thông tin</p>
          <a
            href="/login"
            className="inline-block px-8 py-3 text-white transition-colors bg-black rounded hover:bg-gray-800"
          >
            Đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            THÔNG TIN CÁ NHÂN
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin và địa chỉ giao hàng
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded border ${message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
            }`}>
            {message.text}
          </div>
        )}

        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          {/* Profile Header */}
          <ProfileHeader
            user={currentUserData}
            isEditing={isEditing}
            onEditToggle={() => setIsEditing(!isEditing)}
            onLogout={handleLogout}
            loading={loading}
          />

          {/* Profile Content */}
          <div className="p-6">
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
        <div className="mt-6 text-center md:hidden">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-6 py-3 mx-auto text-gray-700 transition-colors bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;