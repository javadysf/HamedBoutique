"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectUserLoading } from '@/store/slices/userSlice';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserLoading);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || !('isAdmin' in user) || !user.isAdmin) {
        router.replace('/auth');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.isAdmin) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-black bg-white">در حال بررسی دسترسی...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-700 text-white px-8 py-4 flex gap-8 items-center">
        <Link href="/admin" className="font-bold text-xl">پنل مدیریت</Link>
        <Link href="/admin/products" className="hover:underline">مدیریت محصولات</Link>
        <Link href="/admin/comments" className="hover:underline">مدیریت نظرات</Link>
        <Link href="/admin/users" className="hover:underline">مدیریت کاربران</Link>
        {/* در صورت نیاز لینک‌های بیشتر اضافه کنید */}
      </nav>
      <main className="max-w-5xl mx-auto p-8">
        {children}
      </main>
    </div>
  );
} 