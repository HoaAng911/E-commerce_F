import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck } from 'lucide-react';
import useCartStore from '../store/cart.store';
import useOrderStore from '../store/order.store';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const { placeOrder, isLoading } = useOrderStore();

  // Lấy các sản phẩm được chọn để thanh toán
  const selectedItems = cart?.items.filter(item => item.selected) || [];
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'COD'
  });

  if (selectedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold tracking-widest uppercase">Không có sản phẩm thanh toán</h2>
        <Link to="/cart" className="mt-4 text-xs font-bold underline uppercase">Quay lại giỏ hàng</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const order = await placeOrder(formData);
      
      // Intentional Delay để UX mượt hơn (~400ms)
      await new Promise(resolve => setTimeout(resolve, 400));
      
      toast.success('Đặt hàng thành công!');
      navigate(`/order-success/${order.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-white">
      <div className="px-4 pt-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
          <div className="lg:col-span-7">
            <Link to="/cart" className="flex items-center text-[10px] uppercase tracking-[0.2em] mb-8 hover:text-gray-500">
              <ChevronLeft className="w-4 h-4" /> Quay lại giỏ hàng
            </Link>

            <h2 className="mb-8 text-lg font-bold tracking-widest uppercase">Thông tin giao hàng</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Họ và tên</label>
                <input
                  required
                  type="text"
                  className="w-full py-3 text-sm transition-all border-b border-gray-200 outline-none focus:border-black"
                  placeholder="Nhập tên người nhận..."
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Số điện thoại</label>
                  <input
                    required
                    type="tel"
                    className="w-full py-3 text-sm transition-all border-b border-gray-200 outline-none focus:border-black"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Phương thức thanh toán</label>
                  <select 
                    className="w-full py-3 text-sm transition-all bg-transparent border-b border-gray-200 outline-none focus:border-black"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  >
                    <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                    <option value="BANKING">Chuyển khoản ngân hàng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Địa chỉ chi tiết</label>
                <input
                  required
                  type="text"
                  className="w-full py-3 text-sm transition-all border-b border-gray-200 outline-none focus:border-black"
                  placeholder="Số nhà, tên đường, phường/xã..."
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Ghi chú (tùy chọn)</label>
                <textarea
                  className="w-full h-24 p-3 text-sm transition-all border border-gray-200 outline-none focus:border-black"
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="lg:col-span-5">
            <div className="sticky p-8 bg-gray-50 top-10">
              <h2 className="pb-4 mb-6 text-sm font-bold tracking-widest uppercase border-b">Đơn hàng của bạn</h2>
              
              <div className="max-h-[400px] overflow-y-auto mb-6 space-y-4 pr-2">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-white border shrink-0">
                      <img src={item.product.mainImage} alt={item.product.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[11px] font-bold uppercase tracking-tight line-clamp-1">{item.product.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px]">x{item.quantity}</span>
                        <span className="text-xs font-bold">{(item.price * item.quantity).toLocaleString()}đ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 space-y-3 border-t border-gray-200">
                <div className="flex justify-between text-[11px] uppercase tracking-widest text-gray-500">
                  <span>Tạm tính</span>
                  <span>{cart.totalPrice.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest text-gray-500">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex items-end justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm font-bold tracking-widest uppercase">Tổng cộng</span>
                  <span className="text-xl font-bold tracking-tighter">{cart.totalPrice.toLocaleString()}đ</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-5 mt-8 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all disabled:bg-gray-400"
              >
                {isLoading ? 'Đang xử lý...' : 'Hoàn tất đặt hàng'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;