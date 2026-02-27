
import { create } from 'zustand';
import productApi from '../api/product.service';

const useProductStore = create((set, get) => ({

  products: [],
  featured: [],
  newArrivals: [],
  bestSellers: [],
  discounted: [],
  topRated: [],
  flashSale: [],
  selectedProduct: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setProducts: (products) => set({ products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  // product.store.js - Thêm hàm mới
  fetchProductsWithPagination: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await productApi.getPaginated(params);
      set({
        products: response.data.products || response.data,
        loading: false,
        pagination: {
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages
        }
      });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  // Lấy tất cả sản phẩm
  fetchProducts: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await productApi.getAll(params);
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Lấy dữ liệu trang chủ
  fetchHomepageData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await productApi.getHomepageData();
      set({
        ...response.data,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Lấy sản phẩm theo ID
  fetchProductById: async (id) => {
    set({ loading: true, error: null, selectedProduct: null });
    try {
      const response = await productApi.getById(id);
      set({ selectedProduct: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Lấy sản phẩm theo slug
  fetchProductBySlug: async (slug) => {
    set({ loading: true, error: null, selectedProduct: null });
    try {
      const response = await productApi.getBySlug(slug);
      set({ selectedProduct: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await productApi.create(data);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await productApi.update(id, data);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productApi.delete(id);

      // Xóa khỏi state
      const products = get().products.filter(product => product.id !== id);
      set({ products, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Getter: Lấy sản phẩm theo ID từ state
  getProductById: (id) => {
    return get().products.find(product => product.id === id) || null;
  },

  // Getter: Tìm kiếm sản phẩm
  searchProducts: (keyword) => {
    const products = get().products;
    if (!keyword) return products;

    const searchTerm = keyword.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm)
    );
  },

  // Getter: Lọc sản phẩm
  filterProducts: (filters) => {
    let products = [...get().products];

    if (filters.category) {
      products = products.filter(p => p.categoryId === filters.category);
    }

    if (filters.brand) {
      products = products.filter(p => p.brand === filters.brand);
    }

    if (filters.minPrice || filters.maxPrice) {
      products = products.filter(p => {
        if (filters.minPrice && p.price < filters.minPrice) return false;
        if (filters.maxPrice && p.price > filters.maxPrice) return false;
        return true;
      });
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'popular':
          products.sort((a, b) => b.soldCount - a.soldCount);
          break;
      }
    }

    return products;
  },

  // Reset state
  reset: () => set({
    products: [],
    featured: [],
    newArrivals: [],
    bestSellers: [],
    discounted: [],
    topRated: [],
    flashSale: [],
    selectedProduct: null,
    loading: false,
    error: null,
  }),
}));

export default useProductStore;