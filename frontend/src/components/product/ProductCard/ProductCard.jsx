import React, { useState } from 'react';
import { Eye, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// ProductCard Component
const ProductCard = ({
  product,
  isLiked = false,
  onLike,
  onAddToCart,
  onQuickView,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    id,
    title,
    categoryLabel,
    image,
    price,
    originalPrice,
    discount,
    rating,
    reviewCount,
    tagLabels = [],
    stock,
  } = product;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCardClick = () => {
    if (onClick) onClick(product);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (onLike) onLike(id);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <Link to={`/products/${id}`} className="block h-full group">
      <article
        className="relative overflow-hidden transition-all duration-300 bg-white cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Product Image */}
        <div className={`relative overflow-hidden bg-gray-100 aspect-square ${stock === 0 ? 'grayscale opacity-60' : ''}`}>
          <img
            src={image}
            alt={title}
            className="object-contain w-full h-full p-2 transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 text-sm font-bold text-white rounded-b-sm shadow-md bg-blue-600">
                -{discount}%
              </span>
            </div>
          )}

          {/* Out of Stock Badge */}
          {stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="px-4 py-2 text-xs font-black uppercase tracking-widest text-white bg-black/80 backdrop-blur-sm rounded-full">
                Hết hàng
              </span>
            </div>
          )}

          {/* Tags */}
          <div className="absolute flex flex-col gap-2 top-3 right-3">
            {tagLabels.map((tag, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 text-xs font-medium text-black bg-white/90 rounded-full shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Quick Actions Overlay */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button 
              onClick={handleQuickView}
              className="p-3 transition-transform duration-300 bg-white rounded-full hover:bg-gray-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Xem nhanh"
            >
              <Eye className="w-5 h-5 text-black" />
            </button>
            <button 
              onClick={handleLike}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white ${
                isLiked 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white hover:bg-gray-100'
              }`}
              aria-label={isLiked ? "Bỏ thích" : "Thêm vào yêu thích"}
            >
              <Heart className={`w-5 h-5 ${
                isLiked ? 'text-white fill-current' : 'text-black'
              }`} />
            </button>
          </div>
        </div>

        {/* Product Info - Centered */}
        <div className="p-3 text-center">
          <h3 className="mb-2 text-sm font-medium text-gray-900 line-clamp-2 min-h-10">
            {title}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-center gap-2">
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-base font-bold text-gray-900">
              {formatPrice(price)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;