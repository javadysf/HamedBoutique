import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({ title: '', price: '', image: '', description: '', category: '', discount: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/products?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          title: data.title || '',
          price: data.price || '',
          image: data.image || '',
          description: data.description || '',
          category: data.category || '',
          discount: data.discount || '',
        });
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price.toString().trim()) {
      setError('عنوان و قیمت الزامی است');
      return;
    }
    const res = await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        title: form.title,
        price: Number(form.price),
        image: form.image,
        description: form.description,
        category: form.category,
        discount: form.discount ? Number(form.discount) : 0,
      }),
    });
    if (res.ok) {
      setSuccess('محصول با موفقیت ویرایش شد!');
      setTimeout(() => router.push('/admin/products'), 1000);
    } else {
      setError('خطا در ویرایش محصول');
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 className="text-xl font-bold mb-6 text-primary">ویرایش محصول</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="عنوان محصول" className="w-full border rounded-lg px-4 py-2" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="قیمت (تومان)" type="number" className="w-full border rounded-lg px-4 py-2" />
        <input name="discount" value={form.discount} onChange={handleChange} placeholder="درصد تخفیف (اختیاری)" type="number" className="w-full border rounded-lg px-4 py-2" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="دسته‌بندی (اختیاری)" className="w-full border rounded-lg px-4 py-2" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="آدرس عکس (اختیاری)" className="w-full border rounded-lg px-4 py-2" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="توضیحات (اختیاری)" className="w-full border rounded-lg px-4 py-2" rows={3} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button type="submit" className="bg-primary text-white font-bold py-2 px-8 rounded-lg shadow">ذخیره تغییرات</button>
      </form>
    </div>
  );
} 