import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IoTimeOutline } from "react-icons/io5";
import moment from 'moment';
import { Button, Card } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';

const SingleCoursePage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showPayNowButton, setShowPayNowButton] = useState(true);
  const [completedVideos, setCompletedVideos] = useState([]);
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/course/course/single/${slug}/`);
        console.log(response.data.course);
        setCourse(response.data.course);

        // Check payment status and update showPayNowButton state
        if (response.data.course.payment_status === "success") {
          setShowPayNowButton(false);
        } else {
          setShowPayNowButton(true);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourse();
  }, [slug]);

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/chapa/send-request/', {
        course_id: course.id,
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
        setShowPayNowButton(false); // Hide the "Pay Now" button
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
    setCurrentVideoIndex(prevIndex => {
      if (prevIndex < course.upload_videos.length - 1) {
        // If the current video is not the last one, move to the next video
        return prevIndex + 1;
      } else {
        // If the current video is the last one, display a congratulatory message
        alert("Congratulations! You have finished your course.");
        return prevIndex;
      }
    });
    setCompletedVideos(prevVideos => [...prevVideos, currentVideoIndex]);
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
            <div className="relative">
              <video
                key={currentVideoIndex}
                controls
                className="w-full h-auto bg-black mb-4 rounded-lg"
                src={`http://127.0.0.1:8000${course.upload_videos[currentVideoIndex].video}`}
                onEnded={handleVideoEnded}
              >
                Your browser does not support the video tag.
              </video>
              {showPayNowButton && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <Button onClick={handlePayment} className="text-white bg-blue-500 py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Enroll Now</Button>
                </div>
              )}
            </div>
            <div className="p-4">
              <p><strong>Summary:</strong> {course.summary}</p>
              <p><strong>Duration:</strong> {moment(course.finished).format('HH:mm')} Hours</p>
              <p><strong>Level:</strong> {course.level}</p>
              <p><strong>Views:</strong> {course.views}</p>
              <p><strong>Price:</strong> {course.price}</p>
            </div>
          </Card>
        </div>
        <div className="md:col-span-1">
        <Card className="bg-white rounded-sm shadow-md">
  <div className="p-2">
    <h3 className="text-xl font-semibold text-gray-8100 mb-4">Course Details</h3>
    <p><strong>Payment Status:</strong> {course.payment_status}</p>
    <p><strong>Title:</strong> {course.title}</p>
        <p><strong>Charge:</strong> {course.charge}</p>
        <p><strong>Transaction Reference:</strong> {course.tx_ref}</p>
    {course.data && (
      <>
        <h4 className="text-lg font-semibold mt-4 mb-2">Course Videos</h4>
        {course.data.course_videos.map((video, index) => (
          <div key={index}>
            <p><strong>Video Title:</strong> {video.title}</p>
            <p><strong>Summary:</strong> {video.summary}</p>
            {/* Add any other video details you want to display */}
          </div>
        ))}
      </>
    )}
  </div>
</Card>

        </div>
      </div>
      {course.upload_videos.map((video, i) => (
        <Card key={i} className="bg-black rounded-sm shadow-md mb-4 w-full mt-10">
          <div className="p-2">
            <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
            <video
              disabled={loading}
              key={currentVideoIndex + 1}
              className="w-full h-20 bg-black mb-4 rounded-lg"
              controls
            >
              <source src={`http://127.0.0.1:8000${video.video}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p>{video.summary}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SingleCoursePage;
