"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/userSlice";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Image from "next/image";
import registerPic from "../../../public/assets/pics/register.jpg"
import logo from "../../../public/assets/pics/logo.png"

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
    <div className="min-h-screen bg-gray-400 text-black flex items-center justify-center py-2 px-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Image */}
            <div className="lg:w-1/2 bg-gradient-to-l from-gray-400 via-gray-100 to-white text-black  flex flex-col justify-center items-center relative">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10 text-center">
                {/* Logo */}
                <div className="mb-8">
                  <Image 
                   width={128}
                   height={128}
                    src={logo} 
                    alt="حامد بوتیک" 
                    className=" mx-auto mb-4 rounded-full bg-gray-50 p-2 shadow-lg"
                  />
                  <h1 className="text-3xl font-bold  mb-2">حامد بوتیک</h1>
                  <p className=" text-lg">فروشگاه آنلاین پوشاک</p>
                </div>
                
  
                
                {/* Welcome Text */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">
                    {isLogin ? 'خوش آمدید' : 'عضویت در خانواده ما'}
                  </h2>
                  <p >
                    {isLogin 
                      ? 'برای ادامه، وارد حساب کاربری خود شوید' 
                      : 'برای دسترسی به تمام امکانات، ثبت نام کنید'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Side - Form */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
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
        </div>
      </div>
    </div>
  );
};

export default AuthContainer; 