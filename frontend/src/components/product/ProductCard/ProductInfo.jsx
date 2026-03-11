import React from 'react';
import RatingStars from './RatingStars';

const ProductInfo = ({ 
  name, 
  color, 
  title, 
  rating, 
  reviewCount,
  sizes = [] 
}) => {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-600">
          {name}
        </span>
        <span className="text-sm text-gray-500">
          {color}
        </span>
      </div>
      
      <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors duration-300 line-clamp-2 h-14 group-hover:text-blue-600">
        {title}
      </h3>

      {/* Rating */}
      <div className="mb-4">
        <RatingStars rating={rating} reviewCount={reviewCount} />
      </div>

      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {sizes.map((size, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded"
            >
              {size}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;