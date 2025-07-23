"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectUser, selectUserLoading } from "@/store/slices/userSlice";
import { AuthContainer } from "@/components/auth";
import { Loading } from "@/components/common";

const AuthPage = () => {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const userLoading = useAppSelector(selectUserLoading);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // اگر کاربر قبلاً وارد شده، به پنل ادمین یا صفحه اصلی هدایت کن
    if (user && !userLoading) {
      if ('isAdmin' in user && user.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [user, userLoading, router]);

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="large" text="در حال بررسی وضعیت ورود..." />
      </div>
    );
  }

  return <AuthContainer />;
};

export default AuthPage; 