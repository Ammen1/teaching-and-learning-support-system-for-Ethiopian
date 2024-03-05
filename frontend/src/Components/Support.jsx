import React from "react";

const Support = () => {
  return (
    <section className="w-full mt-8 md:mt-16 bg-[#F1F7FF] overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-6 py-24 flex items-center justify-between gap-10 flex-col md:flex-row">
        <img
          src="support.png"
          alt="image"
          className="w-full md:w-[550px] bg-cover"
        />

        <div className="w-full md:w-[45%]">
          <h4 className="text-[16px] md:text-[20px] text-textColor font-[500]">
            Looking for support?
          </h4>
          <h2 className="text-[20px] md:text-[30px] text-textColor font-[700] mt-5">
            Lifetime Free Support
          </h2>
          <p className="text-[14px] md:text-[18px] font-[500] text-textColor mt-3 mb-8">
            Our main aim is to provide you the best quality education with best
            instructors. If you have any quires or you need any kinds of help
            then you can get the proper support from our very enegrgytic help &
            support team.
          </p>

          <button className="py-3 px-6 bg-brandColor rounded-md text-[#fff]">
            Get Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default Support;
