import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Plus, Trash2 } from 'lucide-react';

const ProfileForm = ({ user, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatar: '',
    addresses: [''],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        addresses: user.addresses?.length > 0 
          ? [...user.addresses] 
          : ['']
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (index, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index] = value;
    setFormData(prev => ({
      ...prev,
      addresses: newAddresses
    }));
  };

  const addAddressField = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, '']
    }));
  };

  const removeAddressField = (index) => {
    if (formData.addresses.length > 1) {
      const newAddresses = formData.addresses.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        addresses: newAddresses
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredAddresses = formData.addresses.filter(addr => addr.trim() !== '');
    
    const updateData = {
      ...formData,
      addresses: filteredAddresses.length > 0 ? filteredAddresses : []
    };

    onSubmit(updateData);
  };

  return (
    <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Info */}
      <div>
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
          <User className="w-5 h-5" />
          Thông tin cá nhân
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              placeholder="Nhập họ và tên"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 text-gray-500 bg-gray-100 border border-gray-300 rounded cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Email không thể thay đổi</p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              URL ảnh đại diện
            </label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <MapPin className="w-5 h-5" />
            Địa chỉ
          </h3>
          <button
            type="button"
            onClick={addAddressField}
            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-700 transition-colors bg-gray-100 rounded hover:bg-gray-200"
          >
            <Plus className="w-4 h-4" />
            Thêm địa chỉ
          </button>
        </div>
        <div className="space-y-3">
          {formData.addresses.map((address, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                placeholder="Nhập địa chỉ"
              />
              {formData.addresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAddressField(index)}
                  className="px-3 py-2 text-red-600 transition-colors border border-red-200 rounded bg-red-50 hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons (for mobile) */}
      <div className="flex gap-2 pt-4 md:hidden">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 text-white transition-colors bg-black rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;