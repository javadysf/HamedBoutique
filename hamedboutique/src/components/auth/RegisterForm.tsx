"use client";
import React, { useState } from "react";
import PersianDatePicker from "@/components/PersianDatePicker";

interface RegisterFormProps {
  onSuccess: (userId: number) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // اعتبارسنجی پسورد
    if (formData.password !== formData.confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          birthDate: formData.birthDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در ثبت‌نام");
      }

      // فراخوانی callback موفقیت
      onSuccess(data.userId);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "خطا در ثبت‌نام");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">ثبت‌نام</h2>
        <p className="text-gray-600 mb-4 ">حساب کاربری جدید ایجاد کنید</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="نام کاربری خود را وارد کنید"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="example@email.com"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="حداقل ۶ کاراکتر"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="رمز عبور را تکرار کنید"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاریخ تولد
          </label>
          <PersianDatePicker
            value={formData.birthDate}
            onChange={(date) => setFormData({ ...formData, birthDate: date })}
            placeholder="تاریخ تولد خود را انتخاب کنید"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
              در حال ثبت‌نام...
            </div>
          ) : (
            "ثبت‌نام"
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-gray-600 hover:text-gray-800 font-medium hover:underline transition-colors"
          >
            وارد شوید
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm; 