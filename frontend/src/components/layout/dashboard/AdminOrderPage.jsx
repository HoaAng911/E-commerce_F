import React, { useEffect, useState } from 'react';
import { Package, Search, ChevronDown, Check, X } from 'lucide-react';
import orderApi from '../../../api/order.service';
import { toast } from 'sonner';

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [activeStatus, setActiveStatus] = useState('');

  const statusOptions = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getAllOrders();
      setOrders(Array.isArray(res) ? res : (res?.data || []));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return { bg: 'bg-[#219653]/10', text: 'text-[#219653]', label: 'Đã giao' };
      case 'shipping': return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đang giao' };
      case 'confirmed': return { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Đã xác nhận' };
      case 'cancelled': return { bg: 'bg-[#EB5757]/10', text: 'text-[#EB5757]', label: 'Đã hủy' };
      default: return { bg: 'bg-[#F2C94C]/10', text: 'text-[#F2C94C]', label: 'Chờ xử lý' };
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Gọi API custom endpoint chúng ta mới tạo ở backend
      await orderApi.updateOrderStatus(orderId, newStatus);
      setEditingOrderId(null);
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error(error.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };

  // Nếu file orderApi chưa có hs updateOrderStatus, ta cần cập nhật file service
  // Tạm thời mock hàm dưới đây, mình sẽ chỉnh lại order.service.js ngay sau
  if (!orderApi.updateOrderStatus) {
     orderApi.updateOrderStatus = async (id, status) => {
        const axios = (await import('../../../lib/axios')).default;
        return axios.patch(`/orders/${id}/status`, { status });
     };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-black">Quản lý đơn hàng</h1>
        <div className="flex rounded-sm border border-[#E2E8F0] bg-white overflow-hidden w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Tìm kiếm đơn hàng..." 
            className="w-full bg-transparent px-4 py-2 text-sm focus:outline-none"
          />
          <button className="px-3 bg-gray-50 border-l border-[#E2E8F0] text-[#64748B] hover:text-black transition-colors">
            <Search size={16} />
          </button>
        </div>
      </div>

      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-sm mt-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-4 px-6 font-medium text-black">Mã đơn & Ngày</th>
                <th className="py-4 px-6 font-medium text-black">Khách hàng</th>
                <th className="py-4 px-6 font-medium text-black">Sản phẩm</th>
                <th className="py-4 px-6 font-medium text-black">Tổng tiền</th>
                <th className="py-4 px-6 font-medium text-black">Trạng thái</th>
                <th className="py-4 px-6 font-medium text-black text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, idx) => {
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <tr key={order.id} className={`${idx === orders.length - 1 ? '' : 'border-b border-[#E2E8F0]'} hover:bg-gray-50 transition-colors`}>
                      <td className="py-4 px-6">
                        <p className="text-sm font-medium text-black">#{order.id.split('-')[0]}</p>
                        <p className="text-xs text-[#64748B] mt-1">
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-medium text-black">{order.fullName || order.user?.fullName}</p>
                        <p className="text-xs text-[#64748B] mt-1">{order.phone}</p>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-[#64748B]" />
                          <span className="font-medium text-black">{order.items?.length || 0} món</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-black">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-4 px-6">
                        {editingOrderId === order.id ? (
                          <select 
                            value={activeStatus} 
                            onChange={(e) => setActiveStatus(e.target.value)}
                            className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-transparent py-2 px-3 text-sm text-black outline-none transition focus:border-blue-600 active:border-blue-600"
                          >
                            <option value="pending">Chờ xử lý</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="shipping">Đang giao</option>
                            <option value="delivered">Đã giao</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                        ) : (
                          <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.label}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {editingOrderId === order.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleStatusChange(order.id, activeStatus)} className="p-1.5 bg-[#219653]/10 text-[#219653] rounded hover:bg-[#219653]/20 transition-colors">
                              <Check size={16} />
                            </button>
                            <button onClick={() => setEditingOrderId(null)} className="p-1.5 bg-[#EB5757]/10 text-[#EB5757] rounded hover:bg-[#EB5757]/20 transition-colors">
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => { setEditingOrderId(order.id); setActiveStatus(order.status || 'pending'); }}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            Cập nhật
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 px-6 text-center text-[#64748B] font-medium">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderPage;
