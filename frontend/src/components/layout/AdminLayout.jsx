import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  LogOut,
  UserCircle,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import useAuthStore from '../../store/auth.store';

const AdminLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Người dùng', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Sản phẩm', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Đơn hàng', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Bài viết', path: '/admin/articles', icon: <FileText size={20} /> },
    { name: 'Hình ảnh', path: '/admin/media', icon: <ImageIcon size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans text-[#64748B]">
      {/* SIDEBAR - Tailadmin Style */}
      <aside className="w-[280px] bg-[#1c2434] text-[#8a99af] flex flex-col sticky top-0 h-screen transition-all duration-300">
        <div className="px-6 py-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10 text-white">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-sm">
              <span className="font-bold text-white text-lg">A</span>
            </div>
            <span className="font-semibold text-xl tracking-wide">
              Bảng điều khiển
            </span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-sm font-medium transition-all duration-300
                    ${isActive
                      ? 'bg-[#333a48] text-white'
                      : 'hover:bg-[#333a48] hover:text-white'}`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section - User Info & Logout */}
        <div className="mt-auto px-6 py-6 border-t border-[#2e3a47]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#333a48] rounded-full flex items-center justify-center text-white">
              <UserCircle size={24} />
            </div>
            <div className="overflow-hidden text-[#8a99af]">
              <p className="font-medium text-sm truncate text-white">{user?.fullName || 'Quản trị viên'}</p>
              <p className="text-xs truncate uppercase tracking-wider">{user?.role === 'admin' ? 'Quản trị' : user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-[#8a99af] hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-10 flex w-full bg-white shadow-sm h-16 items-center px-8 border-b border-[#E2E8F0]">
           <div className="flex flex-grow items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                 {/* Menu toggle for mobile (optional) */}
              </div>
              <div className="flex items-center gap-3 2xsm:gap-7">
                <span className="text-sm font-medium text-black">Xin chào, {user?.fullName || 'Quản trị viên'}</span>
              </div>
           </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f1f5f9]">
          <div className="mx-auto max-w-screen-2xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;