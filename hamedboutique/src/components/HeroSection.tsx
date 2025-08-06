"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";

const slides = [
  {
    image: 
    "/assets/pics/hamed.jpg",
    title: "خرید خود را همین حالا شروع کنید!",
    subtitle: "تنوع بی‌نظیر، قیمت مناسب و ارسال سریع در انتظار شماست.",
    cta: "مشاهده محصولات",
    link: "/products",
  },
  {
    image: "/assets/pics/inside3.jpg",
    title: "حامد بوتیک، انتخاب شیک‌پوشان",
    subtitle: "جدیدترین کالکشن‌های پوشاک مردانه ارسال رایگان و تضمین کیفیت.",
    cta: "درباره ما بیشتر بدانید",
    link: "/about",
  },
  {
    image: "/assets/pics/cusclb.jpg",
    title: "عضویت در باشگاه مشتریان",
    subtitle: "با عضویت در باشگاه مشتریان از تخفیف‌های ویژه و اخبار جدید مطلع شوید!",
    cta: "عضویت رایگان",
    link: "/about",
  },
];

const HeroSection = () => {
  return (
    <section className="w-full bg-gradient-to-l from-gray-400 via-gray-100 to-white text-black py-0 mb-8 shadow-lg rounded-b-3xl overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        // effect="fade"
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={slides.length > 2}
        slidesPerView={1}
        className="w-full "
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="w-full  flex flex-col md:flex-row-reverse items-center justify-center px-6 md:px-12 lg:px-24 gap-6 md:gap-8">
              <div className="flex-shrink-0 flex justify-center items-center order-1 md:order-2">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={660}
                  height={400}
                  className="h-[600px] drop-shadow-xl object-contain"
                  priority
                />
              </div>
              <div className="text-center md:text-right flex-1 flex flex-col justify-center items-center md:items-start order-2 md:order-1">
                <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 drop-shadow-lg text-gray-700 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl md:text-lg lg:text-2xl mb-6 md:mb-8 font-semibold text-gray-500 max-w-lg leading-relaxed">
                  {slide.subtitle}
                </p>
                <a
                  href={slide.link}
                  className="inline-block bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 text-gray-800 font-bold py-4 px-8 sm:py-4 sm:px-10 rounded-xl shadow-lg hover:bg-gradient-to-r hover:from-gray-500 hover:via-gray-400 hover:to-gray-300 hover:text-white transition-all duration-300 text-lg sm:text-xl md:text-lg border-2 border-gray-300 hover:border-gray-500 hover:shadow-xl transform hover:scale-105"
                >
                  {slide.cta}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;