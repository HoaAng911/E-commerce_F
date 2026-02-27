import React from 'react';
import { Edit2, Save, X, LogOut, Mail } from 'lucide-react';

const ProfileHeader = ({ user, isEditing, onEditToggle, onLogout, loading }) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative w-20 h-20 overflow-hidden border-2 border-gray-200 rounded-full">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-white bg-black">
                {user.fullName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div>
            <h2 className="mb-1 text-xl font-bold text-gray-900">
              {user.fullName || 'Chưa có tên'}
            </h2>
            <p className="flex items-center gap-1 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={onEditToggle}
                className="flex items-center gap-2 px-5 py-2 text-white transition-colors bg-black rounded hover:bg-gray-800"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </button>
              <button
                onClick={onLogout}
                className="items-center hidden gap-2 px-5 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded md:flex hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEditToggle}
                className="flex items-center gap-2 px-5 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                Hủy
              </button>
              <button
                type="submit"
                form="profile-form"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 text-white transition-colors bg-black rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;