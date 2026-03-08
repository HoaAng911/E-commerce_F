import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProductStore from '../store/product.store';

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchProductsWithPagination, loading, products, pagination } = useProductStore();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  // Lấy params hiện tại từ URL
  const getFiltersFromUrl = useCallback(() => ({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
  }), [searchParams]);

  // Hàm cập nhật URL khi filter thay đổi
  const updateFilters = (newFilters) => {
    const current = Object.fromEntries([...searchParams]);
    const updated = { ...current, ...newFilters, page: 1 }; // Reset về page 1 khi lọc

    // Xóa các key trống
    Object.keys(updated).forEach(key => {
      if (!updated[key]) delete updated[key];
    });

    setSearchParams(updated);
  };

  // Gọi API mỗi khi URL Params thay đổi
  useEffect(() => {
    const filters = getFiltersFromUrl();
    fetchProductsWithPagination(filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, fetchProductsWithPagination, getFiltersFromUrl]);

  return {
    filters: getFiltersFromUrl(),
    updateFilters,
    searchInput,
    setSearchInput,
    loading,
    products,
    pagination
  };
};