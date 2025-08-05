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
    image: "/assets/pics/pichero1.png",
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
        className="w-full h-[350px] md:h-[480px]"
      >
        {slides.map((slide, idx) => (
     <SwiperSlide key={idx}>
     <div className="w-full h-full flex flex-col md:flex-row-reverse items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 gap-4 md:gap-8" style={{height: '100%'}}>
       <div className="flex-shrink-0 flex justify-center items-center w-full md:w-auto mt-4 md:mt-0">
         <Image
           src={slide.image}
           alt={slide.title}
           width={660}
           height={660}
           className="w-64 sm:w-56 md:w-64 lg:w-72 drop-shadow-xl object-contain"
           priority
         />
       </div>
       <div className="text-center md:text-right flex-1 flex flex-col justify-center items-center md:items-start py-4 md:py-0">
         <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-4 drop-shadow-lg text-gray-700">{slide.title}</h1>
         <p className="text-sm sm:text-base md:text-lg lg:text-2xl mb-4 sm:mb-6 font-bold text-gray-400 max-w-md">{slide.subtitle}</p>
         <a
           href={slide.link}
           className="inline-block bg-white text-gray-700 font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow hover:bg-gray-700 hover:text-white transition-colors text-sm sm:text-base md:text-lg border-2 border-gray-100 hover:border-gray-700"
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