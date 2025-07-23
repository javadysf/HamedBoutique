"use client"
import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin?: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  // تغییر نقش کاربر
  const handleToggleAdmin = async (id: number, isAdmin: number) => {
    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isAdmin: isAdmin ? 0 : 1 }),
    });
    setUsers(users.map(u => u.id === id ? { ...u, isAdmin: isAdmin ? 0 : 1 } : u));
  };

  // حذف کاربر
  const handleDelete = async (id: number) => {
    if (!window.confirm('آیا از حذف این کاربر مطمئن هستید؟')) return;
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-primary mb-6">مدیریت کاربران</h1>
      {loading ? (
        <div>در حال بارگذاری...</div>
      ) : users.length === 0 ? (
        <div>کاربری یافت نشد.</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">نام کاربری</th>
              <th className="p-3">ایمیل</th>
              <th className="p-3">نقش</th>
              <th className="p-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.isAdmin ? 'ادمین' : 'عادی'}</td>
                <td className="p-3 flex gap-2">
                  <button className="text-blue-600 hover:underline" onClick={() => handleToggleAdmin(u.id, u.isAdmin || 0)}>
                    {u.isAdmin ? 'تبدیل به عادی' : 'تبدیل به ادمین'}
                  </button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(u.id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 