import React, { useState, useEffect } from 'react';
import './styles.css'; // Import your custom styles
import { Button, Card } from 'flowbite-react';

// Define a default cover image URL
const defaultCoverImage = 'https://cdn.pixabay.com/photo/2017/08/06/22/01/books-2596809_1280.jpg';

function UploadFiles() {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/course/upload/')
      .then(response => response.json())
      .then(data => setUploads(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="container mx-auto px-4  p-10">
      <h1 className="text-3xl font-semibold text-center mt-8 mb-4 text-gray-900">Courses Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uploads.map(upload => (
          <Card key={upload.id} className="relative group dark:bg-slate-100 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-cover" style={{backgroundImage: `url(${defaultCoverImage})`, backgroundSize: 'cover', height: '200px'}}></div>
            <div className="px-6 py-4 flex-grow">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{upload.title}</h3>
              <p className="text-md font-medium mb-2 text-gray-900"><span className=' text-sm'>Course Name:</span>{" "}{upload.course.title}</p>
                <p className="text-md font-medium mb-2 text-gray-900"><span className=' text-sm'>Course Code:</span>{" "} {upload.course.code}</p>
                <p className="text-md font-medium mb-2 text-gray-900"><span className=' text-sm'>Lecturer:</span>{" "} {upload.course.lecturer.full_name}</p>
                <p className="text-md font-medium mb-2 text-gray-900"><span className=' text-sm'>Level:</span>{" "}{upload.course.level}</p>
              <div className="course-details overflow-hidden opacity-0 absolute top-0 left-0 bg-gradient-to-r to-white from-zinc-300 via-orange-300 p-4 rounded-lg shadow-md pointer-events-none transition-all duration-300  scale-0 group-hover:opacity-100 group-hover:scale-100">
                <p className="text-md font-medium mb-2 text-gray-900"><span className=' text-sm'>Course Name:</span>{" "}{upload.course.title}</p>
                <p className="text-sm font-medium mb-2 text-gray-900"><span className=' text-sm'>Summary:</span>{" "}{upload.course.summary}</p>
                <p className="text-gray-900 text-sm"><span className=' text-sm'>Uploaded Date:</span>{" "} {new Date(upload.upload_time).toLocaleDateString()}</p>
                <p className="text-gray-900 text-sm"><span className=' text-sm'>Updated Date:</span>{" "} {new Date(upload.updated_date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="px-6 py-4 mt-auto">
              <a href={upload.file} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Download</a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UploadFiles;
