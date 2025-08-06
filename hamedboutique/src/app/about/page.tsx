"use client";
import Image from "next/image";
import React from "react";
import logo from "../../../public/assets/pics/logo.png"

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200 text-gray-800 py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center text-5xl md:text-7xl font-extrabold mb-8 drop-shadow-lg"> 
            <Image alt="logo" src={logo} width={175} height={175} />
             بوتیک</div>
          <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-semibold">
            ارائه بهترین محصولات پوشاک با کیفیت بالا و قیمت مناسب. ما متعهد به رضایت مشتریان خود هستیم.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-extrabold text-gray-800 mb-8">داستان ما</h2>
              <div className="space-y-6 text-gray-700 leading-relaxed text-xl">
                <p className="font-medium">
                  حامد بوتیک در سال ۱۳۹۵ با هدف ارائه محصولات با کیفیت و قیمت مناسب تأسیس شد. 
                  ما از همان ابتدا متعهد بودیم که بهترین تجربه خرید را برای مشتریان خود فراهم کنیم.
                </p>
                <p className="font-medium">
                  با گذشت سالها، ما توانستهایم به یکی از معتبرترین فروشگاههای پوشاک در ایران تبدیل شویم 
                  و هزاران مشتری راضی داشته باشیم.
                </p>
                <p className="font-medium">
                  امروز، حامد بوتیک با تیمی متخصص و تجهیزات مدرن، آماده ارائه خدمات بهتر به مشتریان عزیز است.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-10 transform hover:scale-105 transition-all duration-300">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-gray-800 mb-3">۸+</div>
                    <div className="text-gray-600 text-lg font-semibold">سال تجربه</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-gray-800 mb-3">۱۰۰۰+</div>
                    <div className="text-gray-600 text-lg font-semibold">مشتری راضی</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-gray-800 mb-3">۵۰۰+</div>
                    <div className="text-gray-600 text-lg font-semibold">محصول متنوع</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-gray-800 mb-3">۲۴/۷</div>
                    <div className="text-gray-600 text-lg font-semibold">پشتیبانی</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-800 mb-6">ارزشهای ما</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
              ما بر اساس این ارزشها فعالیت میکنیم و متعهد به رعایت آنها در تمام جنبههای کاری خود هستیم.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">کیفیت بالا</h3>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                ارائه محصولات با بالاترین کیفیت و استفاده از بهترین مواد اولیه
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">رضایت مشتری</h3>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                اولویت اول ما رضایت کامل مشتریان و ارائه خدمات عالی است
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">قیمت مناسب</h3>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                ارائه محصولات با قیمتهای منصفانه و رقابتی
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">سرعت و دقت</h3>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                ارسال سریع و دقیق محصولات به سراسر کشور
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200 text-gray-800 p-10 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <h3 className="text-4xl font-extrabold mb-6">ماموریت ما</h3>
              <p className="text-gray-700 leading-relaxed text-xl font-medium">
                ارائه محصولات با کیفیت بالا و قیمت مناسب به مشتریان، با هدف افزایش رضایت و اعتماد آنها. 
                ما متعهد به استفاده از بهترین مواد اولیه و ارائه خدمات عالی هستیم.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-500 via-gray-400 to-gray-300 text-white p-10 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <h3 className="text-4xl font-extrabold mb-6">چشمانداز ما</h3>
              <p className="text-gray-100 leading-relaxed text-xl font-medium">
                تبدیل شدن به یکی از برترین فروشگاههای پوشاک در ایران و منطقه، 
                با ارائه محصولات متنوع و خدمات عالی به مشتریان در سراسر کشور.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;