"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({ 
    title: '', 
    price: '', 
    image: '', 
    images: [''],
    description: '', 
    category: '', 
    discount: '',
    inventory: [{ color: '', size: '', quantity: 0 }]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error('Product not found');
        }
        const data = await res.json();
        
        // Parse JSON fields safely
        let inventory = [{ color: '', size: '', quantity: 0 }];
        let images = [''];
        
        try {
          if (data.inventory) {
            if (typeof data.inventory === 'string') {
              inventory = JSON.parse(data.inventory);
            } else if (Array.isArray(data.inventory)) {
              inventory = data.inventory;
            }
          }
        } catch (e) {
          console.warn('Failed to parse inventory:', e);
        }
        
        try {
          if (data.images) {
            if (typeof data.images === 'string') {
              images = JSON.parse(data.images);
            } else if (Array.isArray(data.images)) {
              images = data.images;
            }
          }
        } catch (e) {
          console.warn('Failed to parse images:', e);
        }
        
        setForm({
          title: data.title || '',
          price: data.price?.toString() || '',
          image: data.image || '',
          images: images.length > 0 && images.some(img => img.trim() !== '') ? images : [''],
          description: data.description || '',
          category: data.category || '',
          discount: data.discount?.toString() || '',
          inventory: inventory.length > 0 && inventory.some(item => item.color || item.size || item.quantity) ? inventory : [{ color: '', size: '', quantity: 0 }]
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('خطا در دریافت اطلاعات محصول');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm({ ...form, images: newImages });
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

  const handleInventoryChange = (index: number, field: string, value: string | number) => {
    const newInventory = [...form.inventory];
    newInventory[index] = { ...newInventory[index], [field]: value };
    setForm({ ...form, inventory: newInventory });
  };

  const addInventoryField = () => {
    setForm({ ...form, inventory: [...form.inventory, { color: '', size: '', quantity: 0 }] });
  };

  const removeInventoryField = (index: number) => {
    if (form.inventory.length > 1) {
      const newInventory = form.inventory.filter((_, i) => i !== index);
      setForm({ ...form, inventory: newInventory });
    }
  };

  const getTotalQuantity = () => {
    return form.inventory.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  };

  const handleSubmit = async () => {
    
    if (!form.title.trim() || !form.price.trim() || !form.category.trim()) {
      setError('عنوان، قیمت و دستهبندی الزامی است');
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

    const validInventory = form.inventory.filter(item => 
      item.color.trim() !== '' && item.size.trim() !== '' && item.quantity > 0
    );

    if (validInventory.length === 0) {
      setError('حداقل یک آیتم موجودی با رنگ، سایز و تعداد معتبر الزامی است');
      return;
    }

    setSubmitting(true);
    
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title: form.title.trim(),
          price: Number(form.price),
          image: form.image.trim() || '/images/default-product.jpg',
          images: form.images.filter(img => img.trim() !== ''),
          description: form.description.trim(),
          category: form.category,
          discount: form.discount ? Number(form.discount) : 0,
          inventory: validInventory,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('محصول با موفقیت ویرایش شد!');
        setTimeout(() => router.push('/admin/products'), 1500);
      } else {
        setError(data.error || 'خطا در ویرایش محصول');
      }
    } catch (error) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4 space-x-reverse">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-gray-700">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  ویرایش محصول
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">ویرایش اطلاعات محصول موجود</p>
              </div>
            </div>
            <Link 
              href="/admin/products" 
              className="flex items-center px-3 py-2 sm:px-4 sm:py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">بازگشت</span>
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 px-4">
            <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse overflow-x-auto">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-shrink-0">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 text-sm sm:text-base ${
                    step <= currentStep 
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 transition-all duration-300 ${
                      step < currentStep ? 'bg-gradient-to-r from-amber-600 to-orange-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mb-6 px-4">
            <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-white rounded-full shadow-sm border border-gray-200">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                {currentStep === 1 && 'اطلاعات پایه محصول'}
                {currentStep === 2 && 'تصاویر و گالری'}
                {currentStep === 3 && 'مدیریت موجودی'}
                {currentStep === 4 && 'توضیحات و تکمیل'}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center ml-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">اطلاعات پایه محصول</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          عنوان محصول *
                        </label>
                        <input 
                          name="title" 
                          value={form.title} 
                          onChange={handleChange} 
                          placeholder="مثال: تیشرت مردانه کلاسیک" 
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg" 
                          required 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          دستهبندی *
                        </label>
                        <select 
                          name="category" 
                          value={form.category} 
                          onChange={handleChange} 
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg" 
                          required
                        >
                          <option value="">انتخاب دستهبندی</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          قیمت (تومان) *
                        </label>
                        <div className="relative">
                          <input 
                            name="price" 
                            value={form.price} 
                            onChange={handleChange} 
                            placeholder="150000" 
                            type="number" 
                            min="1"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg" 
                            required 
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            تومان
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          درصد تخفیف
                        </label>
                        <div className="relative">
                          <input 
                            name="discount" 
                            value={form.discount} 
                            onChange={handleChange} 
                            placeholder="10" 
                            type="number" 
                            min="0"
                            max="100"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg" 
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Images */}
              {currentStep === 2 && (
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center ml-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">تصاویر محصول</h2>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">تصویر اصلی محصول *</h3>
                      <ImageUpload
                        label="تصویر اصلی"
                        currentImage={form.image}
                        onUpload={(url) => setForm({ ...form, image: url })}
                      />
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">گالری تصاویر</h3>
                        <button
                          type="button"
                          onClick={addImageField}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          افزودن تصویر
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {form.images.map((image, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-600">تصویر {index + 1}</span>
                              {form.images.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeImageField(index)}
                                  className="flex items-center px-2 py-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 text-xs font-medium"
                                >
                                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  حذف
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
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Inventory */}
              {currentStep === 3 && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center ml-3">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">مدیریت موجودی</h2>
                        <p className="text-sm text-gray-600 mt-1">کل موجودی: <span className="font-bold text-orange-600">{getTotalQuantity()}</span> عدد</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addInventoryField}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      افزودن آیتم
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {form.inventory.map((item, index) => (
                      <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2">
                              {index + 1}
                            </div>
                            <span className="font-semibold text-gray-700">آیتم {index + 1}</span>
                          </div>
                          {form.inventory.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeInventoryField(index)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">رنگ</label>
                            <input
                              value={item.color}
                              onChange={(e) => handleInventoryChange(index, 'color', e.target.value)}
                              placeholder="مثال: قرمز"
                              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">سایز</label>
                            <input
                              value={item.size}
                              onChange={(e) => handleInventoryChange(index, 'size', e.target.value)}
                              placeholder="مثال: L"
                              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">تعداد</label>
                            <input
                              type="number"
                              min="0"
                              value={item.quantity}
                              onChange={(e) => handleInventoryChange(index, 'quantity', Number(e.target.value))}
                              placeholder="10"
                              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Description */}
              {currentStep === 4 && (
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center ml-3">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">توضیحات محصول</h2>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      توضیحات کامل محصول
                    </label>
                    <textarea 
                      name="description" 
                      value={form.description} 
                      onChange={handleChange} 
                      placeholder="توضیحات کامل محصول، ویژگیها، جنس، راهنمای نگهداری و..." 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg resize-none" 
                      rows={8} 
                    />
                  </div>
                </div>
              )}

              {/* Messages */}
              {error && (
                <div className="mx-8 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              {success && (
                <div className="mx-8 mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {success}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="bg-gray-50 px-4 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 space-y-3 sm:space-y-0">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentStep === 1 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md'
                  }`}
                >
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  قبلی
                </button>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 sm:space-x-reverse w-full sm:w-auto">
                  <Link 
                    href="/admin/products" 
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-center text-sm sm:text-base"
                  >
                    انصراف
                  </Link>
                  
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
                    >
                      بعدی
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                          در حال ذخیره...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ذخیره تغییرات
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}