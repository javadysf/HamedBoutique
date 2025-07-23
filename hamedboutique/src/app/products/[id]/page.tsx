"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: { rate: number; count: number };
}

interface Comment {
  id: number;
  user: string;
  text: string;
  rate: number;
}

const initialMockComments: Comment[] = [
  { id: 1, user: "کاربر ۱", text: "محصول خیلی باکیفیت بود، ممنون!", rate: 5 },
  { id: 2, user: "کاربر ۲", text: "ارسال سریع و بسته‌بندی عالی.", rate: 4 },
  { id: 3, user: "کاربر ۳", text: "قیمت مناسب نسبت به بازار.", rate: 4 },
];

const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  return (
    <div className="flex flex-row-reverse justify-end gap-1 cursor-pointer select-none">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onKeyDown={(e) => { if (e.key === 'Enter') onChange(star); }}
          tabIndex={0}
          role="button"
          aria-label={`امتیاز ${star}`}
          className={
            star <= value
              ? "text-yellow-400 text-2xl transition-colors"
              : "text-gray-300 text-2xl transition-colors"
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
  const [comments, setComments] = useState<Comment[]>([]); // حذف initialMockComments
  const [form, setForm] = useState({ user: "", text: "", rate: 5 });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useAppDispatch();

  // دریافت نظرات از API
  useEffect(() => {
    if (!id) return;
    fetch(`/api/comments?productId=${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data || []));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("محصول پیدا نشد");
        return res.json();
      })
      .then((data: Product) => {
        setProduct(data);
        setError("");
        fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(data.category)}`)
          .then((res) => res.json())
          .then((relatedData: Product[]) => {
            setRelated(relatedData.filter((p) => p.id !== data.id).slice(0, 4));
          });
      })
      .catch(() => setError("محصول مورد نظر پیدا نشد!"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
    setFormSuccess("");
  };

  const handleStarChange = (rate: number) => {
    setForm({ ...form, rate });
    setFormError("");
    setFormSuccess("");
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
      // دریافت مجدد نظرات
      const commentsRes = await fetch(`/api/comments?productId=${id}`);
      setComments(await commentsRes.json());
    } catch {
      setFormError("خطا در ثبت نظر. لطفاً دوباره تلاش کنید.");
      setFormSuccess("");
    }
  };

  if (loading) return <main className="p-8 text-center">در حال بارگذاری...</main>;
  if (error) return <main className="p-8 text-center text-red-600">{error}</main>;
  if (!product) return null;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-2xl shadow-lg p-6">
        <img
          src={product.image}
          alt={product.title}
          className="w-60 h-60 object-contain rounded-xl bg-gray-50 border"
        />
        <div className="flex-1 text-right">
          <h1 className="text-2xl font-bold mb-4 text-primary">{product.title}</h1>
          <p className="text-primary font-bold text-xl mb-2">{product.price.toLocaleString()} تومان</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400 text-lg">★</span>
            <span>{product.rating.rate} / 5</span>
            <span className="text-gray-500 text-sm">({product.rating.count} رای)</span>
          </div>
          <p className="mb-6 text-gray-700 leading-7">{product.description}</p>
          <button 
            onClick={handleAddToCart}
            className={`font-bold py-3 px-8 rounded-lg shadow transition-colors text-lg ${
              addedToCart 
                ? 'bg-green-600 text-white' 
                : 'bg-primary hover:bg-navy-700 text-white'
            }`}
          >
            {addedToCart ? '✓ افزوده شد' : 'افزودن به سبد خرید'}
          </button>
        </div>
      </div>

      {/* بخش نظرات */}
      <section className="mt-12 bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-primary">نظرات کاربران</h2>
        <div className="space-y-4 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="border-b pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-primary">{c.user}</span>
                <span className="text-yellow-400">{'★'.repeat(c.rate)}</span>
              </div>
              <p className="text-gray-700">{c.text}</p>
            </div>
          ))}
        </div>
        {/* فرم ثبت نظر */}
        <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              name="user"
              value={form.user}
              onChange={handleCommentChange}
              placeholder="نام شما"
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <StarRating value={form.rate} onChange={handleStarChange} />
          </div>
          <textarea
            name="text"
            value={form.text}
            onChange={handleCommentChange}
            placeholder="متن نظر شما"
            rows={3}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formError && <div className="text-red-600 text-sm">{formError}</div>}
          {formSuccess && <div className="text-green-600 text-sm">{formSuccess}</div>}
          <button type="submit" className="bg-primary hover:bg-navy-700 text-white font-bold py-2 px-8 rounded-lg shadow transition-colors">ثبت نظر</button>
        </form>
      </section>

      {/* محصولات مشابه */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4 text-primary">محصولات مشابه</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
        </section>
      )}
    </main>
  );
};

export default ProductDetailPage; 