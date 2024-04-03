import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IoTimeOutline } from "react-icons/io5";
import moment from 'moment';
import { Card } from 'flowbite-react';

const SingleCoursePage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/course/course/single/${slug}/`);
        console.log(response.data.course);
        setCourse(response.data.course);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourse();
  }, [slug]);

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/chapa/send-request/', {
        // courseId: course.id,
        amount: course.price,
        email: "abebech_bekele@gmail.com",
        currency: "ETB",
        first_name: "Bilen",
        last_name: "Gizachew",
        phone_number: "0912345678",
        callback_url: "http://localhost:5173/course/core1",
        return_url: "http://localhost:5173/course/core1",
        description: "Your transaction description here"
      });
      if (response.data && response.data.status === "success") {
        // Redirect the user to the checkout URL
        window.location.href = response.data.data.checkout_url;
      } else {
        // Log an error if the payment status is not success
        console.error('Invalid response from payment API:', response.data);
      }
    } catch (error) {
      console.log(error)
      console.error('Error processing payment:', error);
    }
  };
  

  const handleVideoEnded = () => {
    setCurrentVideoIndex(prevIndex => prevIndex + 1);
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  if (paymentComplete) {
    // Redirect to checkout URL
    window.location.href = checkoutUrl;
  }

  const nextVideo = course.upload_videos[currentVideoIndex + 1];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
        {course.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="bg-white rounded-sm shadow-md">
            <video
              key={currentVideoIndex}
              controls
              className="w-full h-72 bg-cover object-cover mb-4"
              onEnded={handleVideoEnded}
            >
              <source src={`http://127.0.0.1:8000${course.upload_videos[currentVideoIndex].video}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Course Introduction</h3>
              <p>{course.summary}</p>
              {!paymentComplete && (
                <button onClick={handlePayment} className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Enroll Now</button>
              )}
            </div>
          </Card>
          {nextVideo && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Next Video: {nextVideo.title}</h3>
              <p>Duration: {moment.duration(course.finished, "seconds").humanize()}</p>
            </div>
          )}
        </div>
        <div className="md:col-span-1">
          <Card className="bg-white rounded-sm shadow-md">
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Course Details</h3>
              <p><span className="font-semibold">Course Code:</span> {course.code}</p>
              <p><span className="font-semibold">Level:</span> {course.level}</p>
              <p><span className="font-semibold">Year:</span> {course.year}</p>
              <p><span className="font-semibold">Semester:</span> {course.semester}</p>
              <p><span className="font-semibold">Credit:</span> {course.credit}</p>
              <p><span className="font-semibold">Price:</span> {course.price}</p>
              <p><span className="font-semibold">Views:</span> {course.views}</p>
              <p><span className="font-semibold">Finished:</span> {moment(course.finished).format('HH:mm')} Hours</p>
            </div>
          </Card>
          <Card className="mt-8">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Additional Materials</h3>
            {course.uploads && course.uploads.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-2">{course.uploads[0].title}</h3>
                <p>{moment(course.uploads[0].updated_date).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <a href={course.uploads[0].file} download>Download</a>
              </>
            )}
          </Card>
        </div>
        <div>
          <Card className="bg-white rounded-sm shadow-md">
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Lecturer Details</h3>
              <p><span className="font-semibold">Username:</span> {course.lecturer.username}</p>
              <p><span className="font-semibold">Email:</span> {course.lecturer.email}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SingleCoursePage;
