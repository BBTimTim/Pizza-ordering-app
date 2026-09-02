import React from "react";
import Heart from "../../assets/hero/heart.png";
import Nutella from "../../assets/hero/nutella.png";
import Piknic from "../../assets/hero/piknic.jpg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

export default function Hero() {
  return (
    <Swiper
      className="swiper"
      modules={[Autoplay]}
      autoplay={{ delay: 3000 }}
      spaceBetween={0}
      slidesPerView={1}
    >
      <SwiperSlide>
        <div className="relative overflow-hidden min-h-[550px] bg-white flex items-center">
          <div className="absolute h-[600px] w-[900px] bg-gradient-to-r from-red-700 to-red-100 rounded-full rotate-35 z-0 blur-[10px] -left-4 inset-x-0 -bottom-5"></div>

          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-8">
              <div className="text-center sm:text-left px-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-bold">
                  Elérkezett e havi különleges ajánlatunk
                </h1>
                <p className="text-sm mt-4 text-white font-normal italic py-3 px-2">
                  Úgy gondoltuk kedveskedünk a romantikázni vágyóknak is. Mi
                  mással tehetnénk még hangulatosabbá az estéteket, mint a
                  legújabb szív alakú pizzánkkal!
                </p>
                <button className="mt-4 bg-gradient-to-r from-red-700 to-red-500 hover:scale-105 text-white py-2 px-8 rounded-full transition-all duration-200 border border-white">
                  Kipróbálom
                </button>
              </div>

              <div className="flex justify-center">
                <img
                  className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] hover:scale-110 transition-all duration-200 rotate-25 object-contain"
                  src={Heart}
                  alt="pizza-heart-shape"
                />
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="relative overflow-hidden min-h-[550px] bg-white flex items-center">
          <div className="absolute h-[600px] w-[900px] bg-gradient-to-r from-red-700 to-red-100 rounded-full rotate-35 z-0 blur-[10px] -left-4 inset-x-0 -bottom-5"></div>

          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-8">
              <div className="text-center sm:text-left px-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-bold">
                  Desszert rajongók figyelem
                </h1>
                <p className="text-sm mt-4 text-white font-normal italic py-3 px-2">
                  Ki mondta, hogy a pizza nem lehet desszert? Na most
                  figyeljetek, mert itt az új nutellás-epres kreációnk
                </p>
                <button className="mt-4 bg-gradient-to-r from-red-700 to-red-500 hover:scale-105 text-white py-2 px-8 rounded-full transition-all duration-200 border border-white">
                  Kipróbálom
                </button>
              </div>

              <div className="flex justify-center">
                <img
                  className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] hover:scale-110 transition-all duration-200 rotate-25 object-contain"
                  src={Nutella}
                  alt="pizza-nutella"
                />
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div
          className="relative overflow-hidden min-h-[550px] flex items-center bg-no-repeat bg-center bg-cover"
          style={{ backgroundImage: `url(${Piknic})` }}
        >
          <div className="absolute h-[200px] w-[550px] bg-red-700 rounded-full z-0 -left-25 inset-x-0"></div>
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-8">
              <div className="text-center sm:text-left px-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-bold">
                  Pizza - Piknic
                </h1>
                <p className="text-sm mt-4 text-white font-normal italic py-3 px-2">
                  Részletek hamarosan. ígérjük nem váratunk sokáig
                </p>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
