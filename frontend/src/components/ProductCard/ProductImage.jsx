import React, { useState } from 'react';
import { Eye, Heart } from 'lucide-react';

const ProductImage = ({ 
  image, 
  title, 
  discount, 
  tagLabels = [], 
  isLiked, 
  isHovered,
  onLike,
  onQuickView 
}) => {
  const handleLike = (e) => {
    e.stopPropagation();
    if (onLike) onLike();
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView();
  };

  return (
    <div className="relative overflow-hidden bg-gray-100 aspect-square">
      <img 
        src={image} 
        alt={title}
        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-sm font-bold text-white bg-red-500 rounded-full shadow-md">
            -{discount}%
          </span>
        </div>
      )}

      {/* Tags */}
      <div className="absolute flex flex-col gap-2 top-3 right-3">
        {tagLabels.map((tag, idx) => (
          <span 
            key={idx}
            className="px-2 py-1 text-xs font-medium text-gray-900 rounded-full shadow-sm bg-white/90 backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Quick Actions Overlay */}
      <div className={`absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent flex items-center justify-center gap-4 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <button 
          onClick={handleQuickView}
          className="p-3 transition-transform duration-300 bg-white rounded-full hover:bg-gray-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Xem nhanh"
        >
          <Eye className="w-5 h-5 text-gray-900" />
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
            isLiked ? 'text-white fill-white' : 'text-gray-900'
          }`} />
        </button>
      </div>
    </div>
  );
};

export default ProductImage;