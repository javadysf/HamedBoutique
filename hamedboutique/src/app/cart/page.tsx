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
    
    setCheckingOut(true);
    // Here you would typically redirect to a checkout page or payment gateway
    setTimeout(() => {
      alert("در حال انتقال به درگاه پرداخت...");
      setCheckingOut(false);
    }, 1000);
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    dispatch(updateQuantity({ id: productId, quantity }));
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
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
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

                <div className="space-y-3 sm:space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg mx-auto sm:mx-0"
                      />
                      
                      <div className="flex-1 w-full sm:w-auto text-center sm:text-right">
                        <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base line-clamp-1">{item.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">{item.category}</p>
                        <p className="font-bold text-gray-800 text-sm sm:text-base">
                          {item.price.toLocaleString()} تومان
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mx-auto sm:mx-0">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 sm:w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-center sm:text-right w-full sm:w-auto">
                        <p className="font-bold text-gray-800 text-sm sm:text-base">
                          {(item.price * item.quantity).toLocaleString()} تومان
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 text-xs sm:text-sm mt-1"
                        >
                          حذف
                        </button>
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
                  className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
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