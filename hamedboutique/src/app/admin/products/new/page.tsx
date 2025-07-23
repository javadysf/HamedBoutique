"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const [form, setForm] = useState({ title: '', price: '', image: '', description: '', category: '', discount: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price.trim()) {
      setError('عنوان و قیمت الزامی است');
      return;
    }
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        price: Number(form.price),
        image: form.image,
        description: form.description,
        category: form.category,
        discount: form.discount ? Number(form.discount) : 0,
      }),
    });
    if (res.ok) {
      setSuccess('محصول با موفقیت افزوده شد!');
      setForm({ title: '', price: '', image: '', description: '', category: '', discount: '' });
      setTimeout(() => router.push('/admin/products'), 1000);
    } else {
      setError('خطا در افزودن محصول');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 className="text-xl font-bold mb-6 text-primary">افزودن محصول جدید</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="عنوان محصول" className="w-full border rounded-lg px-4 py-2" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="قیمت (تومان)" type="number" className="w-full border rounded-lg px-4 py-2" required />
        <input name="discount" value={form.discount} onChange={handleChange} placeholder="درصد تخفیف (مثلاً 10)" type="number" className="w-full border rounded-lg px-4 py-2" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="دسته‌بندی (مثلاً پوشاک)" className="w-full border rounded-lg px-4 py-2" required />
        <input name="image" value={form.image} onChange={handleChange} placeholder="آدرس عکس (مثلاً /images/1.jpg یا لینک)" className="w-full border rounded-lg px-4 py-2" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="توضیحات (اختیاری)" className="w-full border rounded-lg px-4 py-2" rows={3} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button type="submit" className="bg-primary text-white font-bold py-2 px-8 rounded-lg shadow">افزودن محصول</button>
      </form>
    </div>
  );
} 