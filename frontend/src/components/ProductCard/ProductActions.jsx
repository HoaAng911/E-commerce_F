import React from 'react';
import { ShoppingBag } from 'lucide-react';
import PriceDisplay from './PriceDisplay'
const ProductActions = ({ 
  price, 
  originalPrice, 
  title, 
  onAddToCart 
}) => {
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart();
  };

  return (
    <div className="flex items-center justify-between">
      <PriceDisplay 
        price={price} 
        originalPrice={originalPrice} 
      />
      
      <button 
        onClick={handleAddToCart}
        className="flex items-center px-4 py-2 text-sm font-semibold text-white transition-all duration-300 bg-gray-900 rounded-lg hover:bg-black hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        aria-label={`Thêm ${title} vào giỏ hàng`}
      >
        <ShoppingBag className="w-3 h-3 mr-1" />
        Thêm
      </button>
    </div>
  );
};

export default ProductActions;