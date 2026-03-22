import React, { useEffect, useState } from 'react';
import { Trash2, ShieldCheck, ShieldAlert, UserPlus, Search } from 'lucide-react';
import userService from '../../../api/user.service';
import { toast } from 'sonner';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data); // backend trả về mảng user ở trong object hoặc root array tùy API
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Gọi @Patch(':id') update() để thay đổi isActive
  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await userService.updateUserStatus(id, !currentStatus);
      fetchUsers(); // Tải lại danh sách
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  // Gọi @Delete(':id') remove()
  const deleteUser = async (id) => {
    if (window.confirm("BẠN CÓ CHẮC MUỐN XÓA THÀNH VIÊN NÀY?")) {
      try {
        await userService.deleteUser(id);
        toast.success("Xóa thành viên thành công");
      } catch (error) {
        toast.error("Xóa thất bại");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">
            Quản lý người dùng
          </h2>
          <p className="text-sm font-medium text-[#64748B] mt-1">
            Tổng số: {users.length} thành viên
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
           <div className="relative w-full sm:w-64 rounded-sm border border-[#E2E8F0] bg-white overflow-hidden">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
             <input 
               type="text" 
               placeholder="Tìm kiếm email..." 
               className="w-full bg-transparent pl-11 pr-4 py-2 text-sm focus:outline-none"
             />
           </div>
           <button className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-blue-600 py-2 px-6 font-medium text-white hover:bg-opacity-90 transition-all">
             <UserPlus size={16} /> Thêm người dùng
           </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-sm mt-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E2E8F0]">
                <th className="py-4 px-6 font-medium text-black">Họ tên</th>
                <th className="py-4 px-6 font-medium text-black">Email</th>
                <th className="py-4 px-6 font-medium text-black">Quyền</th>
                <th className="py-4 px-6 font-medium text-black">Trạng thái</th>
                <th className="py-4 px-6 font-medium text-black text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className={`${idx === users.length - 1 ? '' : 'border-b border-[#E2E8F0]'} hover:bg-gray-50 transition-colors`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#EFF2F7] rounded-full flex items-center justify-center font-medium text-[#64748B] overflow-hidden border border-[#E2E8F0] shrink-0">
                        {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : user.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-black text-sm">
                          {user.fullName || 'Chưa cập nhật'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#64748B]">
                    {user.email}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium uppercase text-black">
                    {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {user.isActive ? (
                      <span className="inline-flex rounded-full py-1 px-3 text-sm font-medium bg-[#219653]/10 text-[#219653]">
                        <ShieldCheck size={16} className="mr-1 inline-block" /> Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full py-1 px-3 text-sm font-medium bg-[#EB5757]/10 text-[#EB5757]">
                        <ShieldAlert size={16} className="mr-1 inline-block" /> Bị khóa
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`text-sm font-medium hover:underline ${user.isActive ? 'text-[#EB5757]' : 'text-[#219653]'}`}
                      >
                        {user.isActive ? 'Khóa' : 'Mở khóa'}
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-1.5 text-[#EB5757] hover:bg-[#EB5757]/10 rounded transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {loading && (
          <div className="py-8 text-center text-sm font-medium text-[#64748B]">
            Đang tải dữ liệu...
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;