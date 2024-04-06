import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoTimeOutline } from "react-icons/io5";
import { Card } from 'flowbite-react';
import moment from 'moment';

const CourseCategory = () => {
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/course/courses/');
        console.log(response.data)
        setCourseData(response.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="w-full max-w-[1600px] mt-20 dark:bg-white mx-auto px-6 py-8 md:py-16">
      <h2 className="text-[20px] md:text-[30px] text-textColor font-[700] text-center">
        Course Categories
      </h2>

      <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courseData.map((course, index) => (
          <Link to={`/course/${course.course.slug}`} key={index} className="card-link">
            <Card className="bg-white rounded-sm border dark:bg-white dark:border-slate-100">
              {/* Render videos or image based on flag */}
              {course.course.upload_videos.map((video, idx) => (
                <div key={idx}>
                  {video.flag && (
                    <video controls className="w-full h-72 bg-cover object-cover mb-4">
                    <source src={`http://127.0.0.1:8000${video.video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  )}
                </div>
              ))}
              <div className="p-4">
                <h2 className="text-[20px] md:text-[30px] font-[700] text-textColor">
                  {course.course.title}
                </h2>
                {/* Other course details */}
                <div className=" items-end justify-between border-b border-brandColor py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-[14px] md:text-[18px]">
                      <IoTimeOutline className="text-[1.3rem] text-black" />
                      <p className=" text-black">{moment(course.course.finished).format('HH:mm')} {" "} Hours</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[14px] md:text-[18px] font-[500] text-black">
                        views: {course.course.views}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-[20px] md:text-[25px]  text-black">
                    <span className=" text-lg">price:</span> {course.course.price}
                  </h3>
                  <p className="text-[16px] md:text-[20px] font-[500] text-black">
                    level: {course.course.level}
                  </p>
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
