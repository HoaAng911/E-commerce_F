import React, { useEffect, useState } from 'react';
import { FileText, Plus, Edit, Trash2, X, Image as ImageIcon, Eye } from 'lucide-react';
import useArticleStore from '../../store/article.store';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminArticlePage = () => {
  const { articles, fetchArticlesForAdmin, createArticle, updateArticle, deleteArticle, isLoading } = useArticleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    thumbnail: '',
    content: '',
    isActive: true
  });

  useEffect(() => {
    fetchArticlesForAdmin();
  }, [fetchArticlesForAdmin]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleOpenModal = (article = null) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title || '',
        thumbnail: article.thumbnail || '',
        content: article.content || '',
        isActive: article.isActive !== undefined ? article.isActive : true
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        thumbnail: '',
        content: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, formData);
      } else {
        await createArticle(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Lỗi khi lưu bài viết.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      try {
        await deleteArticle(id);
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-black">Quản lý bài viết</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-black py-2.5 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all text-sm uppercase tracking-widest"
        >
          <Plus size={16} />
          Thêm bài viết
        </button>
      </div>

      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-sm mt-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-4 px-6 font-medium text-black">Thumbnail</th>
                <th className="py-4 px-6 font-medium text-black">Tiêu đề</th>
                <th className="py-4 px-6 font-medium text-black">Tác giả</th>
                <th className="py-4 px-6 font-medium text-black">Lượt xem</th>
                <th className="py-4 px-6 font-medium text-black">Trạng thái</th>
                <th className="py-4 px-6 font-medium text-black text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {articles.length > 0 ? (
                articles.map((article, idx) => (
                  <tr key={article.id} className={`${idx === articles.length - 1 ? '' : 'border-b border-[#E2E8F0]'} hover:bg-gray-50 transition-colors`}>
                    <td className="py-4 px-6">
                      {article.thumbnail ? (
                        <img src={article.thumbnail} alt={article.title} className="w-16 h-10 object-cover rounded bg-gray-100" />
                      ) : (
                        <div className="w-16 h-10 bg-gray-100 flex items-center justify-center rounded">
                          <FileText className="text-[#64748B]" size={20} />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-black line-clamp-1">{article.title}</p>
                      <p className="text-xs text-[#64748B] mt-1">{new Date(article.createdAt).toLocaleDateString('vi-VN')}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#64748B]">
                      {article.author?.fullName || 'Admin'}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center gap-1.5 text-[#64748B]">
                        <Eye size={14} />
                        {article.views || 0}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`inline-flex rounded-full py-1 px-3 text-xs font-bold uppercase tracking-wider ${article.isActive ? 'bg-[#219653]/10 text-[#219653]' : 'bg-[#EB5757]/10 text-[#EB5757]'}`}>
                        {article.isActive ? 'Hoạt động' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleOpenModal(article)} className="hover:text-blue-600 transition-colors" title="Sửa">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(article.id)} className="hover:text-red-600 transition-colors" title="Xóa">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 px-6 text-center text-[#64748B] font-medium">
                    Không tìm thấy bài viết nào. Hãy tạo bài viết đầu tiên.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
            <div className="py-4 px-6 border-b border-[#E2E8F0] flex items-center justify-between">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">
                {editingArticle ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
              </h2>
              <button onClick={handleCloseModal} className="text-[#64748B] hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-[#EEF2F6]/30">
              <form id="articleForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Tiêu đề */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Tiêu đề bài viết</label>
                      <input 
                        required 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleInputChange} 
                        className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-white py-3 px-5 text-black outline-none transition focus:border-black" 
                        placeholder="Nhập tiêu đề..." 
                      />
                    </div>

                    {/* Nội dung */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Nội dung bài viết</label>
                      <div className="bg-white rounded border-[1.5px] border-[#E2E8F0] overflow-hidden focus-within:border-black transition">
                        <ReactQuill 
                          theme="snow"
                          value={formData.content}
                          onChange={handleEditorChange}
                          className="h-[400px] flex flex-col"
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              ['link', 'image'],
                              ['clean']
                            ],
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Thumbnail */}
                    <div className="p-5 rounded-sm border border-[#E2E8F0] bg-white space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon size={18} className="text-[#64748B]" />
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-black">Hình ảnh đại diện</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase text-gray-400">URL Thumbnail</label>
                        <input 
                          required 
                          type="text" 
                          name="thumbnail" 
                          value={formData.thumbnail} 
                          onChange={handleInputChange} 
                          className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-white py-2.5 px-4 text-sm text-black outline-none transition focus:border-black" 
                          placeholder="https://..." 
                        />
                      </div>
                      
                      {formData.thumbnail && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                           <p className="text-[10px] uppercase text-gray-400 mb-2">Xem trước:</p>
                           <img src={formData.thumbnail} alt="Preview" className="w-full aspect-video object-cover rounded" />
                        </div>
                      )}
                    </div>

                    {/* Settings */}
                    <div className="p-5 rounded-sm border border-[#E2E8F0] bg-white space-y-4">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-black">Cài đặt</h3>
                      
                      <div className="flex items-center gap-3 py-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="isActive" 
                            checked={formData.isActive} 
                            onChange={handleInputChange} 
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          <span className="ml-3 text-sm font-medium text-black">Hiển thị công khai</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="py-4 px-6 border-t border-[#E2E8F0] bg-gray-50 flex justify-end gap-3">
              <button onClick={handleCloseModal} className="rounded-sm border border-[#E2E8F0] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-white transition-colors">
                Hủy
              </button>
              <button 
                type="submit" 
                form="articleForm" 
                disabled={isLoading}
                className="rounded-sm bg-black px-8 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? 'Đang lưu...' : (editingArticle ? 'Cập nhật' : 'Đăng bài')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticlePage;
