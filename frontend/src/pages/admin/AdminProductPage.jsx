import React, { useEffect, useState } from 'react';
import { Package, Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
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
        images: product.images ? product.images.join(', ') : '',
        sizes: product.sizes ? product.sizes.join(', ') : '',
        colors: product.colors ? product.colors.join(', ') : '',
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
      handleCloseModal();
      fetchData(); // Refresh the list
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Check console.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productApi.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

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
        <h1 className="text-2xl font-bold text-black">Quản lý sản phẩm</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-blue-600 py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all"
        >
          <Plus size={16} />
          Thêm sản phẩm
        </button>
      </div>

      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-sm mt-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-4 px-6 font-medium text-black">Hình ảnh</th>
                <th className="py-4 px-6 font-medium text-black">Sản phẩm</th>
                <th className="py-4 px-6 font-medium text-black">Giá</th>
                <th className="py-4 px-6 font-medium text-black">Tồn kho</th>
                <th className="py-4 px-6 font-medium text-black">Thương hiệu</th>
                <th className="py-4 px-6 font-medium text-black text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, idx) => (
                  <tr key={product.id} className={`${idx === products.length - 1 ? '' : 'border-b border-[#E2E8F0]'} hover:bg-gray-50 transition-colors`}>
                    <td className="py-4 px-6">
                      {product.mainImage ? (
                        <img src={product.mainImage} alt={product.name} className="w-12 h-12 object-cover rounded bg-gray-100" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                          <Package className="text-[#64748B]" size={20} />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-black">{product.name}</p>
                      <p className="text-sm text-[#64748B]">{product.category?.name || 'Chưa phân loại'}</p>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-black">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${product.stock > 10 ? 'bg-[#219653]/10 text-[#219653]' : product.stock > 0 ? 'bg-[#F2C94C]/10 text-[#F2C94C]' : 'bg-[#EB5757]/10 text-[#EB5757]'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#64748B]">
                      {product.brand}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleOpenModal(product)} className="hover:text-blue-600 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="hover:text-red-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 px-6 text-center text-[#64748B] font-medium">
                    Không tìm thấy sản phẩm nào. Hãy thêm một sản phẩm.
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
          <div className="bg-white rounded-sm shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="py-4 px-6 border-b border-[#E2E8F0] flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">
                {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button onClick={handleCloseModal} className="text-[#64748B] hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-[#EEF2F6]/50">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="mb-2.5 block text-black font-medium">Tên sản phẩm</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-600 active:border-blue-600" placeholder="Tên sản phẩm" />
                  </div>
                  <div className="space-y-2">
                    <label className="mb-2.5 block text-black font-medium">Thương hiệu</label>
                    <input required type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-600 active:border-blue-600" placeholder="Tên thương hiệu" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="mb-2.5 block text-black font-medium">Giá (VND)</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-600 active:border-blue-600" placeholder="990000" />
                  </div>
                  <div className="space-y-2">
                    <label className="mb-2.5 block text-black font-medium">Tồn kho</label>
                    <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-600 active:border-blue-600" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <label className="mb-2.5 block text-black font-medium">Danh mục</label>
                    <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-600 active:border-blue-600">
                      <option value="" disabled>Chọn danh mục</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="mb-2.5 block text-black font-medium">Mô tả</label>
                  <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-600 active:border-blue-600" placeholder="Mô tả sản phẩm..."></textarea>
                </div>

                {/* Images */}
                <div className="p-5 rounded-sm border border-[#E2E8F0] bg-white space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon size={18} className="text-[#64748B]" />
                    <h3 className="font-medium text-black">Hình ảnh</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="mb-2.5 block text-black font-medium">URL Ảnh chính</label>
                    <input required type="text" name="mainImage" value={formData.mainImage} onChange={handleInputChange} className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-600 active:border-blue-600" placeholder="https://..." />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="mb-2.5 block text-black font-medium">Ảnh phụ (Cách nhau bởi dấu phẩy)</label>
                    <input type="text" name="images" value={formData.images} onChange={handleInputChange} className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-600 active:border-blue-600" placeholder="https://img1.jpg, https://img2.jpg" />
                  </div>
                </div>

                {/* Variants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="mb-2.5 block text-black font-medium">Kích cỡ (Cách nhau dấu phẩy)</label>
                    <input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-600 active:border-blue-600" placeholder="39, 40, 41, 42" />
                  </div>
                  <div className="space-y-2">
                    <label className="mb-2.5 block text-black font-medium">Màu sắc (Cách nhau dấu phẩy)</label>
                    <input type="text" name="colors" value={formData.colors} onChange={handleInputChange} className="w-full rounded border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-600 active:border-blue-600" placeholder="Đen, Trắng, Đỏ" />
                  </div>
                </div>

              </form>
            </div>
            
            <div className="py-4 px-6 border-t border-[#E2E8F0] bg-gray-50 flex justify-end gap-4">
              <button onClick={handleCloseModal} className="rounded-sm border border-[#E2E8F0] px-6 py-2 font-medium text-black hover:bg-gray-100 transition-colors">
                Hủy
              </button>
              <button type="submit" form="productForm" className="rounded-sm bg-blue-600 px-6 py-2 font-medium text-white hover:bg-opacity-90 transition-colors">
                Lưu sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductPage;
