"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalComments: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalComments: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, usersRes, commentsRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/users'),
          fetch('/api/admin/comments')
        ]);

        const [products, users, comments] = await Promise.all([
          productsRes.json(),
          usersRes.json(),
          commentsRes.json()
        ]);

        const recentActivity = [];
        
        if (users && users.length > 0) {
          const latestUser = users[users.length - 1];
          recentActivity.push({
            type: 'user',
            message: `کاربر ${latestUser.username} ثبتنام کرد`,
            time: new Date(latestUser.created_at).toLocaleDateString('fa-IR')
          });
        }

        if (comments && comments.length > 0) {
          const latestComment = comments[comments.length - 1];
          recentActivity.push({
            type: 'comment',
            message: `نظر جدید از ${latestComment.user_name}`,
            time: new Date(latestComment.created_at).toLocaleDateString('fa-IR')
          });
        }

        if (products && products.length > 0) {
          const latestProduct = products[products.length - 1];
          recentActivity.push({
            type: 'product',
            message: `محصول ${latestProduct.title} اضافه شد`,
            time: new Date(latestProduct.created_at).toLocaleDateString('fa-IR')
          });
        }

        setStats({
          totalProducts: products?.length || 0,
          totalUsers: users?.length || 0,
          totalComments: comments?.length || 0,
          recentActivity: recentActivity.slice(0, 5)
        });
      } catch (error) {
        console.error('خطا در دریافت دادههای داشبورد:', error);
        setStats({
          totalProducts: 0,
          totalUsers: 0,
          totalComments: 0,
          recentActivity: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'کل محصولات',
      value: stats.totalProducts,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'bg-blue-500',
      link: '/admin/products'
    },
    {
      title: 'کل کاربران',
      value: stats.totalUsers,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'bg-green-500',
      link: '/admin/users'
    },
    {
      title: 'کل نظرات',
      value: stats.totalComments,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'bg-purple-500',
      link: '/admin/comments'
    }
  ];

  const quickActions = [
    {
      title: 'افزودن محصول جدید',
      description: 'محصول جدید به فروشگاه اضافه کنید',
      link: '/admin/products/new',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      color: 'bg-blue-600'
    },
    {
      title: 'مدیریت نظرات',
      description: 'بررسی و تأیید نظرات جدید',
      link: '/admin/comments',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-600'
    },
    {
      title: 'مدیریت کاربران',
      description: 'مشاهده و مدیریت کاربران',
      link: '/admin/users',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">داشبورد مدیریت</h1>
          <p className="text-gray-600 mt-1">مروری بر وضعیت کلی فروشگاه</p>
        </div>
        <div className="text-sm text-gray-500">
          آخرین بهروزرسانی: {new Date().toLocaleDateString('fa-IR')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <Link key={index} href={card.link}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} text-white p-3 rounded-lg`}>
                  {card.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">عملیات سریع</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.link}>
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className={`${action.color} text-white p-2 rounded-lg ml-3`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">فعالیتهای اخیر</h2>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className={`w-2 h-2 rounded-full mt-2 ml-3 ${
                    activity.type === 'user' ? 'bg-green-500' :
                    activity.type === 'comment' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">هیچ فعالیت اخیری وجود ندارد</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}