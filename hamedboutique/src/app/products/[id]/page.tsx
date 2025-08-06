"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import ProductCard from "@/components/ProductCard";
import Toast from "@/components/Toast";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  images?: string[] | string;
  description: string;
  category: string;
  discount?: number;
  rating?: { rate: number; count: number };
  colors?: string[] | string;
  sizes?: string[] | string;
}

interface Comment {
  id: number;
  user: string;
  text: string;
  rate: number;
}

const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  return (
    <div className="flex flex-row-reverse justify-end gap-1 cursor-pointer select-none">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          className={
            star <= value
              ? "text-yellow-400 text-2xl transition-colors hover:text-yellow-500"
              : "text-gray-300 text-2xl transition-colors hover:text-yellow-400"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [related, setRelated] = useState<Product[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState({ user: "", text: "", rate: 5 });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success' | 'warning'} | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/comments?productId=${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data || []));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("محصول پیدا نشد");
        return res.json();
      })
      .then((data: Product) => {
        // پردازش تصاویر، رنگ‌ها و سایزها
        if (data.images && typeof data.images === 'string') {
          try {
            data.images = JSON.parse(data.images);
          } catch {
            data.images = [];
          }
        }
        if (data.colors && typeof data.colors === 'string') {
          try {
            data.colors = JSON.parse(data.colors);
          } catch {
            data.colors = [];
          }
        }
        if (data.sizes && typeof data.sizes === 'string') {
          try {
            data.sizes = JSON.parse(data.sizes);
          } catch {
            data.sizes = [];
          }
        }
        
        setProduct(data);
        setError("");
        
        if (data.category) {
          fetch(`/api/products?category=${encodeURIComponent(data.category)}`)
            .then((res) => res.json())
            .then((relatedData: Product[]) => {
              setRelated(relatedData.filter((p) => p.id !== data.id).slice(0, 4));
            })
            .catch(() => setRelated([]));
        }
      })
      .catch(() => setError("محصول مورد نظر پیدا نشد!"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const hasColors = product.colors && Array.isArray(product.colors) && product.colors.length > 0;
    const hasSizes = product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0;
    
    if (hasColors && !selectedColor) {
      setToast({ message: 'لطفاً رنگ مورد نظر خود را انتخاب کنید! 🎨', type: 'warning' });
      return;
    }
    
    if (hasSizes && !selectedSize) {
      setToast({ message: 'لطفاً سایز مورد نظر خود را انتخاب کنید! 📎', type: 'warning' });
      return;
    }
    
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      color: selectedColor,
      size: selectedSize
    };
    
    dispatch(addToCart(cartItem));
    setAddedToCart(true);
    setToast({ message: 'محصول با موفقیت به سبد خرید اضافه شد! 🛍️', type: 'success' });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user.trim() || !form.text.trim()) {
      setFormError("لطفاً نام و متن نظر را وارد کنید.");
      return;
    }
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          user: form.user,
          text: form.text,
          rate: form.rate,
        }),
      });
      if (!res.ok) throw new Error("خطا در ثبت نظر");
      setForm({ user: "", text: "", rate: 5 });
      setFormSuccess("نظر شما با موفقیت ثبت شد!");
      setFormError("");
      const commentsRes = await fetch(`/api/comments?productId=${id}`);
      setComments(await commentsRes.json());
    } catch {
      setFormError("خطا در ثبت نظر. لطفاً دوباره تلاش کنید.");
      setFormSuccess("");
    }
  };

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    </main>
  );
  
  if (error) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center text-red-600">
        <p className="text-xl mb-4">{error}</p>
        <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">
          بازگشت
        </button>
      </div>
    </main>
  );
  
  if (!product) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="p-6">
              <div className="relative mb-4 bg-gray-50 rounded-2xl overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.title}
                  className="main-product-image w-full h-96 object-contain transition-transform duration-300 group-hover:scale-105"
                />
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.discount}% تخفیف
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {product.images && Array.isArray(product.images) && product.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  <div 
                    className="aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer border-2 border-blue-500 transition-all hover:border-blue-600"
                    onClick={() => {
                      const mainImg = document.querySelector('.main-product-image') as HTMLImageElement;
                      if (mainImg) mainImg.src = product.image;
                    }}
                  >
                    <img src={product.image} alt="اصلی" className="w-full h-full object-contain" />
                  </div>
                  {product.images.filter(img => img && img.trim() !== '').map((img: string, index: number) => (
                    <div 
                      key={index}
                      className="aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
                      onClick={() => {
                        const mainImg = document.querySelector('.main-product-image') as HTMLImageElement;
                        if (mainImg) mainImg.src = img;
                      }}
                    >
                      <img 
                        src={img} 
                        alt={`${product.title} - ${index + 1}`} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.parentElement!.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 lg:p-8">
              <div className="space-y-6">
                {/* Title & Category */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600 bg-gradient-to-r from-gray-200 to-gray-100 px-2 py-1 rounded-full">{product.category}</span>
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">{product.rating.rate} ({product.rating.count})</span>
                      </div>
                    )}
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{product.title}</h1>
                </div>

                {/* Price */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">قیمت</p>
                      <p className="text-3xl font-bold text-gray-900">{product.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">تومان</p>
                    </div>
                    {product.discount && product.discount > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500 line-through">
                          {Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                        </p>
                        <p className="text-green-600 font-semibold">
                          {Math.round(product.price * product.discount / 100).toLocaleString()} تومان صرفه‌جویی
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Colors */}
                {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">رنگ:</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            selectedColor === color 
                              ? 'bg-gradient-to-r from-gray-400 to-gray-300 text-white border-gray-400' 
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">سایز:</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                            selectedSize === size 
                              ? 'bg-gradient-to-r from-gray-400 to-gray-300 text-white border-gray-400' 
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">توضیحات محصول</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 ${
                      addedToCart 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
                    }`}
                  >
                    {addedToCart ? '✓ افزوده شد به سبد خرید' : 'افزودن به سبد خرید'}
                  </button>
                  <button className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium">
                    ♡ افزودن به علاقه‌مندی‌ها
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    ضمانت اصل بودن
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    ارسال رایگان
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    پرداخت امن
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    7 روز ضمانت برگشت
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">نظرات کاربران</h2>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8 p-4 bg-gray-50 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="user"
                value={form.user}
                onChange={(e) => setForm({ ...form, user: e.target.value })}
                placeholder="نام شما"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">امتیاز:</span>
                <StarRating value={form.rate} onChange={(rate) => setForm({ ...form, rate })} />
              </div>
            </div>
            <textarea
              name="text"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="متن نظر شما"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            {formError && <div className="text-red-600 text-sm mb-4">{formError}</div>}
            {formSuccess && <div className="text-green-600 text-sm mb-4">{formSuccess}</div>}
            <button type="submit" className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-gray-800 hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all">
              ثبت نظر
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">{comment.user}</span>
                  <span className="text-yellow-400">{'★'.repeat(comment.rate)}</span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">محصولات مشابه</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  id={String(p.id)}
                  name={p.title}
                  price={p.price}
                  image={p.image}
                  category={p.category}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
};

export default ProductDetailPage;