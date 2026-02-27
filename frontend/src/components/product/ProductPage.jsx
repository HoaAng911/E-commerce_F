import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProductStore from '../../store/product.store';
import ProductCard from '../ProductCard/ProductCard';
import Pagination from '../common/Pagination';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const { products, loading, pagination, fetchProductsWithPagination } = useProductStore();
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true
  });

  const getParamsFromUrl = () => {
    return {
      keyword: searchParams.get('q') || '',
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sort') || 'newest',
      page: Math.max(1, Number(searchParams.get('page')) || 1),
      limit: 20,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const params = getParamsFromUrl();
      const apiParams = {
        page: params.page,
        limit: params.limit,
        search: params.keyword || undefined,
        category: params.category || undefined,
        brand: params.brand || undefined,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      };

      if (params.sortBy === 'price-asc') {
        apiParams.sortBy = 'price';
        apiParams.sortOrder = 'ASC';
      } else if (params.sortBy === 'price-desc') {
        apiParams.sortBy = 'price';
        apiParams.sortOrder = 'DESC';
      } else if (params.sortBy === 'best-seller') {
        apiParams.sortBy = 'soldCount';
        apiParams.sortOrder = 'DESC';
      } else if (params.sortBy === 'top-rated') {
        apiParams.sortBy = 'rating';
        apiParams.sortOrder = 'DESC';
      }

      await fetchProductsWithPagination(apiParams);
    };

    fetchData();
  }, [searchParams.toString()]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchParams.get('q')) {
        updateUrlParam('q', searchInput);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const updateUrlParam = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.delete('page');
    }
    window.history.pushState({}, '', `?${newParams.toString()}`);
    window.dispatchEvent(new Event('popstate'));
  }, [searchParams]);

  const handleFilterChange = useCallback((key, value) => {
    if (key === 'keyword') {
      setSearchInput(value);
    } else {
      updateUrlParam(key, value);
    }
  }, [updateUrlParam]);

  const handlePageChange = useCallback((newPage) => {
    updateUrlParam('page', newPage.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateUrlParam]);

  const handleResetFilters = useCallback(() => {
    setSearchInput('');
    window.history.pushState({}, '', window.location.pathname);
    window.dispatchEvent(new Event('popstate'));
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const currentParams = getParamsFromUrl();
  const totalItems = pagination?.total || 0;
  const currentPage = pagination?.page || currentParams.page;
  const itemsPerPage = pagination?.limit || 20;
  const totalPages = pagination?.totalPages || 1;

  const formatProductData = (product) => ({
    id: product.id,
    title: product.name,
    categoryLabel: product.categoryId,
    image: product.mainImage,
    price: parseFloat(product.price),
    originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
    discount: product.discountPercent || 0,
    rating: parseFloat(product.rating) || 0,
    reviewCount: product.reviewCount || 0,
    tagLabels: product.isFeatured ? ['Nổi bật'] : [],
    color: product.colors?.[0] || 'Đa màu',
    sizes: product.sizes || [],
    brand: product.brand,
  });

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const activeFiltersCount = [
    currentParams.keyword,
    currentParams.category,
    currentParams.brand,
    currentParams.minPrice,
    currentParams.maxPrice
  ].filter(Boolean).length;

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full px-1 py-4 text-left transition-colors hover:text-blue-600"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            expandedSections[sectionKey] ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-1 pb-4 space-y-3">{children}</div>
      )}
    </div>
  );

  const Sidebar = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'block' : 'hidden lg:block'} space-y-6`}>
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
                Xóa
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full py-3 pl-10 pr-4 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-0">
            <FilterSection title="Danh mục" sectionKey="category">
              <select
                value={currentParams.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                <option value="">Tất cả danh mục</option>
                <option value="kids">Giày trẻ em</option>
                <option value="men">Giày nam</option>
                <option value="women">Giày nữ</option>
                <option value="accessories">Phụ kiện</option>
              </select>
            </FilterSection>

            <FilterSection title="Thương hiệu" sectionKey="brand">
              <select
                value={currentParams.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                <option value="">Tất cả thương hiệu</option>
                <option value="adidas">Adidas</option>
                <option value="nike">Nike</option>
                <option value="puma">Puma</option>
                <option value="converse">Converse</option>
                <option value="vans">Vans</option>
              </select>
            </FilterSection>

            <FilterSection title="Khoảng giá" sectionKey="price">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={currentParams.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="Từ"
                  className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={currentParams.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="Đến"
                  className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => {
                    handleFilterChange('minPrice', '100000');
                    handleFilterChange('maxPrice', '500000');
                  }}
                  className="px-3 py-2 text-sm transition-colors border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700"
                >
                  100K-500K
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('minPrice', '500000');
                    handleFilterChange('maxPrice', '1000000');
                  }}
                  className="px-3 py-2 text-sm transition-colors border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700"
                >
                  500K-1TR
                </button>
                <button
                  onClick={() => handleFilterChange('minPrice', '1000000')}
                  className="px-3 py-2 text-sm transition-colors border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700"
                >
                  Trên 1TR
                </button>
              </div>
            </FilterSection>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Sản phẩm</h1>
          <p className="text-gray-600">
            {totalItems > 0 ? `Tìm thấy ${totalItems} sản phẩm phù hợp` : 'Đang tải sản phẩm...'}
          </p>
        </div>

        {/* Mobile filter button */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-center w-full gap-2 px-4 py-3 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">
              Bộ lọc {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </span>
          </button>
        </div>

        {/* Mobile filters overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
            <div className="absolute top-0 bottom-0 right-0 w-full max-w-sm overflow-y-auto bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b border-gray-200">
                <h2 className="text-lg font-semibold">Bộ lọc</h2>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4">
                <Sidebar isMobile={true} />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar - Desktop */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="p-4 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600">
                  {totalItems > 0 ? (
                    <>
                      Hiển thị <span className="font-semibold text-gray-900">{startItem}-{endItem}</span> của{' '}
                      <span className="font-semibold text-gray-900">{totalItems}</span> sản phẩm
                    </>
                  ) : (
                    'Đang tải dữ liệu...'
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">Sắp xếp:</span>
                  <select
                    value={currentParams.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp → Cao</option>
                    <option value="price-desc">Giá: Cao → Thấp</option>
                    <option value="best-seller">Bán chạy nhất</option>
                    <option value="top-rated">Đánh giá cao</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(9)].map((_, i) => (
                  <LoadingSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Hiển thị tất cả sản phẩm
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={formatProductData(product)} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}