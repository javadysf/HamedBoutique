import React from "react";

interface DividerProps {
  icon?: string;
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ 
  icon = "★", 
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center my-12 ${className}`}>
      <div className="flex-1 h-px bg-gray-300" />
      <span className="mx-6 text-3xl text-gray-700 select-none">{icon}</span>
      <div className="flex-1 h-px bg-gray-300" />
    </div>
  );
};

export default Divider; 