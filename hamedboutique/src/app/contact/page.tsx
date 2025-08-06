"use client";
import React, { useState } from "react";
import Image from "next/image";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200 text-gray-800 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/pics/front.jpg"
            alt="حامد بوتیک"
       fill
            className="object-cover opacity-10"
            priority
          />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-8 drop-shadow-lg">تماس با ما</h1>
          <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-semibold">
            ما آماده پاسخگویی به سوالات و پیشنهادات شما هستیم. با ما در تماس باشید.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">آدرس</h3>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                تهران، خیابان ولیعصر<br />
                پلاک 123، طبقه 2
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">تلفن</h3>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                021-12345678<br />
                021-87654321
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">ایمیل</h3>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                info@hamedboutique.com<br />
                support@hamedboutique.com
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">ساعات کاری</h3>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                شنبه تا چهارشنبه<br />
                9 صبح تا 8 شب
              </p>
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-10">
              <h2 className="text-4xl font-extrabold text-gray-800 mb-8">فرم تماس</h2>
              
              {success && (
                <div className="mb-8 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl text-lg font-medium">
                  پیام شما با موفقیت ارسال شد. در اسرع وقت با شما تماس خواهیم گرفت.
                </div>
              )}

              {error && (
                <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-lg font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-3">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-lg transition-all duration-300"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-3">
                      ایمیل *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-lg transition-all duration-300"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="phone" className="block text-lg font-semibold text-gray-700 mb-3">
                      شماره تلفن
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-lg transition-all duration-300"
                      placeholder="09123456789"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-lg font-semibold text-gray-700 mb-3">
                      موضوع *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-lg transition-all duration-300"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="سوال عمومی">سوال عمومی</option>
                      <option value="مشکل در سفارش">مشکل در سفارش</option>
                      <option value="بازگشت کالا">بازگشت کالا</option>
                      <option value="پیشنهاد">پیشنهاد</option>
                      <option value="شکایت">شکایت</option>
                      <option value="سایر">سایر</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-lg font-semibold text-gray-700 mb-3">
                    پیام *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-lg transition-all duration-300"
                    placeholder="پیام خود را بنویسید..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-gray-800 py-4 px-8 rounded-xl hover:bg-gradient-to-r hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {loading ? "در حال ارسال..." : "ارسال پیام"}
                </button>
              </form>
            </div>

            {/* Map and Additional Info */}
            <div className="space-y-12">
              {/* Map */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-10">
                <h3 className="text-3xl font-extrabold text-gray-800 mb-6">موقعیت ما</h3>
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-80 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-20 h-20 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-700 text-xl font-semibold mb-2">نقشه در اینجا نمایش داده میشود</p>
                    <p className="text-gray-600 text-lg">تهران، خیابان ولیعصر، پلاک 123</p>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-10">
                <h3 className="text-3xl font-extrabold text-gray-800 mb-8">سوالات متداول</h3>
                <div className="space-y-4">
                  <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-lg font-medium p-3 rounded-lg hover:bg-gray-100">
                    چگونه میتوانم سفارش خود را پیگیری کنم؟
                  </a>
                  <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-lg font-medium p-3 rounded-lg hover:bg-gray-100">
                    شرایط بازگشت کالا چیست؟
                  </a>
                  <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-lg font-medium p-3 rounded-lg hover:bg-gray-100">
                    هزینه ارسال چقدر است؟
                  </a>
                  <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-lg font-medium p-3 rounded-lg hover:bg-gray-100">
                    آیا امکان پرداخت در محل وجود دارد؟
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">ما را در شبکه‌های اجتماعی دنبال کنید</h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
            برای اطلاع از آخرین محصولات و تخفیف‌ها، ما را در شبکه‌های اجتماعی دنبال کنید.
          </p>
          
          <div className="flex justify-center space-x-8 space-x-reverse">
            <a href="#" className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-400 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-400 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-400 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </a>
            <a href="#" className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-400 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;