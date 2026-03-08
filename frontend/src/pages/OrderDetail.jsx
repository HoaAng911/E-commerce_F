import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, CreditCard, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import useOrderStore from '../store/order.store';
import { toast } from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, fetchMyOrders, cancelMyOrder, isLoading } = useOrderStore();
  const [order, setOrder] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const foundOrder = orders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      fetchMyOrders();
    }
  }, [id, orders, fetchMyOrders]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    
    setIsCancelling(true);
    try {
      await cancelMyOrder(id);
      toast.success('Đã hủy đơn hàng thành công');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { text: 'Đang chờ duyệt', color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'cancelled':
        return { text: 'Đã hủy', color: 'text-red-600', bg: 'bg-red-50' };
      case 'delivered':
        return { text: 'Đã giao hàng', color: 'text-green-600', bg: 'bg-green-50' };
      default:
        return { text: 'Đang xử lý', color: 'text-blue-600', bg: 'bg-blue-50' };
    }
  };

  if (isLoading && !order) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-6 h-6 border-2 border-gray-200 rounded-full border-t-black animate-spin"></div>
    </div>
  );

  if (!order) return <div className="py-40 text-center text-gray-500">Không tìm thấy đơn hàng.</div>;

  const status = getStatusInfo(order.status);

  return (
    <div className="min-h-screen pt-32 pb-24 font-sans bg-white">
      <div className="max-w-[1100px] px-6 mx-auto">
        <button 
          onClick={() => navigate('/my-orders')}
          className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black mb-10"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Trở lại
        </button>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold tracking-tighter uppercase">Chi tiết đơn hàng</h1>
              <p className="font-mono text-sm text-gray-500">ID: #{order.id.toUpperCase()}</p>
            </div>

            <div className="pt-10 space-y-10 border-t">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="w-32 h-40 bg-[#f5f5f5] shrink-0">
                    <img src={item.product?.mainImage} className="object-cover w-full h-full mix-blend-multiply" alt="" />
                  </div>
                  <div className="flex-1 py-1">
                    <div className="flex justify-between text-sm font-bold uppercase">
                      <h3>{item.product?.name}</h3>
                      <span>{(Number(item.price) * item.quantity).toLocaleString()}đ</span>
                    </div>
                    <div className="mt-4 space-y-1 text-xs tracking-widest text-gray-500 uppercase">
                      <p>Size: <span className="font-bold text-black">{item.size}</span></p>
                      <p>Số lượng: <span className="font-bold text-black">{item.quantity}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <div className={`${status.bg} p-6`}>
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Trạng thái</h4>
               <p className={`text-lg font-bold uppercase italic tracking-tighter ${status.color}`}>{status.text}</p>
            </div>

            <div className="p-6 space-y-6 border">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Giao đến</h4>
                <p className="text-sm font-bold uppercase">{order.fullName}</p>
                <p className="mt-1 text-sm text-gray-600">{order.address}</p>
                <p className="font-mono text-sm text-gray-600">{order.phone}</p>
              </div>

              <div className="pt-6 space-y-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tổng cộng</span>
                  <span className="font-bold">{(Number(order.totalAmount) || 0).toLocaleString()}đ</span>
                </div>
              </div>

              {/* Nút Hủy Đơn Hàng - Chỉ hiện khi đang chờ duyệt */}
              {order.status?.toLowerCase() === 'pending' && (
                <div className="pt-6 border-t">
                  <button 
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="w-full py-4 bg-white border border-red-200 text-red-600 text-[11px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isCancelling ? 'Đang xử lý...' : (
                      <>
                        <AlertTriangle className="w-4 h-4" /> Hủy đơn hàng
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-gray-400 text-center mt-3 italic">
                    * Bạn chỉ có thể hủy đơn khi đơn hàng chưa được xác nhận.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;