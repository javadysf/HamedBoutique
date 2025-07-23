import React from "react";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = "medium", 
  text = "در حال بارگذاری...", 
  className = "" 
}) => {
  const sizeClasses = {
    small: "w-12 h-16",
    medium: "w-16 h-20", 
    large: "w-20 h-24"
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className={`${sizeClasses[size]} relative animate-pulse`}>
        {/* آیکون لباس */}
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-full h-full text-gray-700"
        >
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9L3 7V9C3 9.6 3.4 10 4 10H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V10H20C20.6 10 21 9.6 21 9ZM17 20H7V10H17V20Z"/>
        </svg>
        {/* افکت درخشش */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
      </div>
      {text && (
        <p className="mt-4 text-gray-400 font-medium text-center animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default Loading; 