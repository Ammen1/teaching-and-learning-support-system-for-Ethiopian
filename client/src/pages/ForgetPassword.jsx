import React, { useState } from 'react';
import axios from 'axios'; 

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/account/forgot-password/', { email });
      setSuccessMessage(response.data.message);
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md  mt-20">
      <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
      <form onSubmit={handleSubmit} className=''>
        <label className="block mb-4">
          <span className="text-gray-700">Email:</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </label>
        <button
          type="submit"
          className={`w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Password Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
