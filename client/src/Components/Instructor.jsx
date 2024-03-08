
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// data
import { InstructorData } from "../Data/Instructor";

const Instructor = () => {
  return (
    <section className="w-full my-8 md:my-16 bg-[#F1F7FF] overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-6 py-12 md:py-24">
        <h2 className="text-[20px] md:text-[30px] text-textColor font-[700] text-center">
          Our Top Instructors
        </h2>

        <div className="mt-16 w-[100%]">
          <Swiper
            loop={true}
            spaceBetween={4}
            slidesPerView={4}
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
            {InstructorData?.map((instructor, index) => (
              <SwiperSlide>
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={instructor.image} 
                    alt="instructor Image"
                    className="w-[250px] h-[250px] rounded-full "
                  />
                  <h2 className=" text-textColor text-[20px] font-[700] mt-4">
                    {instructor.name}
                  </h2>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className=" text-center mt-12">
          <button className="py-3 px-6 bg-[#228be6] rounded-md text-[#fff]">
            View More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Instructor;
