import React from "react";

// react icons
import { CiCalendarDate } from "react-icons/ci";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// data
import { upcomingWorkshop } from "../Data/upcomingWorkshop";

const UpcomingWorkshop = () => {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-6 py-10 md:py-16">
      <h2 className="text-[20px] md:text-[30px] text-textColor font-[700] text-center">
        Upcoming Workshops
      </h2>

      <div className=" mt-6 w-[100%]">
        <Swiper
          loop={true}
          spaceBetween={50}
          slidesPerView={3}
          allowSlideNext={true}
          allowSlidePrev={true}
          allowTouchMove={false}
          scrollbar={{ draggable: true }}
          speed={900}
          navigation={{
            prevEl: ".home-top-sell .slider_prev",
            nextEl: ".home-top-sell .slider_next ",
          }}
          modules={[Autoplay, Navigation]}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            1124: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            700: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            300: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
          }}
        >
          {upcomingWorkshop?.map((workshop, index) => (
            <SwiperSlide>
              <div key={index} className=" shadow-lg">
                <img
                  src={workshop.image}
                  alt="image"
                  className="w-full h-[250px] bg-cover"
                />
                <div className="p-4">
                  <p className="flex items-center text-textColor text-[14px] md:text-[16px] font-[600]">
                    Speaker : <span>{workshop.Speaker}</span>
                  </p>

                  <h2 className="text-[20px] font-[700] text-textColor mt-3">
                    {workshop.title}
                  </h2>

                  <div className="flex items-center gap-3 mt-3">
                    <CiCalendarDate className="text-[1.4rem] text-textColor" />
                    <p className="text-[14px] md:text-[16px] font-[600] text-textColor">
                      {workshop.date}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className=" relative w-[50%]">
                      <img
                        src="avatar.png"
                        alt="avatar"
                        className="w-[30px] md:w-[40px] h-[30px] md:h-[40px] bg-cover rounded-full absolute top-[-20px] left-0 "
                      />
                      <img
                        src="avatar.png"
                        alt="avatar"
                        className="w-[30px] md:w-[40px] h-[30px] md:h-[40px] bg-cover rounded-full absolute top-[-20px] left-[20px] "
                      />
                      <img
                        src="avatar.png"
                        alt="avatar"
                        className="w-[30px] md:w-[40px] h-[30px] md:h-[40px] bg-cover rounded-full absolute top-[-20px] left-[40px] "
                      />
                      <img
                        src="avatar.png"
                        alt="avatar"
                        className="w-[30px] md:w-[40px] h-[30px] md:h-[40px] bg-cover rounded-full absolute top-[-20px] left-[60px] "
                      />

                      <div className="bg-brandColor text-[#fff] w-[30px] md:w-[40px] h-[30px] md:h-[40px] rounded-full text-[12px] md:text-[16px] absolute top-[-20px] left-[80px] flex items-center justify-center">
                        19+
                      </div>
                    </div>

                    <button className="py-2 md:py-3 px-4 md:px-6 bg-brandColor rounded-md text-[#fff]">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default UpcomingWorkshop;
