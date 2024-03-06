
// react icons
import { IoTimeOutline } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// data
import { courseData } from "../Data/Course";

const CourseCategory = () => {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-6 py-8 md:py-16">
      <h2 className="text-[20px] md:text-[30px] text-textColor font-[700] text-center">
        Course Categories
      </h2>

      <div className="flex items-center justify-center gap-5 mt-8 overflow-y-scroll md:overflow-y-hidden">
        <h3 className="text-[16px] md:text-[20px] font-[500] text-textColor">
          Literature
        </h3>
        <h3 className="text-[16px] md:text-[20px] font-[500] text-textColor">
          Academic
        </h3>
        <h3 className="text-[16px] md:text-[20px] font-[500] text-textColor">
          Tech
        </h3>
        <h3 className="text-[16px] md:text-[20px] font-[500] text-textColor">
          Design
        </h3>
        <h3 className="text-[16px] md:text-[20px] font-[500] text-textColor">
          Language
        </h3>
      </div>

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
          {courseData?.map((course, index) => (
            <SwiperSlide>
              <div className="bg-white rounded-sm border ">
                <img
                  src={course.image}
                  alt="image"
                  className="w-full h-[200px] md:h-[250px] bg-cover "
                />

                <div className="w-full p-4">
                  <h2 className="text-[20px] md:text-[30px] font-[700] text-textColor">
                    {course.title}
                  </h2>

                  <div className="w-full flex items-end justify-between border-b border-brandColor py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-[14px] md:text-[18px]">
                        <IoTimeOutline className="text-[1.3rem]" />
                        <p>{course.time}</p>
                      </div>

                      <div className="flex items-center gap-3 ">
                        <p className="text-[14px] md:text-[18px]  font-[500] text-textColor">
                          {course.views}
                        </p>
                        <p className="text-[14px] md:text-[18px]  font-[500] text-textColor">
                          {course.status}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-[20px] md:text-[25px] font-[700] text-[#228be6]">
                      {course.price}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between w-full mt-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="avatar.png"
                        alt="avatar"
                        className="w-[40px] md:w-[50px]"
                      />
                      <div className="flex flex-col">
                        <p className="text-[12px] md:text-[20px] font-[500] text-textColor">
                          Conduct by:
                        </p>

                        <p className="text-[16px] md:text-[20px] font-[500] text-[#228be6]">
                          {course.instructorName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-end justify-end flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <TiStarFullOutline className="text-[1rem] md:text-[1.3rem] text-[#FFBA0A]" />
                        <TiStarFullOutline className="text-[1rem] md:text-[1.3rem] text-[#FFBA0A]" />
                        <TiStarFullOutline className="text-[1rem] md:text-[1.3rem] text-[#FFBA0A]" />
                        <TiStarFullOutline className="text-[1rem] md:text-[1.3rem] text-[#FFBA0A]" />
                        <TiStarFullOutline className="text-[1rem] md:text-[1.3rem] text-[#FFBA0A]" />
                      </div>
                      <p className="text-[14px] md:text-[18px] font-[500] text-textColor">
                        {course.rating}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className=" text-center mt-8">
        <button className="py-3 px-6 bg-[#228be6] rounded-md text-[#fff]">
          View More
        </button>
      </div>
    </section>
  );
};

export default CourseCategory;
