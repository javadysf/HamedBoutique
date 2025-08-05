"use client";
import React, { useState } from 'react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, currentImage, label = "آپلود تصویر" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');

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
          <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
            <img 
              src={preview} 
              alt="پیش‌نمایش" 
              className="w-full h-full object-cover"
            />
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