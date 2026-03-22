import React, { useEffect, useState } from 'react';
import { Package, Plus, Edit, Trash2, X, Image as ImageIcon, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from '../../lib/axios';
import productApi from '../../api/product.service';

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    discountPercent: 0,
    stock: 0,
    mainImage: '',
    images: '', // string for comma-separated
    sizes: '', // string
    colors: '', // string
    category: '', 
    brand: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productApi.getAll(),
        axios.get('/categories')
      ]);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : productsRes.data?.data || []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSlug = (name) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'name' && !editingProduct) {
        newData.slug = calculateSlug(value);
      }
      return newData;
    });
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        discountPercent: product.discountPercent || 0,
        stock: product.stock || 0,
        mainImage: product.mainImage || '',
        images: Array.isArray(product.images) ? product.images.join(', ') : (product.images || ''),
        sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
        category: product.category?.id || product.categoryId || '',
        brand: product.brand || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', slug: '', description: '', price: '', originalPrice: '',
        discountPercent: 0, stock: 0, mainImage: '', images: '', sizes: '',
        colors: '', category: '', brand: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        mainImage: formData.mainImage.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        discountPercent: Number(formData.discountPercent),
        stock: Number(formData.stock),
        images: formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : [],
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: formData.colors ? formData.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      if (editingProduct) {
        await productApi.update(editingProduct.id, payload);
      } else {
        await productApi.create(payload);
      }
      toast.success(editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!');
      handleCloseModal();
      fetchData(); // Refresh the list
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu sản phẩm");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await productApi.delete(id);
        toast.success('Đã xóa sản phẩm');
        fetchData();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-admin-text tracking-tight uppercase">Quản lý sản phẩm</h1>
          <p className="text-admin-subtext text-sm font-bold mt-1 uppercase tracking-widest">Danh mục hàng hóa trong hệ thống</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="inline-flex items-center justify-center gap-3 rounded-xl bg-admin-primary px-8 py-3.5 text-center font-black text-xs uppercase tracking-widest text-white hover:bg-indigo-600 shadow-lg shadow-admin-primary/25 transition-all active:scale-95"
        >
          <Plus size={18} />
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white border border-admin-border rounded-2xl shadow-admin-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-admin-subtext uppercase tracking-widest">
                <th className="px-6 py-5">Hình ảnh</th>
                <th className="px-6 py-5">Sản phẩm</th>
                <th className="px-6 py-5">Giá</th>
                <th className="px-6 py-5 text-center">Tồn kho</th>
                <th className="px-6 py-5">Thương hiệu</th>
                <th className="px-6 py-5 text-right pr-10">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-admin-border p-1">
                        {product.mainImage ? (
                          <img src={product.mainImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-admin-subtext bg-slate-50">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-admin-text group-hover:text-admin-primary transition-colors cursor-pointer uppercase italic tracking-tight">{product.name}</p>
                      <p className="text-[10px] font-bold text-admin-subtext uppercase tracking-widest mt-1">{product.category?.name || 'Chưa phân loại'}</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-admin-text italic">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                        product.stock > 10 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        product.stock > 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-admin-subtext uppercase tracking-widest">
                      {product.brand}
                    </td>
                    <td className="px-6 py-5 text-right pr-10">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(product)} className="p-2.5 text-admin-subtext hover:text-admin-primary hover:bg-admin-primary-light rounded-xl transition-all">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2.5 text-admin-subtext hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-admin-subtext font-bold uppercase tracking-widest">
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20 animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-10 py-8 border-b border-admin-border flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-admin-text uppercase tracking-tight italic">
                  {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h2>
                <p className="text-[10px] font-bold text-admin-subtext uppercase tracking-[0.2em] mt-1">Vui lòng điền đầy đủ thông tin bên dưới</p>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="w-12 h-12 flex items-center justify-center text-admin-subtext hover:text-black hover:bg-white rounded-2xl shadow-sm border border-transparent hover:border-admin-border transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-10 overflow-y-auto flex-1 custom-scrollbar">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-10">
                
                {/* Section: Basic Info */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 pb-2 border-b border-admin-border">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-admin-primary">
                         <Package size={18} />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-admin-text">Thông tin cơ bản</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-admin-subtext ml-1">Tên sản phẩm *</label>
                       <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 px-6 text-sm font-bold text-admin-text outline-none transition focus:border-admin-primary focus:bg-white active:ring-4 active:ring-admin-primary/10" placeholder="Ví dụ: Nike Air Max 270" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-admin-subtext ml-1">Thương hiệu *</label>
                       <input required type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 px-6 text-sm font-bold text-admin-text outline-none transition focus:border-admin-primary focus:bg-white" placeholder="Ví dụ: Nike, Adidas" />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-admin-subtext ml-1">Giá bán (VND) *</label>
                       <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 px-6 text-sm font-bold text-admin-text outline-none transition focus:border-admin-primary focus:bg-white" placeholder="0" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-admin-subtext ml-1">Số lượng tồn kho *</label>
                       <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 px-6 text-sm font-bold text-admin-text outline-none transition focus:border-admin-primary focus:bg-white" placeholder="100" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-admin-subtext ml-1">Danh mục *</label>
                       <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 px-6 text-sm font-bold text-admin-text outline-none transition focus:border-admin-primary focus:bg-white appearance-none">
                         <option value="" disabled>Chọn danh mục</option>
                         {categories.map(cat => (
                           <option key={cat.id} value={cat.id}>{cat.name}</option>
                         ))}
                       </select>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-admin-subtext ml-1">Mô tả sản phẩm *</label>
                     <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-admin-text outline-none transition focus:border-admin-primary focus:bg-white" placeholder="Nhập mô tả sản phẩm ở đây..."></textarea>
                   </div>
                </div>

                {/* Section: Images with Previews */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 pb-2 border-b border-admin-border">
                      <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
                         <ImageIcon size={18} />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-admin-text">Quản lý hình ảnh</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Main Image */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-admin-subtext ml-1">Link ảnh chính</label>
                           <input required type="text" name="mainImage" value={formData.mainImage} onChange={handleInputChange} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 px-6 text-xs font-bold text-admin-primary outline-none transition focus:border-admin-primary focus:bg-white" placeholder="https://cloudinary.com/..." />
                        </div>
                        <div className="aspect-video rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center p-4 relative overflow-hidden group">
                           {formData.mainImage ? (
                              <>
                                <img src={formData.mainImage} alt="preview" className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                   <a href={formData.mainImage} target="_blank" rel="noreferrer" className="bg-white p-3 rounded-2xl text-admin-text"><ExternalLink size={20} /></a>
                                </div>
                              </>
                           ) : (
                              <div className="text-center">
                                 <ImageIcon size={40} className="mx-auto text-slate-200 mb-2" />
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Chưa có ảnh chính</p>
                              </div>
                           )}
                        </div>
                      </div>

                      {/* Secondary Images */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-admin-subtext ml-1">Link ảnh phụ (Cách nhau bởi dấu phẩy)</label>
                           <input type="text" name="images" value={formData.images} onChange={handleInputChange} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 px-6 text-xs font-bold text-admin-primary outline-none transition focus:border-admin-primary focus:bg-white" placeholder="link1, link2, link3..." />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                           {formData.images.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3).map((img, idx) => (
                              <div key={idx} className="aspect-square rounded-2xl bg-slate-50 border border-slate-200 p-2 relative group overflow-hidden">
                                 <img src={img} alt={`sub-${idx}`} className="w-full h-full object-contain mix-blend-multiply" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <AlertCircle size={14} className="text-white" />
                                 </div>
                              </div>
                           ))}
                           {formData.images.split(',').map(s => s.trim()).filter(Boolean).length === 0 && (
                              <div className="col-span-3 h-24 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center italic text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                 Trống
                              </div>
                           )}
                        </div>
                        <p className="text-[9px] font-bold text-admin-subtext italic">Mẹo: Copy link từ Cloudinary và dán vào đây, ngăn cách bằng dấu phẩy.</p>
                      </div>
                   </div>
                </div>

                {/* Section: Variants */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 pb-2 border-b border-admin-border">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                         <Activity size={18} />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-admin-text">Thuộc tính & Biến thể</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-admin-subtext ml-1">Kích cỡ (Cách nhau dấu phẩy)</label>
                       <input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 px-6 text-sm font-bold text-admin-text outline-none transition focus:border-admin-primary focus:bg-white" placeholder="39, 40, 41, 42" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-admin-subtext ml-1">Màu sắc (Cách nhau dấu phẩy)</label>
                       <input type="text" name="colors" value={formData.colors} onChange={handleInputChange} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 px-6 text-sm font-bold text-admin-text outline-none transition focus:border-admin-primary focus:bg-white" placeholder="Đen, Trắng, Đỏ" />
                     </div>
                   </div>
                </div>

              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="px-10 py-8 border-t border-admin-border bg-slate-50/50 flex justify-end gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
              <button 
                onClick={handleCloseModal} 
                className="rounded-2xl border-2 border-slate-200 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-admin-text hover:bg-white transition-all active:scale-95"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                form="productForm" 
                className="rounded-2xl bg-admin-text px-10 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-black shadow-lg shadow-black/10 transition-all active:scale-95"
              >
                {editingProduct ? 'Cập nhật ngay' : 'Thêm sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Icon placeholders if not imported
const Activity = ({ size, className }) => <div className={className}><Plus size={size} /></div>;

export default AdminProductPage;
