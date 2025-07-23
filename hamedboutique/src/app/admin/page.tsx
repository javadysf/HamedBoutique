import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary">داشبورد مدیریت</h1>
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
          <span className="font-bold">مدیریت محصولات</span>
          <Link href="/admin/products" className="text-blue-600 hover:underline">مشاهده و مدیریت محصولات</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
          <span className="font-bold">مدیریت نظرات کاربران</span>
          <Link href="/admin/comments" className="text-blue-600 hover:underline">مشاهده و مدیریت نظرات</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
          <span className="font-bold">مدیریت کاربران</span>
          <Link href="/admin/users" className="text-blue-600 hover:underline">مشاهده و مدیریت کاربران</Link>
        </div>
      </div>
    </div>
  );
} 