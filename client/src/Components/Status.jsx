import React from "react";

const Status = () => {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-6 py-8 md:py-20 flex items-center gap-6 justify-between flex-col md:flex-row">
      <div>
        <div className="flex items-center gap-3">
          <img src="/Status/status1.png" alt="status" className="w-[50px]" />
          <h2 className="text-[20px] md:text-[30px] font-[700] text-textColor">
            26k+
          </h2>
        </div>
        <p className="text-[16px] md:text-[20px] font-[600] text-textColor mt-2">
          Student Joined
        </p>
      </div>

      <div className=" text-center mx-auto">
        <div className="flex items-center gap-3">
          <img src="/Status/status2.png" alt="status" className="w-[50px]" />
          <h2 className="text-[20px] md:text-[30px] font-[700] text-textColor">
            530k+
          </h2>
        </div>
        <p className="text-[16px] md:text-[20px] font-[600] text-textColor mt-2">
          Online Courses{" "}
        </p>
      </div>

      <div>
        <div className="flex items-center gap-3">
          <img src="/Status/status3.png" alt="status" className="w-[50px]" />
          <h2 className="text-[20px] md:text-[30px] font-[700] text-textColor">
            230+
          </h2>
        </div>
        <p className="text-[16px] md:text-[20px] font-[600] text-textColor mt-2">
          Amazing Blogs
        </p>
      </div>

      <div className=" flex items-center justify-center flex-col">
        <div className="flex items-center gap-3">
          <img src="/Status/status4.png" alt="status" className="w-[50px]" />
          <h2 className="text-[20px] md:text-[30px] font-[700] text-textColor">
            60k+
          </h2>
        </div>
        <p className="text-[16px] md:text-[20px] font-[600] text-textColor mt-2">
          Experienced Instructors
        </p>
      </div>
    </section>
  );
};

export default Status;
