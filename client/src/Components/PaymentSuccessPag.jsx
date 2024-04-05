import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const { trx_ref } = useParams(); // Extracting transaction ID from URL
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch payment details and course details from your API using the dynamic transaction ID
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/chapa/verify-payment/${trx_ref}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch payment details');
        }
        const data = await response.json();
        setPaymentDetails(data.data);
        setCourseDetails(data.course_details);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [trx_ref]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Payment Successful</h1>
      {paymentDetails && (
        <div>
          <h2>Payment Details:</h2>
          <p>First Name: {paymentDetails.first_name}</p>
          <p>Last Name: {paymentDetails.last_name}</p>
          <p>Email: {paymentDetails.email}</p>
          <p>Amount: {paymentDetails.amount} {paymentDetails.currency}</p>
          {/* Display other payment details */}
        </div>
      )}
      {courseDetails && (
        <div>
          <h2>Course Details:</h2>
          <p>Title: {courseDetails.title}</p>
          <p>Summary: {courseDetails.summary}</p>
          <p>Lecturer: {courseDetails.lecturer.username}</p>
          <p>Email: {courseDetails.lecturer.email}</p>
          {/* Display uploads and course videos */}
          <h3>Uploads:</h3>
          {courseDetails.uploads.map(upload => (
            <div key={upload.id}>
              <p>Title: {upload.title}</p>
              <p>File: {upload.file}</p>
              {/* Display other upload details */}
            </div>
          ))}
          <h3>Course Videos:</h3>
          {courseDetails.course_videos.map(video => (
            <div key={video.id}>
              <p>Title: {video.title}</p>
              <p>Video: {video.video}</p>
              {/* Display other video details */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
