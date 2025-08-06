"use client";
import React, { useState } from "react";
import { Loading } from "@/components/common";

interface LoginFormProps {
  onSuccess: (token: string, user: any) => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در ورود");
      }

      // فراخوانی callback موفقیت
      onSuccess(data.token, data.user);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "خطا در ورود");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">ورود</h2>
        <p className="text-gray-600">به حساب کاربری خود وارد شوید</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            ایمیل
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            رمز عبور
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="رمز عبور خود را وارد کنید"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
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
              در حال ورود...
            </div>
          ) : (
            "ورود"
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          حساب کاربری ندارید؟{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-gray-600 hover:text-gray-800 font-medium hover:underline transition-colors"
          >
            ثبت‌نام کنید
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 