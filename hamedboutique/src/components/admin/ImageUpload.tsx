"use client";
import React, { useState } from 'react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
  onRemove?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, currentImage, label = "آپلود تصویر", onRemove }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');

  React.useEffect(() => {
    setPreview(currentImage || '');
  }, [currentImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // بررسی نوع فایل
    if (!file.type.startsWith('image/')) {
      alert('لطفاً فقط فایل تصویری انتخاب کنید');
      return;
    }

    // بررسی سایز فایل (حداکثر 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حداکثر سایز فایل 5 مگابایت است');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setPreview(data.url);
        onUpload(data.url);
      } else {
        alert(data.error || 'خطا در آپلود تصویر');
      }
    } catch (error) {
      alert('خطا در آپلود تصویر');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
        </div>
        
        {preview && (
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
            <img 
              src={preview} 
              alt="پیش‌نمایش" 
              className="w-full h-full object-cover"
            />
            </div>
            <button
              type="button"
              onClick={() => {
                setPreview('');
                onUpload('');
                onRemove?.();
              }}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {uploading && (
        <div className="flex items-center text-sm text-blue-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin ml-2"></div>
          در حال آپلود...
        </div>
      )}

      <p className="text-xs text-gray-500">
        فرمت‌های مجاز: JPG, PNG, GIF - حداکثر سایز: 5MB
      </p>
    </div>
  );
};

export default ImageUpload;