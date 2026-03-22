import React, { useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import useProductStore from '../../store/product.store';
import { formatProduct } from '../../lib/utils/productUtils';

const ProductList = () => {
  const { products, isLoading, fetchProductsWithPagination, pagination } = useProductStore();

  useEffect(() => {
    fetchProductsWithPagination({ page: 1, limit: 12 });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 mx-auto">
        <h2 className="mb-8 text-2xl font-bold text-center md:text-3xl">Sản Phẩm</h2>
        
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
            </div>
            <p className="text-lg text-gray-500">Không có sản phẩm nào</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={formatProduct(product)} />
              ))}
            </div>

            {/* Pagination UI */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center py-12 space-x-2">
                <button
                  onClick={() => fetchProductsWithPagination({ page: pagination.page - 1, limit: pagination.limit })}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trang trước
                </button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => fetchProductsWithPagination({ page: i + 1, limit: pagination.limit })}
                      className={`w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                        pagination.page === i + 1
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => fetchProductsWithPagination({ page: pagination.page + 1, limit: pagination.limit })}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;