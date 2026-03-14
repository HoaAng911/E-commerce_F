import React, { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import axios from '../../../lib/axios';
import orderApi from '../../../api/order.service';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch users, products and orders concurrently
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get('/users'),
          axios.get('/products'),
          orderApi.getAllOrders()
        ]);

        const usersData = usersRes.data || [];
        // Handle paginated or direct array responses for products
        const productsData = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.data || []);
        const ordersData = Array.isArray(ordersRes) ? ordersRes : (ordersRes?.data || []);

        const totalOrders = ordersData.length;
        // Calculate revenue only from non-cancelled orders
        const revenue = ordersData.reduce((sum, order) => {
          if (order.status !== 'cancelled') {
            return sum + Number(order.totalAmount || 0);
          }
          return sum;
        }, 0);

        setStats({
          totalUsers: usersData.length,
          totalProducts: productsData.length,
          totalOrders: totalOrders,
          revenue: revenue,
        });

        // Set top 5 recent orders
        setRecentOrders(ordersData.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return { bg: 'bg-[#219653]/10', text: 'text-[#219653]', label: 'Đã hoàn thành' };
      case 'delivered': return { bg: 'bg-[#219653]/10', text: 'text-[#219653]', label: 'Đã giao' };
      case 'pending': return { bg: 'bg-[#F2C94C]/10', text: 'text-[#F2C94C]', label: 'Chờ xử lý' };
      case 'shipping': return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đang giao' };
      case 'cancelled': return { bg: 'bg-[#EB5757]/10', text: 'text-[#EB5757]', label: 'Đã hủy' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', label: status || 'Chờ xử lý' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Tổng doanh thu', value: formatPrice(stats.revenue), icon: <DollarSign size={22} className="text-blue-600" /> },
    { title: 'Tổng đơn hàng', value: stats.totalOrders, icon: <ShoppingCart size={22} className="text-blue-600" /> },
    { title: 'Người dùng', value: stats.totalUsers, icon: <Users size={22} className="text-blue-600" /> },
    { title: 'Sản phẩm', value: stats.totalProducts, icon: <Package size={22} className="text-blue-600" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-black">Tổng quan hệ thống</h1>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-blue-600 py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all">
            <Activity size={16} />
            Tải báo cáo
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="rounded-sm border border-[#E2E8F0] bg-white py-6 px-7 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF2F7]">
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <h4 className="text-xl font-bold text-black">{stat.value}</h4>
              <span className="text-sm font-medium text-[#64748B] mt-1">{stat.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-sm mt-6">
        <div className="py-4 px-6 border-b border-[#E2E8F0]">
          <h4 className="text-xl font-bold text-black">Đơn hàng gần đây</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-4 px-6 font-medium text-black">Mã đơn</th>
                <th className="py-4 px-6 font-medium text-black">Khách hàng</th>
                <th className="py-4 px-6 font-medium text-black">Ngày</th>
                <th className="py-4 px-6 font-medium text-black">Trạng thái</th>
                <th className="py-4 px-6 font-medium text-black text-right">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order, idx) => {
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <tr key={order.id} className={`${idx === recentOrders.length - 1 ? '' : 'border-b border-[#E2E8F0]'} hover:bg-gray-50 transition-colors`}>
                      <td className="py-4 px-6 text-sm">
                        <p className="font-medium text-black">#{order.id.substring(0, 8)}</p>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <p className="font-medium text-black">{order.fullName || order.user?.fullName || 'Không xác định'}</p>
                      </td>
                      <td className="py-4 px-6 text-sm text-[#64748B]">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-right text-black">
                        {formatPrice(order.totalAmount)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 px-6 text-center text-[#64748B] font-medium">
                    Không có đơn hàng nào gần đây.
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

export default AdminDashboard;
