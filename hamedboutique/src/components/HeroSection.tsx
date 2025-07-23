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
    image: "/assets/pics/pichero1.png",
    title: "خرید خود را همین حالا شروع کنید!",
    subtitle: "تنوع بی‌نظیر، قیمت مناسب و ارسال سریع در انتظار شماست.",
    cta: "مشاهده محصولات",
    link: "/products",
  },
  {
    image: "/assets/pics/hero2.jpg",
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
     <div className="w-full h-full flex flex-col md:flex-row-reverse items-center justify-center px-6 md:px-24 gap-8" style={{height: '100%'}}>
       <div className="flex-shrink-0 flex justify-center items-center w-full md:w-auto">
         <Image
           src={slide.image}
           alt={slide.title}
           width={400}
           height={660}
          //  className="w-72 md:w-72 drop-shadow-xl animate-fade-in"
          //  style={{ maxHeight: 220 }}
         />
       </div>
       <div className="text-center md:text-right flex-1 flex flex-col justify-center items-center md:items-start">
         <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg text-gray-700">{slide.title}</h1>
         <p className="text-lg md:text-2xl mb-6 font-bold text-gray-400">{slide.subtitle}</p>
         <a
           href={slide.link}
           className="inline-block bg-white text-gray-700 font-bold py-3 px-8 rounded-lg shadow hover:bg-gray-700 hover:text-white transition-colors text-lg border-2 border-gray-100 hover:border-gray-700"
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