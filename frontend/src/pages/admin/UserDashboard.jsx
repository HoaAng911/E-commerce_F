import React, { useEffect, useState } from 'react';
import { Trash2, ShieldCheck, ShieldAlert, UserPlus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import userService from '../../api/user.service';
import { toast } from 'sonner';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    lastPage: 1
  });

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers(page, pagination.limit);
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        page: response.page,
        total: response.total,
        lastPage: response.lastPage
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchUsers(pagination.page); 
  }, [pagination.page]);

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await userService.updateUserStatus(id, !currentStatus);
      toast.success('Cập nhật trạng thái thành công!');
      fetchUsers(pagination.page); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("BẠN CÓ CHẮC MUỐN XÓA THÀNH VIÊN NÀY?")) {
      try {
        await userService.deleteUser(id);
        toast.success('Đã xóa thành viên thành công');
        fetchUsers(pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.message || "Xóa thất bại");
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight">
            Quản lý người dùng
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mt-1">
            Tổng số: <span className="text-black">{pagination.total}</span> thành viên
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
           <div className="relative w-full sm:w-64 rounded-sm border border-[#E2E8F0] bg-white overflow-hidden">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
             <input 
               type="text" 
               placeholder="Tìm kiếm email..." 
               className="w-full bg-transparent pl-11 pr-4 py-2.5 text-sm focus:outline-none placeholder:text-gray-400 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
             />
           </div>
           <button className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-black py-2.5 px-6 text-center font-bold text-white hover:bg-opacity-90 transition-all text-xs uppercase tracking-widest">
             <UserPlus size={16} /> Thêm người dùng
           </button>
        </div>
      </div>

      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-sm mt-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E2E8F0]">
                <th className="py-4 px-6 font-bold uppercase tracking-widest text-[10px] text-gray-500">Họ tên</th>
                <th className="py-4 px-6 font-bold uppercase tracking-widest text-[10px] text-gray-500">Email</th>
                <th className="py-4 px-6 font-bold uppercase tracking-widest text-[10px] text-gray-500">Quyền</th>
                <th className="py-4 px-6 font-bold uppercase tracking-widest text-[10px] text-gray-500">Trạng thái</th>
                <th className="py-4 px-6 font-bold uppercase tracking-widest text-[10px] text-gray-500 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user, idx) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#EFF2F7] rounded-full flex items-center justify-center font-bold text-[#64748B] overflow-hidden border border-[#E2E8F0] shrink-0 text-xs">
                        {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : user.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-black text-sm uppercase tracking-tight">
                          {user.fullName || 'Chưa cập nhật'}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">ID: {user.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-600">
                    {user.email}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-full ${user.role === 'ADMIN' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {user.isActive ? (
                      <span className="inline-flex rounded-full py-1 px-3 text-[10px] font-bold uppercase tracking-widest bg-[#219653]/10 text-[#219653]">
                        <ShieldCheck size={14} className="mr-1.5 inline-block" /> Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full py-1 px-3 text-[10px] font-bold uppercase tracking-widest bg-[#EB5757]/10 text-[#EB5757]">
                        <ShieldAlert size={14} className="mr-1.5 inline-block" /> Bị khóa
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${user.isActive ? 'text-[#EB5757] hover:bg-[#EB5757]/10' : 'text-[#219653] hover:bg-[#219653]/10'}`}
                      >
                        {user.isActive ? 'Khóa' : 'Mở khóa'}
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-1.5 text-gray-400 hover:text-[#EB5757] hover:bg-[#EB5757]/10 rounded transition-all"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {loading && (
          <div className="py-12 border-t border-gray-100 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && users.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Trang <span className="text-black">{pagination.page}</span> trên <span className="text-black">{pagination.lastPage}</span>
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-gray-200 rounded hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(pagination.lastPage)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 text-[11px] font-bold rounded transition-all ${pagination.page === i + 1 ? 'bg-black text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                  >
                    {i + 1}
                  </button>
                )).slice(Math.max(0, pagination.page - 3), Math.min(pagination.lastPage, pagination.page + 2))}
              </div>
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.lastPage}
                className="p-2 border border-gray-200 rounded hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
