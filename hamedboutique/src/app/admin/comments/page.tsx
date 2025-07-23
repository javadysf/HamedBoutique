"use client"
import React, { useEffect, useState } from 'react';

interface Comment {
  id: number;
  productId: number;
  user: string;
  text: string;
  rate: number;
  created_at: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/comments')
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setLoading(false);
      });
  }, []);

  // حذف نظر
  const handleDelete = async (id: number) => {
    if (!window.confirm('آیا از حذف این نظر مطمئن هستید؟')) return;
    const res = await fetch(`/api/admin/comments?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setComments(comments.filter((c) => c.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-primary mb-6">مدیریت نظرات کاربران</h1>
      {loading ? (
        <div>در حال بارگذاری...</div>
      ) : comments.length === 0 ? (
        <div>نظری ثبت نشده است.</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">محصول</th>
              <th className="p-3">کاربر</th>
              <th className="p-3">امتیاز</th>
              <th className="p-3">متن نظر</th>
              <th className="p-3">تاریخ</th>
              <th className="p-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-3">{c.productId}</td>
                <td className="p-3">{c.user}</td>
                <td className="p-3">{'★'.repeat(c.rate)}</td>
                <td className="p-3">{c.text}</td>
                <td className="p-3">{new Date(c.created_at).toLocaleString('fa-IR')}</td>
                <td className="p-3">
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(c.id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 