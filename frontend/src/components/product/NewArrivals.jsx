import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ProductCard/ProductCard';
import useProductStore from '../../store/product.store';

const NewArrivals = () => {
  const { newArrivals, loading, error, fetchHomepageData } = useProductStore();

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const formatProductData = (product) => ({
    id: product.id,
    title: product.name,
    categoryLabel: product.categoryId,
    image: product.mainImage,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discountPercent,
    rating: product.rating,
    reviewCount: product.reviewCount,
    tagLabels: product.isFeatured ? ['Mới'] : [],
    color: product.colors?.[0] || 'Đa màu',
    sizes: product.sizes || []
  });

  const handleLike = (productId) => {
    console.log('Liked product:', productId);
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
  };

  const handleQuickView = (product) => {
    console.log('Quick view:', product);
  };

  const handleCardClick = (product) => {
    console.log('Card clicked:', product);
  };

  if (loading) {
    return (
      <section className="w-full py-12 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <div className="w-48 h-8 mb-2 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="overflow-hidden bg-white border border-gray-200 rounded animate-pulse">
                <div className="bg-gray-200 aspect-square"></div>
                <div className="p-4">
                  <div className="w-2/3 h-4 mb-2 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-12 bg-gray-50">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-md p-6 mx-auto text-red-600 border border-red-200 rounded bg-red-50">
            <p className="font-medium">Không thể tải sản phẩm</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!newArrivals || newArrivals.length === 0) {
    return (
      <section className="w-full py-12 bg-gray-50">
        <div className="container px-4 mx-auto text-center">
          <div className="p-6 text-gray-500 border border-gray-200 rounded">
            Chưa có sản phẩm mới
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 uppercase">
            Sản phẩm mới
          </h2>

          <div className="w-16 h-1 mt-2 bg-black"></div>

          <p className="text-gray-500 text-sm mt-2 uppercase tracking-[0.2em]">Vừa cập bến tại cửa hàng</p>
        </div>

        {/* Grid sản phẩm */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {newArrivals.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={formatProductData(product)}
              isLiked={false}
              onLike={handleLike}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {/* Button xem thêm */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-black rounded hover:bg-gray-800">
            <span>Xem tất cả</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;