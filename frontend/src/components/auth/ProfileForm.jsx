import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Plus,Mail,Save, Trash2, Loader2, X } from 'lucide-react';

const ProfileForm = ({ user, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    
    phone: '',
    avatar: '',
    addresses: [''],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
      
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

  // Helper component cho Input Field
  const InputField = ({ label, icon: Icon, ...props }) => (
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-800">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
          <Icon className="w-5 h-5" />
        </div>
        <input
          {...props}
          className={`w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all ${props.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
        />
      </div>
      {props.name === 'email' && <p className="mt-1.5 text-xs text-gray-500 pl-1">Email tài khoản không thể thay đổi</p>}
    </div>
  );

  return (
    <form id="profile-form" onSubmit={handleSubmit} className="space-y-10">
      {/* Personal Info */}
      <section>
        <div className="flex items-center gap-3 pb-2 mb-6 border-b border-gray-100">
          <div className="p-2.5 bg-gray-100 rounded-lg text-black">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Thông tin cá nhân
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <InputField
            label="Họ và tên"
            icon={User}
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Nhập họ và tên của bạn"
            required
          />

          <InputField
            label="Số điện thoại"
            icon={Phone}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="09xx xxx xxx"
          />
          
          {/* Đã ẩn URL Avatar vì chuyển sang upload ở Header */}
        </div>
      </section>

      {/* Addresses */}
      <section>
        <div className="flex items-center justify-between pb-2 mb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 rounded-lg text-black">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Sổ địa chỉ nhận hàng
            </h3>
          </div>
          <button
            type="button"
            onClick={addAddressField}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-800 transition-all bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Thêm địa chỉ
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.addresses.map((address, index) => (
            <div key={index} className="flex items-center gap-3 group animate-fade-in">
              <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-gray-500 transition-colors bg-gray-100 rounded-xl shrink-0 group-focus-within:bg-black group-focus-within:text-white">
                {index + 1}
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                className="flex-1 px-4 py-3 transition-all bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                placeholder="Nhập địa chỉ giao hàng cụ thể của bạn"
              />
              {formData.addresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAddressField(index)}
                  className="p-3 text-red-500 transition-all border border-red-100 opacity-0 rounded-xl bg-red-50 hover:bg-red-100 hover:border-red-200 active:scale-95 group-hover:opacity-100 focus:opacity-100"
                  title="Xóa địa chỉ này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Action buttons (for mobile) */}
      <div className="flex gap-3 pt-6 border-t border-gray-100 md:hidden animate-fade-in-up">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-5 py-3.5 text-gray-700 font-semibold transition-all bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 text-white font-semibold transition-all bg-black rounded-xl hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 shadow-md shadow-black/10"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {loading ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;