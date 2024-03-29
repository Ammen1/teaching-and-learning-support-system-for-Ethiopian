import React from "react";
import { Link } from 'react-router-dom';
import { IoTimeOutline } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";
import { courseData } from "../Data/Course";
import Lottie from "lottie-react";
import heroAnimation from '../animation/Animation 1.json';
import { Card } from 'flowbite-react';

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

      <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {courseData?.map((course, index) => (
        <Link to={`/course/${course.id}`} key={index} className="card-link">
        <Card className="bg-white rounded-sm border dark:bg-white dark:border-slate-100">
        <img
          src={course.image}
          alt="image"
          className="w-full h-[200px] md:h-[250px] bg-cover object-cover"
        />

        <div className="p-4">
          <h2 className="text-[20px] md:text-[30px] font-[700] text-textColor">
            {course.title}
          </h2>

          <div className="w-full flex items-end justify-between border-b border-brandColor py-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-[14px] md:text-[18px]">
                <IoTimeOutline className="text-[1.3rem]" />
                <p>{course.time}</p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-[14px] md:text-[18px] font-[500] text-textColor">
                  {course.views}
                </p>
                <p className="text-[14px] md:text-[18px] font-[500] text-textColor">
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
              <Lottie
                animationData={heroAnimation}
                loop
                autoplay
                style={{ width: '80%', maxWidth: '600px' }}
                className="rounded-lg overflow-hidden bg-cover object-cover"
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
      </Card>
    </Link>
  ))}
</div>
    </section>
  );
};

export default CourseCategory;
