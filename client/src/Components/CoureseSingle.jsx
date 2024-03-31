import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IoTimeOutline } from "react-icons/io5";
import moment from 'moment';
import { Card } from 'flowbite-react';

const SingleCoursePage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/course/course/single/${slug}/`);
        console.log(response.data.course);
        setCourse(response.data.course); // Assuming that the API response has a 'course' key containing the course data
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourse();
  }, [slug]);

  const handleDownload = (url, filename) => {
    axios.get(url, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => console.error('Error downloading file:', error));
  };

  if (!course) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  return (
    <div className="bg-white mx-auto px-6 py-8 md:py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
        {course.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black">
        {/* Card section */}
        <div>
          <Card className="bg-white rounded-sm border dark:bg-white dark:border-slate-100">
              {/* Video */}
              {course.upload_videos[0].flag ? (
                <video controls className="w-full h-[200px] md:h-[250px] bg-cover object-cover">
                  <source src={course.upload_videos[0].video} type="video/mp4"  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={course.uploads[0].file} alt={course.title} className="w-full h-auto rounded-lg shadow-md" />
              )}
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Course Introduction</h3>
              <p>{course.summary}</p>
            </div>
            {/* Download button for video */}
            <button onClick={() => handleDownload(course.upload_videos[0].video, 'video.mp4')}>
              Download Video
            </button>
            {/* Download button for file */}
            <button onClick={() => handleDownload(course.uploads[0].file, 'file')}>
              Download File
            </button>
          </Card>
        </div>
        
        {/* Course details */}
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Course Details</h3>
          <p><span className="font-semibold">Course Code:</span> {course.code}</p>
          <p><span className="font-semibold">Level:</span> {course.level}</p>
          <p><span className="font-semibold">Year:</span> {course.year}</p>
          <p><span className="font-semibold">Semester:</span> {course.semester}</p>
          <p><span className="font-semibold">Credit:</span> {course.credit}</p>
          <p><span className="font-semibold">Price:</span> {course.price}</p>
          <p><span className="font-semibold">Views:</span> {course.views}</p>
          <p><span className="font-semibold">Finished:</span> {moment(course.finished).format('HH:mm')}{" "}Hours</p>
        </div>

        {/* Lecturer details */}
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Lecturer Details</h3>
          <p><span className="font-semibold">Username:</span> {course.lecturer.username}</p>
          <p><span className="font-semibold">Email:</span> {course.lecturer.email}</p>
          {/* Add other lecturer details as needed */}
        </div>
      </div>
    </div>
  );
};

export default SingleCoursePage;
