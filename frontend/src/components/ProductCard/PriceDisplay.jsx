import React from 'react';

const PriceDisplay = ({ price, originalPrice, className = '' }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={className}>
      <span className="text-xl font-bold text-gray-900">
        {formatPrice(price)}
      </span>
      {originalPrice && (
        <span className="block text-sm text-gray-500 line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;