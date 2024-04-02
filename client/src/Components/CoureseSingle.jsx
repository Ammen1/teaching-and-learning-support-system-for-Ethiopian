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
      const response = await axios.post('http://127.0.0.1:8000/api/chapa/initiate-chapa-transaction/', {
        // courseId: course.id,
        amount: course.price,
        email: "abebech_bekele@gmail.com",
        first_name: "Bilen",
        last_name: "Gizachew",
        phone_number: "0912345678",
        callback_url: "https://webhook.site/",
        return_url: "https://www.google.com/",
        description: "Your transaction description here"
      });
      if (response.data && response.data.checkout_url) {
        // Redirect the user to the checkout URL
        window.location.href = response.data.checkout_url;
      } else {
        // Log an error if checkout_url is missing
        console.error('Invalid response from payment API:', response.data);
      }
    } catch (error) {
      console.log(error)
      console.error('Error processing payment:', error);
    }
  };
  if (!course) {
    return <div>Loading...</div>;
  }

  if (paymentComplete) {
    // Redirect to checkout URL
    window.location.href = checkoutUrl;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
        {course.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="bg-white rounded-sm shadow-md">
            {course.upload_videos[0].flag ? (
              <video controls className="w-full h-72 bg-cover object-cover">
                <source src={course.upload_videos[0].video} type="video/mp4"  />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={course.uploads[0].file} alt={course.title} className="w-full h-auto rounded-t-md shadow-md" />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Course Introduction</h3>
              <p>{course.summary}</p>
              {!paymentComplete && (
                <button onClick={handlePayment} className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Enroll Now</button>
              )}
            </div>
          </Card>
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