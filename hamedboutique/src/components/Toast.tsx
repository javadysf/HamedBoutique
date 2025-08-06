"use client";
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'error' | 'success' | 'warning';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-gradient-to-r from-red-400 to-red-300 text-white';
      case 'success':
        return 'bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-gray-800';
      case 'warning':
        return 'bg-gradient-to-r from-gray-400 to-gray-300 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-300 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className={`px-8 py-6 rounded-xl shadow-2xl transform transition-all duration-300 scale-100 ${getToastStyles()}`}>
        <div className="flex items-center gap-4">
          <span className="text-3xl">
            {type === 'error' && '⚠️'}
            {type === 'success' && '✅'}
            {type === 'warning' && '🔔'}
          </span>
          <span className="font-bold text-lg">{message}</span>
          <button onClick={onClose} className="opacity-70 hover:opacity-100 ml-2 text-xl">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;