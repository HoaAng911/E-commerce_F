import { useEffect, useState, useCallback } from 'react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProductStore from '../../../store/product.store';
import ProductCard from '../../ProductCard/ProductCard';
import ProductFilters from './ProductFilters';
import ProductSort from './ProductSort';
import Pagination from '../../common/Pagination';
import LoadingSkeleton from '../../common/LoadingSkeleton';
import { SlidersHorizontal, X } from 'lucide-react';
import useCategoryStore from '../../../store/category.store';
export default function ProductsPage() {
  const { products, loading, pagination, fetchProductsWithPagination } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ category: true, brand: true });
  const uniqueBrands = useMemo(() => {
    if (!products) return [];

    const brands = products.map(p => p.brand).filter(Boolean);
    return [...new Set(brands)].sort();
  }, [products]);

  const formatProductData = (product) => ({
    ...product,
    id: product.id,
    title: product.name,
    image: product.mainImage,
    categoryLabel: product.category?.name || 'Giày',
    discount: product.discountPercent, // 
    tagLabels: product.isFeatured ? ['Mới'] : [],
  });
  const params = {
    keyword: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sort') || 'newest',
    page: Math.max(1, Number(searchParams.get('page')) || 1),
  };

  useEffect(() => {
    fetchProductsWithPagination({
      page: params.page,
      limit: 12,
      search: params.keyword,
      category: params.category,
      brand: params.brand,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      sortBy: params.sortBy,
      sortOrder: params.sortBy === 'price_asc' ? 'ASC' : 'DESC'
    });
  }, [searchParams]);
  useEffect(() => {
    fetchCategories();
  }, []);
  const updateUrlParams = (newParams) => {
    const current = Object.fromEntries([...searchParams]);
    const updated = { ...current, ...newParams, page: 1 };
    Object.keys(updated).forEach(key => !updated[key] && delete updated[key]);
    setSearchParams(updated);
  };

  return (
    <div className="min-h-screen mt-10 bg-white">
      <div className="container px-4 py-12 mx-auto">
        <ProductSort
          total={pagination?.total || 0}
          sortBy={params.sortBy}
          onSortChange={(val) => updateUrlParams({ sort: val })}
        />

        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Sidebar Desktop */}
          <aside className="hidden w-64 lg:block shrink-0">
            <ProductFilters
              categories={categories}
              brands={uniqueBrands}
              selectedCategory={params.category}
              selectedBrand={params.brand}
              onFilterChange={(key, val) => updateUrlParams({ [key]: params[key] === val ? '' : val })}
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center justify-center w-full gap-2 py-3 mb-6 text-xs font-bold text-white uppercase bg-black lg:hidden rounded-xl"
            >
              <SlidersHorizontal className="w-4 h-4" /> Bộ lọc
            </button>

            {loading ? (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {[...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={formatProductData(product)} />
                  ))}
                </div>

                <div className="pt-10 mt-16 border-t border-gray-100">
                  <Pagination
                    currentPage={params.page}
                    totalPages={pagination?.totalPages || 0}
                    onPageChange={(page) => updateUrlParams({ page })}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}