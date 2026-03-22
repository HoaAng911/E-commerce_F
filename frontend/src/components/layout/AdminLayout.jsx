import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  LogOut,
  UserCircle,
  FileText,
  Image as ImageIcon,
  Search,
  Bell,
  Mail,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import useAuthStore from '../../store/auth.store';

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Khách hàng', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Sản phẩm', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Đơn hàng', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Bài viết', path: '/admin/articles', icon: <FileText size={20} /> },
    { name: 'Media', path: '/admin/media', icon: <ImageIcon size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-admin-bg font-sans text-admin-text">
      {/* SIDEBAR - Modern Clean Style */}
      <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 bg-admin-sidebar border-r border-admin-border transform ${
        isSidebarOpen ? 'w-[260px] translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-6 h-20 border-b border-admin-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-admin-primary to-indigo-600 shadow-lg shadow-admin-primary/20">
              <span className="text-xl font-black text-white italic">S</span>
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-bold tracking-tight text-admin-text line-clamp-1">
                Store-Admin
              </span>
            )}
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 group relative
                    ${isActive
                      ? 'bg-admin-primary text-white shadow-lg shadow-admin-primary/30 active:scale-95'
                      : 'text-admin-subtext hover:bg-admin-primary-light hover:text-admin-primary hover:translate-x-1'}`}
                >
                  <div className={`${isActive ? 'text-white' : 'text-admin-subtext group-hover:text-admin-primary'}`}>
                    {item.icon}
                  </div>
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {isActive && <ChevronRight size={16} className="opacity-70" />}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section Bottom */}
          <div className="p-4 mt-auto border-t border-admin-border">
            {isSidebarOpen ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-admin-border group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-admin-primary/10 flex items-center justify-center text-admin-primary relative">
                     <UserCircle size={24} />
                     <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate text-admin-text">{user?.fullName || 'Manager'}</p>
                    <p className="text-[10px] font-bold text-admin-subtext uppercase tracking-widest leading-none mt-1">
                      {user?.role || 'Admin'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <LogOut size={14} />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-20'
      }`}>
        {/* TOPBAR */}
        <header className="sticky top-0 z-40 flex items-center h-20 px-8 bg-white/80 backdrop-blur-md border-b border-admin-border">
          <div className="flex items-center justify-between w-full">
            {/* Left Hand Side: Sidebar Toggle & Search */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 text-admin-subtext hover:bg-slate-100 rounded-lg transition-colors"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-admin-border rounded-xl w-80 group focus-within:bg-white focus-within:ring-2 focus-within:ring-admin-primary/20 transition-all">
                <Search size={18} className="text-admin-subtext group-focus-within:text-admin-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm báo cáo, đơn hàng..." 
                  className="flex-1 bg-transparent text-sm font-medium focus:outline-none placeholder:text-admin-subtext"
                />
              </div>
            </div>

            {/* Right Hand Side: Notifications & Profile */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-4 border-r border-admin-border pr-4">
                <button className="relative p-2 text-admin-subtext hover:bg-slate-100 rounded-lg transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="p-2 text-admin-subtext hover:bg-slate-100 rounded-lg transition-colors">
                  <Mail size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3 cursor-pointer group">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-admin-text group-hover:text-admin-primary transition-colors">
                      {user?.fullName || 'Quản trị viên'}
                    </p>
                    <p className="text-[10px] font-bold text-admin-subtext uppercase tracking-widest">{user?.role || 'Admin'}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-admin-border group-hover:border-admin-primary transition-all">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user?.fullName || 'Admin'}&background=6366f1&color=fff`} 
                      alt="avatar" 
                      className="w-full h-full object-cover"
                    />
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
          <div className="mx-auto max-w-screen-2xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;