import React, { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, DollarSign, Activity, Calendar, Download, MoreVertical } from 'lucide-react';
import axios from '../../lib/axios';
import orderApi from '../../api/order.service';
import AdminStatCard from '../../components/admin/AdminStatCard';

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
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get('/users'),
          axios.get('/products'),
          orderApi.getAllOrders()
        ]);

        const usersData = usersRes.data || [];
        const productsData = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.data || []);
        const ordersData = Array.isArray(ordersRes) ? ordersRes : (ordersRes?.data || []);

        const revenue = ordersData.reduce((sum, order) => {
          if (order.status !== 'cancelled') {
            return sum + Number(order.totalAmount || 0);
          }
          return sum;
        }, 0);

        setStats({
          totalUsers: usersData.length,
          totalProducts: productsData.length,
          totalOrders: ordersData.length,
          revenue: revenue,
        });

        setRecentOrders(ordersData.slice(0, 8)); // Hiển thị 8 đơn mới nhất
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

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'shipping': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
      </div>
    );
  }

  const statCardsData = [
    { title: 'Doanh thu', value: formatPrice(stats.revenue), icon: <DollarSign size={24} />, trend: 'up', trendValue: 12, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Đơn hàng', value: stats.totalOrders, icon: <ShoppingCart size={24} />, trend: 'up', trendValue: 8, color: 'bg-blue-50 text-blue-600' },
    { title: 'Người dùng', value: stats.totalUsers, icon: <Users size={24} />, trend: 'down', trendValue: 2, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Sản phẩm', value: stats.totalProducts, icon: <Package size={24} />, trend: 'up', trendValue: 5, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-admin-text tracking-tight uppercase">Dashboard</h1>
          <p className="text-admin-subtext text-sm font-bold mt-1 uppercase tracking-widest">
            Tổng quan hoạt động cửa hàng
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-admin-border rounded-xl text-sm font-bold text-admin-subtext cursor-pointer hover:bg-slate-50 transition-colors">
            <Calendar size={18} />
            <span>Tháng 3, 2026</span>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-admin-primary text-white text-sm font-bold rounded-xl hover:bg-indigo-600 shadow-lg shadow-admin-primary/25 transition-all active:scale-95">
            <Download size={18} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCardsData.map((stat, idx) => (
          <AdminStatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Content Grid (Charts & Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-3 bg-white border border-admin-border rounded-2xl shadow-admin-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-admin-border">
            <h4 className="text-lg font-black text-admin-text uppercase tracking-tight">Đơn hàng mới nhất</h4>
            <button className="text-admin-subtext hover:text-admin-primary transition-colors text-xs font-bold uppercase tracking-widest border-b border-transparent hover:border-admin-primary pb-0.5">
              Xem tất cả
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-admin-subtext uppercase tracking-widest">
                  <th className="px-6 py-4">Mã đơn</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Thanh toán</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-right pr-10">Số tiền</th>
                  <th className="px-6 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-admin-text group-hover:text-admin-primary transition-colors cursor-pointer">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-admin-subtext">
                            { (order.fullName || order.user?.fullName || 'U').charAt(0) }
                          </div>
                          <div>
                            <p className="text-sm font-bold text-admin-text">{order.fullName || order.user?.fullName || 'Khách vãng lai'}</p>
                            <p className="text-[10px] font-medium text-admin-subtext">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-admin-subtext">
                        {order.paymentMethod || 'COD'}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border rounded-full ${getStatusStyle(order.status)}`}>
                            {order.status || 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-admin-text text-right pr-10 italic">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-6 py-5 text-right w-10">
                        <button className="p-2 text-admin-subtext hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center text-admin-subtext font-bold uppercase tracking-widest">
                      Không có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
