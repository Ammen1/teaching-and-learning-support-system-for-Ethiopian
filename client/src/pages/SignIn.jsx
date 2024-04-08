import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/api/account/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.non_field_errors?.[0] || 'Unknown error'));
      } else {
        dispatch(signInFailure(null));
        dispatch(signInSuccess(data));
        navigate('/dashboard');
      }
    } catch (error) {
      dispatch(signInFailure('Network error. Please try again.'));
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='max-w-md w-full py-8 px-4 bg-white shadow-lg rounded-md'>
        <div className='text-center'>
          <Link to='/' className='inline-block'>
            <img src="Company/R.png" alt="logo" className="w-36 md:w-48 mx-auto" />
          </Link>
          <p className='mt-5 text-sm text-gray-600'>
            Studying Online Is Much Easier Now! Your E-Learning Platform Unlock the Power of Education in Ethiopia!
          </p>
        </div>
        <form onSubmit={handleSubmit} className='mt-8'>
          <div className='mb-4'>
            <Label value='Your username' />
            <TextInput
              type='text'
              placeholder='Username'
              id='username'
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            />
          </div>
          <div className='mb-4'>
            <Label value='Your password' />
            <TextInput
              type='password'
              placeholder='**********'
              id='password'
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            />
          </div>
          <Button
            type='submit'
            disabled={loading}
            className='w-full bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-900  text-white p-2 rounded-md transition duration-300 ease-in-out'
          >
            {loading ? (
              <>
                <Spinner size='sm' />
                <span className='pl-3'>Loading...</span>
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        <div className='mt-4 text-center'>
          <span className='text-sm text-gray-600'>Don't have an account?</span>
          <Link to='/sign-up' className='ml-1 text-blue-500'>
            Sign Up
          </Link>
        </div>
        <div className='  text-white'>
          <Link to='/forgot-password' className='text-blue-500'>
            Forgot Password?
          </Link>
        </div>
        {errorMessage && (
          <Alert className='mt-4' color='failure'>
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}
