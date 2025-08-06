"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser, selectUserLoading, selectToken, updateUser } from "@/store/slices/userSlice";
import { Loading } from "@/components/common";
import PersianDatePicker from "@/components/PersianDatePicker";
import { formatPersianDate } from "@/utils/dateUtils";

interface UserProfile {
  id: number;
  username: string;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  profileImage?: string;
  birthDate?: string;
  gender?: string;
  isAdmin?: number;
}

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserLoading);
  const token = useAppSelector(selectToken); // 获取token
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    birthDate: "",
    gender: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
      return;
    }

    if (user) {
      setProfile(user);
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
        birthDate: user.birthDate || "",
        gender: user.gender || "",
      });
    }
  }, [user, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      // استفاده از توکن که از قبل در سطح بالای کامپوننت دریافت شده
      if (!token) {
        setMessage("توکن احراز هویت یافت نشد. لطفاً دوباره وارد شوید.");
        setSaving(false);
        return;
      }
      
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("اطلاعات با موفقیت بروزرسانی شد");
        if (profile) {
          setProfile({ ...profile, ...formData });
        }
        dispatch(updateUser(formData));
        setIsEditing(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "خطا در بروزرسانی اطلاعات");
      }
    } catch (error) {
      setMessage("خطا در بروزرسانی اطلاعات");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      // استفاده از توکن که از قبل در سطح بالای کامپوننت دریافت شده
      if (!token) {
        setMessage("توکن احراز هویت یافت نشد. لطفاً دوباره وارد شوید.");
        return;
      }
      
      const response = await fetch("/api/profile/upload-image", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (profile) {
          setProfile({ ...profile, profileImage: data.imageUrl });
        }
        dispatch(updateUser({ profileImage: data.imageUrl }));
        setMessage("عکس پروفایل با موفقیت آپلود شد");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "خطا در آپلود عکس");
      }
    } catch (error) {
      setMessage("خطا در آپلود عکس");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="large" text="در حال بارگذاری..." />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-700 mb-2">پروفایل من</h1>
            <p className="text-gray-400">مدیریت اطلاعات شخصی و حساب کاربری</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              message.includes("موفقیت") 
                ? "bg-green-50 border border-green-200 text-green-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Image Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">عکس پروفایل</h2>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-700">
                      {profile?.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt="عکس پروفایل"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                          👤
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <label className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium">
                    تغییر عکس
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Profile Information Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-700">اطلاعات شخصی</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                  >
                    {isEditing ? "انصراف" : "ویرایش"}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          نام و نام خانوادگی
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          شماره تلفن
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          تاریخ تولد
                        </label>
                        <PersianDatePicker
                          value={formData.birthDate}
                          onChange={(date) => setFormData({ ...formData, birthDate: date })}
                          placeholder="تاریخ تولد خود را انتخاب کنید"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          جنسیت
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="male">مرد</option>
                          <option value="female">زن</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        آدرس کامل
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          شهر
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          کد پستی
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        انصراف
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">نام و نام خانوادگی</label>
                        <p className="text-gray-700 font-medium">{profile?.name || "تنظیم نشده"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">نام کاربری</label>
                        <p className="text-gray-700 font-medium">{profile?.username || "تنظیم نشده"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">ایمیل</label>
                        <p className="text-gray-700 font-medium">{profile?.email || "تنظیم نشده"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">شماره تلفن</label>
                        <p className="text-gray-700 font-medium">{profile?.phone || "تنظیم نشده"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">تاریخ تولد</label>
                        <p className="text-gray-700 font-medium">{formatPersianDate(profile?.birthDate || '')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">جنسیت</label>
                        <p className="text-gray-700 font-medium">
                          {profile?.gender === "male" ? "مرد" : profile?.gender === "female" ? "زن" : "تنظیم نشده"}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">آدرس کامل</label>
                      <p className="text-gray-700 font-medium">{profile?.address || "تنظیم نشده"}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">شهر</label>
                        <p className="text-gray-700 font-medium">{profile?.city || "تنظیم نشده"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">کد پستی</label>
                        <p className="text-gray-700 font-medium">{profile?.postalCode || "تنظیم نشده"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 