import React, { useEffect } from 'react';
import useOrderStore from '../store/order.store';
import { Package, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const OrderPage = () => {
  const { orders, fetchMyOrders, isLoading } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  // Hàm xử lý hiển thị trạng thái chính xác theo Backend
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { text: 'Đang xử lý', color: 'text-amber-600', icon: <Clock className="w-4 h-4" /> };
      case 'cancelled':
        return { text: 'Đã hủy', color: 'text-red-600', icon: <XCircle className="w-4 h-4" /> };
      case 'delivered':
        return { text: 'Đã giao hàng', color: 'text-green-600', icon: <CheckCircle2 className="w-4 h-4" /> };
      default:
        return { text: 'Đã xác nhận', color: 'text-blue-600', icon: <Package className="w-4 h-4" /> };
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 font-['Helvetica_Now_Text',Helvetica,Arial,sans-serif]">
      <div className="max-w-[1000px] px-6 mx-auto">
        <h1 className="mb-16 text-5xl italic font-black leading-none tracking-tighter uppercase md:text-3xl">
          Đơn hàng <span className="text-gray-200">({orders.length})</span>
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-gray-200 rounded-full border-t-black animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 text-center border-t border-gray-100">
            <p className="mb-8 text-lg font-normal text-gray-400">Bạn chưa có đơn hàng nào.</p>
            <Link to="/products" className="inline-block px-8 py-3 text-sm font-medium text-white transition-all bg-black rounded-full hover:bg-gray-800">
              Bắt đầu mua sắm
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {orders.map((order) => {
              const status = getStatusInfo(order.status);
              return (
                <div key={order.id} className="pb-12 border-b border-gray-100 last:border-0">
                  {/* Header: Trạng thái & Ngày */}
                  <div className="flex items-baseline justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <span className={status.color}>{status.icon}</span>
                      <span className={`text-sm font-bold uppercase tracking-tight ${status.color}`}>
                        {status.text}
                      </span>
                      <span className="ml-2 text-sm text-gray-400">
                        • {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="font-mono text-xs tracking-tighter text-gray-400 uppercase">
                      ID: #{order.id.slice(0, 8)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                    {/* Danh sách sản phẩm (Nike Grid) */}
                    <div className="space-y-8 md:col-span-8">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-6 group">
                          <div className="w-32 h-40 bg-[#f5f5f5] shrink-0 overflow-hidden">
                            <img
                              src={item.product?.mainImage}
                              className="object-cover w-full h-full transition-transform duration-500 mix-blend-multiply group-hover:scale-105"
                              alt=""
                            />
                          </div>
                          <div className="flex flex-col flex-1 py-1">
                            <h4 className="mb-1 text-sm font-bold tracking-tight uppercase">{item.product?.name}</h4>
                            <p className="text-sm text-gray-500">Giày thể thao</p>
                            <p className="mb-4 text-sm text-gray-500">Size: {item.size} | Số lượng: {item.quantity}</p>
                            <p className="mt-auto text-sm font-medium">
                              {(Number(item.price) || 0).toLocaleString()}đ
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Thông tin đơn hàng (Nike Sidebar) */}
                    <div className="md:col-span-4 bg-[#f5f5f5]/50 p-6 self-start">
                      <div className="space-y-6">
                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Giao hàng đến</h5>
                          <p className="text-sm font-medium leading-relaxed">{order.fullName}</p>
                          <p className="text-sm leading-relaxed text-gray-600">{order.address}</p>
                          <p className="mt-2 font-mono text-sm italic text-gray-600">{order.phone}</p>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                          <div className="flex items-end justify-between">
                            <span className="text-sm font-medium">Tổng thanh toán</span>
                            <span className="text-xl font-bold tracking-tighter">
                              {/* Sử dụng totalAmount từ Backend */}
                              {(Number(order.totalAmount) || 0).toLocaleString()}đ
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/order/${order.id}`)}
                          className="w-full py-3 mt-4 text-xs font-bold tracking-widest uppercase transition-all border border-gray-300 rounded-full hover:border-black"
                        >
                          Chi tiết đơn hàng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;