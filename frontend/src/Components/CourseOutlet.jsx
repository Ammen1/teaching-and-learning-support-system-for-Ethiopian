import React from "react";

const CourseOutlet = () => {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-6 flex items-center gap-8 justify-between my-6 md:my-16 flex-col md:flex-row">
      <img
        src="/courseOutlet.png"
        alt="image"
        className="w-full md:w-[600px]"
      />
      <div className="w-full md:w-[40%]">
        <h3 className="text-[20px] md:text-[30px] font-[700] text-textColor">
          You Can Learn, Wherever You Want
        </h3>
        <p className="text-[14px] md:text-[18px]  text-textColor font-[500] mt-3">
          We provide you the best course modules with the most experienced
          instructors so that you can learn the lessons easily even in your own
          house!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-8">
          <p className="flex items-center gap-3">
            <img src="/rightIcon.png" alt="icon" className="w-[20px]" />
            Online Resources
          </p>
          <p className="flex items-center gap-3">
            <img src="/rightIcon.png" alt="icon" className="w-[20px]" />
            Weekly Sessions
          </p>
          <p className="flex items-center gap-3">
            <img src="/rightIcon.png" alt="icon" className="w-[20px]" />
            Live Classes
          </p>
          <p className="flex items-center gap-3">
            <img src="/rightIcon.png" alt="icon" className="w-[20px]" />
            Quiz & Practices
          </p>
        </div>

        <button className="py-2 px-6 bg-brandColor rounded-md text-[#fff]">
          Register Now
        </button>
      </div>
    </section>
  );
};

export default CourseOutlet;
