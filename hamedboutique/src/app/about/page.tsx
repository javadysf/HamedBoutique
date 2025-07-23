"use client";
import React from "react";
import { Loading } from "@/components/common";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-khaki text-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">درباره حامد بوتیک</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            ارائه بهترین محصولات پوشاک با کیفیت بالا و قیمت مناسب. ما متعهد به رضایت مشتریان خود هستیم.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">داستان ما</h2>
              <div className="space-y-4 text-secondary leading-relaxed">
                <p>
                  حامد بوتیک در سال ۱۳۹۵ با هدف ارائه محصولات با کیفیت و قیمت مناسب تأسیس شد. 
                  ما از همان ابتدا متعهد بودیم که بهترین تجربه خرید را برای مشتریان خود فراهم کنیم.
                </p>
                <p>
                  با گذشت سال‌ها، ما توانسته‌ایم به یکی از معتبرترین فروشگاه‌های پوشاک در ایران تبدیل شویم 
                  و هزاران مشتری راضی داشته باشیم.
                </p>
                <p>
                  امروز، حامد بوتیک با تیمی متخصص و تجهیزات مدرن، آماده ارائه خدمات بهتر به مشتریان عزیز است.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">۸+</div>
                    <div className="text-secondary text-sm">سال تجربه</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">۱۰۰۰+</div>
                    <div className="text-secondary text-sm">مشتری راضی</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">۵۰۰+</div>
                    <div className="text-secondary text-sm">محصول متنوع</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">۲۴/۷</div>
                    <div className="text-secondary text-sm">پشتیبانی</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">ارزش‌های ما</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              ما بر اساس این ارزش‌ها فعالیت می‌کنیم و متعهد به رعایت آنها در تمام جنبه‌های کاری خود هستیم.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">کیفیت بالا</h3>
              <p className="text-secondary text-sm">
                ارائه محصولات با بالاترین کیفیت و استفاده از بهترین مواد اولیه
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">رضایت مشتری</h3>
              <p className="text-secondary text-sm">
                اولویت اول ما رضایت کامل مشتریان و ارائه خدمات عالی است
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">قیمت مناسب</h3>
              <p className="text-secondary text-sm">
                ارائه محصولات با قیمت‌های منصفانه و رقابتی
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">سرعت و دقت</h3>
              <p className="text-secondary text-sm">
                ارسال سریع و دقیق محصولات به سراسر کشور
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">تیم ما</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              تیم متخصص و با تجربه ما آماده ارائه بهترین خدمات به شما عزیزان است.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary to-navy-700 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">ح</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-primary mb-2">حامد احمدی</h3>
                <p className="text-secondary text-sm mb-3">مدیرعامل و مؤسس</p>
                <p className="text-secondary text-sm">
                  با بیش از ۱۰ سال تجربه در صنعت پوشاک، متعهد به ارائه بهترین خدمات به مشتریان است.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary to-navy-700 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">س</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-primary mb-2">سارا محمدی</h3>
                <p className="text-secondary text-sm mb-3">مدیر فروش</p>
                <p className="text-secondary text-sm">
                  متخصص در زمینه فروش و روابط با مشتریان، با هدف افزایش رضایت مشتریان فعالیت می‌کند.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary to-navy-700 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">ع</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-primary mb-2">علی رضایی</h3>
                <p className="text-secondary text-sm mb-3">مدیر فنی</p>
                <p className="text-secondary text-sm">
                  مسئول کیفیت محصولات و نظارت بر فرآیند تولید، متعهد به ارائه محصولات با کیفیت است.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-primary to-navy-700 text-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">ماموریت ما</h3>
              <p className="text-gray-200 leading-relaxed">
                ارائه محصولات با کیفیت بالا و قیمت مناسب به مشتریان، با هدف افزایش رضایت و اعتماد آنها. 
                ما متعهد به استفاده از بهترین مواد اولیه و ارائه خدمات عالی هستیم.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-navy-700 to-primary text-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">چشم‌انداز ما</h3>
              <p className="text-gray-200 leading-relaxed">
                تبدیل شدن به یکی از برترین فروشگاه‌های پوشاک در ایران و منطقه، 
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