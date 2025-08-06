"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCartItems, selectTotalPrice, removeFromCart, updateQuantity, clearCart } from "@/store/slices/cartSlice";
import { selectUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/common";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectTotalPrice);
  const user = useAppSelector(selectUser);
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    
    router.push("/checkout");
  };

  const handleRemoveItem = (uniqueId: string) => {
    dispatch(removeFromCart(uniqueId));
  };

  const handleUpdateQuantity = (uniqueId: string, quantity: number) => {
    dispatch(updateQuantity({ id: uniqueId, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🛒</div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">سبد خرید شما خالی است</h1>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">محصولات مورد نظر خود را به سبد خرید اضافه کنید</p>
              <button
                onClick={() => router.push("/products")}
                className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 hover:text-white transition-all font-medium text-sm sm:text-base"
              >
                مشاهده محصولات
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md sm:shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">سبد خرید</h1>
            <p className="text-gray-600 text-sm sm:text-base">مدیریت محصولات انتخابی شما</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md sm:shadow-lg p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">محصولات ({items.length})</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium"
                  >
                    پاک کردن سبد خرید
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.uniqueId}
                      className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 object-contain rounded-lg bg-white shadow-sm"
                          />
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-400 to-gray-300 text-white text-xs px-2 py-1 rounded-full font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-2 text-lg leading-tight">{item.title}</h3>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                            {item.color && item.color !== 'پیشفرض' ? (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                رنگ: {item.color}
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                رنگ انتخاب نشده
                              </span>
                            )}
                            {item.size && item.size !== 'پیشفرض' ? (
                              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                سایز: {item.size}
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                سایز انتخاب نشده
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center bg-gray-100 rounded-lg">
                                <button
                                  onClick={() => handleUpdateQuantity(item.uniqueId!, item.quantity - 1)}
                                  className="w-8 h-8 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-l-lg transition-colors flex items-center justify-center"
                                >
                                  −
                                </button>
                                <span className="w-12 text-center font-bold text-gray-800">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.uniqueId!, item.quantity + 1)}
                                  className="w-8 h-8 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-r-lg transition-colors flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                              
                              <button
                                onClick={() => handleRemoveItem(item.uniqueId!)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                                title="حذف از سبد خرید"
                              >
                                🗑️
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-sm text-gray-600">قیمت واحد: {item.price.toLocaleString()} تومان</p>
                              <p className="text-lg font-bold text-gray-800">
                                {(item.price * item.quantity).toLocaleString()} تومان
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md sm:shadow-lg p-4 sm:p-6 sticky top-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">خلاصه سفارش</h2>
                
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">تعداد محصولات:</span>
                    <span className="font-medium text-sm sm:text-base">{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">تعداد کل:</span>
                    <span className="font-medium text-sm sm:text-base">
                      {items.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-base sm:text-lg font-semibold text-gray-800">مجموع:</span>
                      <span className="text-base sm:text-lg font-bold text-blue-600">
                        {totalPrice.toLocaleString()} تومان
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-gray-800 py-2 sm:py-3 px-4 rounded-lg hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                >
                  {checkingOut ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loading size="small" />
                      در حال پردازش...
                    </div>
                  ) : (
                    "ادامه خرید"
                  )}
                </button>

                {!user && (
                  <p className="text-xs sm:text-sm text-gray-600 text-center mt-3">
                    برای ادامه خرید باید وارد حساب کاربری خود شوید
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 