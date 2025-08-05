"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';

const categories = [
  'پوشاک مردانه',
  'پوشاک زنانه',
  'کفش',
  'اکسسوری',
  'کیف و کوله',
  'عطر و ادکلن',
  'ساعت',
  'جواهرات'
];

export default function AddProductPage() {
  const [form, setForm] = useState({ 
    title: '', 
    price: '', 
    image: '', 
    images: [''],
    description: '', 
    category: '', 
    discount: '',
    colors: [''],
    sizes: ['']
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm({ ...form, images: newImages });
    setError('');
    setSuccess('');
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ''] });
  };

  const removeImageField = (index: number) => {
    if (form.images.length > 1) {
      const newImages = form.images.filter((_, i) => i !== index);
      setForm({ ...form, images: newImages });
    }
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...form.colors];
    newColors[index] = value;
    setForm({ ...form, colors: newColors });
  };

  const addColorField = () => {
    setForm({ ...form, colors: [...form.colors, ''] });
  };

  const removeColorField = (index: number) => {
    if (form.colors.length > 1) {
      const newColors = form.colors.filter((_, i) => i !== index);
      setForm({ ...form, colors: newColors });
    }
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...form.sizes];
    newSizes[index] = value;
    setForm({ ...form, sizes: newSizes });
  };

  const addSizeField = () => {
    setForm({ ...form, sizes: [...form.sizes, ''] });
  };

  const removeSizeField = (index: number) => {
    if (form.sizes.length > 1) {
      const newSizes = form.sizes.filter((_, i) => i !== index);
      setForm({ ...form, sizes: newSizes });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.price.trim() || !form.category.trim()) {
      setError('عنوان، قیمت و دسته‌بندی الزامی است');
      return;
    }

    if (Number(form.price) <= 0) {
      setError('قیمت باید بیشتر از صفر باشد');
      return;
    }

    if (form.discount && (Number(form.discount) < 0 || Number(form.discount) > 100)) {
      setError('درصد تخفیف باید بین 0 تا 100 باشد');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          price: Number(form.price),
          image: form.image.trim() || '/images/default-product.jpg',
          images: form.images.filter(img => img.trim() !== ''),
          description: form.description.trim(),
          category: form.category,
          discount: form.discount ? Number(form.discount) : 0,
          colors: form.colors.filter(color => color.trim() !== ''),
          sizes: form.sizes.filter(size => size.trim() !== ''),
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('محصول با موفقیت افزوده شد!');
        setForm({ title: '', price: '', image: '', images: [''], description: '', category: '', discount: '', colors: [''], sizes: [''] });
        setTimeout(() => router.push('/admin/products'), 1500);
      } else {
        setError(data.error || 'خطا در افزودن محصول');
      }
    } catch (error) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">افزودن محصول جدید</h1>
          <p className="text-gray-600 mt-1">محصول جدید را به فروشگاه اضافه کنید</p>
        </div>
        <Link 
          href="/admin/products" 
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          بازگشت به لیست محصولات
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان محصول *
            </label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="مثال: تی‌شرت مردانه کلاسیک" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>

          {/* Price and Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                قیمت (تومان) *
              </label>
              <input 
                name="price" 
                value={form.price} 
                onChange={handleChange} 
                placeholder="مثال: 150000" 
                type="number" 
                min="1"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                درصد تخفیف
              </label>
              <input 
                name="discount" 
                value={form.discount} 
                onChange={handleChange} 
                placeholder="مثال: 10" 
                type="number" 
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              دسته‌بندی *
            </label>
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required
            >
              <option value="">انتخاب دسته‌بندی</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Main Image */}
          <ImageUpload
            label="تصویر اصلی محصول *"
            currentImage={form.image}
            onUpload={(url) => setForm({ ...form, image: url })}
          />

          {/* Additional Images */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                تصاویر اضافی (گالری محصول)
              </label>
              <button
                type="button"
                onClick={addImageField}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                افزودن تصویر
              </button>
            </div>
            
            <div className="space-y-3">
              {form.images.map((image, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">تصویر {index + 1}</span>
                    {form.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                        title="حذف تصویر"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <ImageUpload
                    label={`تصویر ${index + 1}`}
                    currentImage={image}
                    onUpload={(url) => handleImageChange(index, url)}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">نکات مهم:</p>
                  <ul className="text-xs space-y-1">
                    <li>• این تصاویر در صفحه جزئیات محصول به صورت گالری نمایش داده می‌شوند</li>
                    <li>• کاربران می‌توانند روی تصاویر کلیک کنند و آنها را بزرگ ببینند</li>
                    <li>• فیلدهای خالی نادیده گرفته می‌شوند</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                رنگ‌های موجود
              </label>
              <button
                type="button"
                onClick={addColorField}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                افزودن رنگ
              </button>
            </div>
            <div className="space-y-2">
              {form.colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2 space-x-reverse">
                  <input
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    placeholder="مثال: قرمز, آبی, سفید"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {form.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColorField(index)}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                سایزهای موجود
              </label>
              <button
                type="button"
                onClick={addSizeField}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                افزودن سایز
              </button>
            </div>
            <div className="space-y-2">
              {form.sizes.map((size, index) => (
                <div key={index} className="flex items-center space-x-2 space-x-reverse">
                  <input
                    value={size}
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                    placeholder="مثال: S, M, L, XL, 38, 40, 42"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {form.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSizeField(index)}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیحات محصول
            </label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="توضیحات کامل محصول، ویژگی‌ها، جنس، سایز و..." 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              rows={4} 
            />
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 space-x-reverse pt-4">
            <Link 
              href="/admin/products" 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              انصراف
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  در حال افزودن...
                </>
              ) : (
                'افزودن محصول'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 