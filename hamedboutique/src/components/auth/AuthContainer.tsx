"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/userSlice";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthContainer: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLoginSuccess = (token: string, user: any) => {
    // ذخیره توکن در Redux
    dispatch(login({ token, user }));
    
    // برای اطمینان، توکن را در localStorage هم ذخیره می‌کنیم
    localStorage.setItem("token", token);
    
    router.push("/");
  };

  const handleRegisterSuccess = (userId: number) => {
    setSuccessMessage("ثبت‌نام با موفقیت انجام شد! حالا می‌توانید وارد شوید.");
    setIsLogin(true);
    // پاک کردن پیام موفقیت بعد از 3 ثانیه
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setSuccessMessage("");
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
            {successMessage}
          </div>
        )}
        
        {isLogin ? (
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={switchToRegister}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={switchToLogin}
          />
        )}
      </div>
    </div>
  );
};

export default AuthContainer; 