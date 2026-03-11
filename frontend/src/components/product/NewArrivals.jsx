import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard/ProductCard';
import useProductStore from '../../store/product.store';
import { useNavigate } from 'react-router-dom';

const NewArrivals = () => {

  const navigate = useNavigate();
  const { newArrivals, loading, error, fetchHomepageData } = useProductStore();

 
  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);


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

  const handleLike = (productId) => console.log('Liked product:', productId);
  const handleAddToCart = (product) => console.log('Add to cart:', product);
  const handleQuickView = (product) => console.log('Quick view:', product);
  const handleCardClick = (product) => console.log('Card clicked:', product);
  
  const handleSeeAll = () => {
    navigate('/products?sort=newest');
  };


  if (loading) return <div className="py-12 text-center">Đang tải...</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 uppercase">Sản phẩm mới</h2>
          <div className="w-16 h-1 mt-2 bg-black"></div>
          <p className="text-gray-500 text-sm mt-2 uppercase tracking-[0.2em]">Vừa cập bến tại cửa hàng</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {newArrivals?.slice(0, 8).map((product) => (
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

        <div className="mt-8 text-center">
          <button 
            onClick={handleSeeAll} 
            className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-black rounded hover:bg-gray-800 active:scale-95"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;