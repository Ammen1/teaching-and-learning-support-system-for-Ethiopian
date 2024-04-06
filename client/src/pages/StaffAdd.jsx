import React, { useState } from 'react';
import axios from 'axios'; // Make sure to install axios using npm or yarn
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";

const StaffAdd = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    phone: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/account/staff/add/', formData);
      console.log(response.data); // Assuming the response contains user data
      alert('Staff member added successfully!');
      // Reset form fields after successful submission
      setFormData({
        first_name: '',
        last_name: '',
        address: '',
        phone: '',
        email: '',
      });
    } catch (error) {
      console.error('Error adding staff member:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto w-full h-full p-6 bg-white mt-20 shadow-md rounded-md ">
      <h2 className="text-2xl font-semibold mb-6 text-slate-900">Add Staff Member</h2>
      <form onSubmit={handleSubmit} className='w-full'>
        <div className="mb-4">
          <TextInput
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className=" w-full"
            required
          />
        </div>
        <div className="mb-4">
          <TextInput
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="input"
            required
          />
        </div>
        <div className="mb-4">
          <TextInput
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="input"
            required
          />
        </div>
        <div className="mb-4">
          <TextInput
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="input"
            required
          />
        </div>
        <div className="mb-4">
          <TextInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input"
            required
          />
        </div>
        <Button className="border-2 py-2 px-4 bg-[#228be6] ml-28 rounded-md text-[#fff] flex items-center">Add Staff</Button>
      </form>
    </div>
  );
};

export default StaffAdd;
