"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  discount?: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  // حذف محصول
  const handleDelete = async (id: number) => {
    if (!window.confirm('آیا از حذف این محصول مطمئن هستید؟')) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-primary">مدیریت محصولات</h1>
        <Link href="/admin/products/new" className="bg-primary text-white px-4 py-2 rounded-lg font-bold">افزودن محصول جدید</Link>
      </div>
      {loading ? (
        <div>در حال بارگذاری...</div>
      ) : products.length === 0 ? (
        <div>محصولی یافت نشد.</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">عنوان</th>
              <th className="p-3">قیمت</th>
              <th className="p-3">تخفیف</th>
              <th className="p-3">دسته‌بندی</th>
              <th className="p-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.price.toLocaleString()} تومان</td>
                <td className="p-3">{p.discount ? `${p.discount}%` : '-'}</td>
                <td className="p-3">{p.category || '-'}</td>
                <td className="p-3 flex gap-2">
                  <Link href={`/admin/products/edit/${p.id}`} className="text-blue-600 hover:underline">ویرایش</Link>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(p.id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 