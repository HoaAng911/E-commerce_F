import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import AddressManager from './AddressManager';

const ProfileInfo = ({ user }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleText = (role) => {
    const roleMap = {
      'ADMIN': 'Quản trị viên',
      'CUSTOMER': 'Khách hàng',
      'STAFF': 'Nhân viên'
    };
    return roleMap[role] || role;
  };

  return (
    <div className="space-y-6">
      {/* Personal Info Display */}
      <div>
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
          <User className="w-5 h-5" />
          Thông tin cá nhân
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4 border border-gray-200 rounded">
            <dt className="flex items-center gap-2 mb-1 text-sm text-gray-600">
              <User className="w-4 h-4" />
              Họ và tên
            </dt>
            <dd className="text-base font-medium text-gray-900">
              {user.fullName || 'Chưa cập nhật'}
            </dd>
          </div>
          
          <div className="p-4 border border-gray-200 rounded">
            <dt className="flex items-center gap-2 mb-1 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              Email
            </dt>
            <dd className="text-base font-medium text-gray-900">
              {user.email}
            </dd>
          </div>
          
          <div className="p-4 border border-gray-200 rounded">
            <dt className="flex items-center gap-2 mb-1 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              Số điện thoại
            </dt>
            <dd className="text-base font-medium text-gray-900">
              {user.phone || 'Chưa cập nhật'}
            </dd>
          </div>
          
          <div className="p-4 border border-gray-200 rounded">
            <dt className="flex items-center gap-2 mb-1 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              Vai trò
            </dt>
            <dd className="text-base font-medium text-gray-900">
              {getRoleText(user.role)}
            </dd>
          </div>
        </div>
      </div>

      {/* Address Display */}
      <div>
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
          <MapPin className="w-5 h-5" />
          Địa chỉ
        </h3>
        <AddressManager addresses={user.addresses || []} />
      </div>

      {/* Account Info */}
      <div>
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
          <Calendar className="w-5 h-5" />
          Thông tin tài khoản
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4 border border-gray-200 rounded">
            <dt className="mb-1 text-sm text-gray-600">
              Ngày tạo
            </dt>
            <dd className="text-base font-medium text-gray-900">
              {formatDate(user.createdAt)}
            </dd>
          </div>
          
          <div className="p-4 border border-gray-200 rounded">
            <dt className="mb-1 text-sm text-gray-600">
              Cập nhật lần cuối
            </dt>
            <dd className="text-base font-medium text-gray-900">
              {formatDate(user.updatedAt)}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;