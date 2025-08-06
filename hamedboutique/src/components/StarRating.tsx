"use client";
import React, { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  value, 
  onChange, 
  size = 'md', 
  readonly = false 
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const handleClick = (rating: number) => {
    if (!readonly) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const getStarColor = (starNumber: number) => {
    const currentValue = hoverValue || value;
    if (starNumber >= currentValue) {
      return 'text-yellow-400';
    }
    return 'text-white';
  };

  const getStarStyle = (starNumber: number) => {
    const currentValue = hoverValue || value;
    if (starNumber < currentValue) {
      return { WebkitTextStroke: '1px #d1d5db' };
    }
    return {};
  };

  return (
    <div className={`flex gap-1 ${readonly ? '' : 'cursor-pointer'} select-none`}>
      {[5, 4, 3, 2, 1].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={`${sizeClasses[size]} transition-all duration-200 ${getStarColor(star)} ${
            readonly ? '' : 'hover:scale-110 hover:text-yellow-500'
          }`}
          style={getStarStyle(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;