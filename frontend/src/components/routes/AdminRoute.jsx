import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';

const AdminRoute = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Đang xác thực quyền...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập hoặc không phải ADMIN -> Đá về trang chủ
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // Hợp lệ -> Cho phép render các route con (AdminLayout)
  return <Outlet />;
};

export default AdminRoute;
