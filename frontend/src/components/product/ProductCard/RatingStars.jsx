import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating, reviewCount, showReviewCount = true }) => {
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {renderStars(rating)}
      </div>
      {showReviewCount && reviewCount && (
        <span className="ml-2 text-sm text-gray-600">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default RatingStars;