"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCartItems, selectTotalPrice } from "@/store/slices/cartSlice";
import { selectUser, updateUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectTotalPrice);
  const user = useAppSelector(selectUser);
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    postalCode: user?.postalCode || ""
  });
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success' | 'warning'} | null>(null);
  const [processing, setProcessing] = useState(false);
  const [needsAddress, setNeedsAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // بررسی وجود آدرس کامل
  React.useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }
    const hasCompleteAddress = user.address && user.city && user.postalCode && user.phone;
    setNeedsAddress(!hasCompleteAddress);
  }, [user, router]);

  const shippingOptions = [
    { id: "standard", name: "ارسال عادی", price: 15000, time: "3-5 روز کاری" },
    { id: "express", name: "ارسال سریع", price: 35000, time: "1-2 روز کاری" },
    { id: "super", name: "ارسال فوری", price: 55000, time: "همان روز" }
  ];

  const selectedShipping = shippingOptions.find(option => option.id === shippingMethod);
  const finalPrice = totalPrice + (selectedShipping?.price || 0);

  const handleAddressChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!address.fullName || !address.phone || !address.address || !address.city || !address.postalCode) {
      setToast({ message: "لطفاً تمام فیلدهای آدرس را تکمیل کنید! 📍", type: "warning" });
      return false;
    }
    return true;
  };

  const saveAddressToProfile = async () => {
    setSavingAddress(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: address.fullName,
          phone: address.phone,
          address: address.address,
          city: address.city,
          postalCode: address.postalCode
        })
      });
      
      if (response.ok) {
        // بروزرسانی Redux store
        dispatch(updateUser({
          name: address.fullName,
          phone: address.phone,
          address: address.address,
          city: address.city,
          postalCode: address.postalCode
        }));
        
        setNeedsAddress(false);
        setToast({ message: "آدرس با موفقیت ذخیره شد! ✅", type: "success" });
        setTimeout(() => setStep(2), 1000);
      } else {
        throw new Error('خطا در ذخیره آدرس');
      }
    } catch (error) {
      setToast({ message: "خطا در ذخیره آدرس! ❌", type: "error" });
    } finally {
      setSavingAddress(false);
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!validateStep1()) return;
      if (needsAddress) {
        await saveAddressToProfile();
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // شبیه‌سازی اتصال به درگاه
    setTimeout(() => {
      setToast({ message: "در حال انتقال به درگاه پرداخت... 💳", type: "success" });
      setTimeout(() => {
        setProcessing(false);
        // اینجا باید به درگاه واقعی متصل شود
        alert("اتصال به درگاه بانکی...");
      }, 2000);
    }, 1500);
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Progress Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step >= stepNum 
                      ? 'bg-gradient-to-r from-gray-400 to-gray-300 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-20 h-1 mx-4 transition-all duration-300 ${
                      step > stepNum ? 'bg-gradient-to-r from-gray-400 to-gray-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-600">
              <span>آدرس تحویل</span>
              <span>روش ارسال</span>
              <span>پرداخت</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              
              {/* Step 1: Address */}
              {step === 1 && (
                <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-500 animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      📍 آدرس تحویل
                    </h2>
                    {!needsAddress && (
                      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        ✅ از پروفایل شما
                      </div>
                    )}
                  </div>
                  
                  {needsAddress && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                      <p className="text-orange-800 text-sm flex items-center gap-2">
                        📝 لطفاً اطلاعات آدرس خود را تکمیل کنید تا در پروفایل شما ذخیره شود.
                      </p>
                    </div>
                  )}
                  
                  {!needsAddress && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-blue-800 text-sm flex items-center gap-2">
                        📝 این اطلاعات از پروفایل شما آمده است. اگر نیاز به تغییر دارید، میتوانید اینجا ویرایش کنید.
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="نام و نام خانوادگی"
                      value={address.fullName}
                      onChange={(e) => handleAddressChange("fullName", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                    <input
                      type="tel"
                      placeholder="شماره تلفن"
                      value={address.phone}
                      onChange={(e) => handleAddressChange("phone", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      placeholder="شهر"
                      value={address.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      placeholder="کد پستی"
                      value={address.postalCode}
                      onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <textarea
                    placeholder="آدرس کامل"
                    value={address.address}
                    onChange={(e) => handleAddressChange("address", e.target.value)}
                    rows={3}
                    className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                  />
                  
                  <button
                    onClick={handleNextStep}
                    disabled={savingAddress}
                    className="w-full mt-6 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-gray-800 py-4 rounded-xl hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 hover:text-white transition-all font-bold text-lg shadow-lg transform hover:scale-105 disabled:opacity-50"
                  >
                    {savingAddress ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                        {needsAddress ? 'در حال ذخیره آدرس...' : 'در حال پردازش...'}
                      </div>
                    ) : (
                      needsAddress ? 'ذخیره آدرس و ادامه ➡️' : 'ادامه ➡️'
                    )}
                  </button>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-500 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    🚚 روش ارسال
                  </h2>
                  
                  <div className="space-y-4">
                    {shippingOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setShippingMethod(option.id)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          shippingMethod === option.id
                            ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-gray-800">{option.name}</h3>
                            <p className="text-gray-600 text-sm">{option.time}</p>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-800">{option.price.toLocaleString()} تومان</p>
                            <div className={`w-4 h-4 rounded-full border-2 mt-2 ${
                              shippingMethod === option.id ? 'bg-gray-400 border-gray-400' : 'border-gray-300'
                            }`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-300 transition-all font-bold"
                    >
                      ⬅️ بازگشت
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-gray-800 py-4 rounded-xl hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 hover:text-white transition-all font-bold shadow-lg transform hover:scale-105"
                    >
                      ادامه ➡️
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-500 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    💳 روش پرداخت
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div
                      onClick={() => setPaymentMethod("online")}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        paymentMethod === "online"
                          ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-gray-100'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">💳</span>
                          <div>
                            <h3 className="font-bold">پرداخت آنلاین</h3>
                            <p className="text-sm text-gray-600">پرداخت امن با کارت بانکی</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          paymentMethod === "online" ? 'bg-gray-400 border-gray-400' : 'border-gray-300'
                        }`} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-300 transition-all font-bold"
                    >
                      ⬅️ بازگشت
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={processing}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-400 text-white py-4 rounded-xl hover:from-green-600 hover:to-green-500 transition-all font-bold shadow-lg transform hover:scale-105 disabled:opacity-50"
                    >
                      {processing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          در حال پردازش...
                        </div>
                      ) : (
                        `پرداخت ${finalPrice.toLocaleString()} تومان 🔒`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">خلاصه سفارش</h3>
                
                <div className="space-y-3 mb-4">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.uniqueId} className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-12 h-12 object-contain rounded-lg bg-gray-50" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800 truncate">{item.title}</p>
                        <p className="text-xs text-gray-600">تعداد: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-sm text-gray-600 text-center">و {items.length - 3} محصول دیگر...</p>
                  )}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>قیمت محصولات:</span>
                    <span>{totalPrice.toLocaleString()} تومان</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>هزینه ارسال:</span>
                    <span>{selectedShipping?.price.toLocaleString() || 0} تومان</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>مجموع نهایی:</span>
                    <span className="text-green-600">{finalPrice.toLocaleString()} تومان</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CheckoutPage;