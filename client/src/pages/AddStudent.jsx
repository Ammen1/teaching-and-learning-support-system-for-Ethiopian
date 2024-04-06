import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Button, Label, Select, Spinner, TextInput } from "flowbite-react";

const StudentAddForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    phone: '',
    email: '',
    program: '', // Program ID
    gender: '', // Gender
  });
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/course/program/all/');
        setPrograms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    fetchPrograms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/account/student/add/', formData);
      console.log(response.data); // Assuming the response contains success message
      alert('Student added successfully!');
      // Reset form fields after successful submission
      setFormData({
        first_name: '',
        last_name: '',
        address: '',
        phone: '',
        email: '',
        program: '',
        gender: '', // Reset gender field
      });
    } catch (error) {
        console.error(error)
      console.error('Error adding student:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-4 mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6 text-slate-900">Add Students</h2>
      {loading ? (
        <p>Loading programs...</p>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
            <span className=' text-black'>First Name</span>
            </Label>
            <TextInput
              className=""
              id="first_name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
            <span className=' text-black'>Last name</span>
              
            </Label>
            <TextInput
              className=""
              id="last_name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              
              <span className=' text-black'>Address</span>
            </Label>
            <TextInput
              className=""
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">            
              <span className=' text-black'>Phone Number</span>
            </Label>
            <TextInput
              className=""
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">  
              <span className=' text-black'>Email Address</span>
            </Label>
            <TextInput
              className=""
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="mb-4">
            <Label className=" text-gray-700 text-sm font-bold mb-2" htmlFor="program">
             <span className=' text-black'>Program</span> 
            </Label>
            <Select
              className=""
              name="program"
              value={formData.program}
              onChange={handleChange}
              required
            >
              <option value="">Select Program</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>{program.title}</option>
              ))}
            </Select>
          </div>
          <div className="mb-4 text-gray-700">
            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
             <span className=' text-black'> Gender</span>
            </Label>
            <Select
              className=""
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <div className="text-center">
            <Button
              className="bg-blue-500 hover:bg-blue-700 ml-28 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Student
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StudentAddForm;
