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
    <div className='min-h-screen bg-white mt-20'>
      <div className='max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row items-center gap-8'>
          <div className='flex flex-1 flex-col justify-center'>
            <Link to='/' className='inline-block'>
              <img src="Company/R.png" alt="logo" className="w-36 md:w-48" />
            </Link>
            <p className='mt-5 text-sm text-gray-600'>
              Studying Online Is Much Easier Now! Your E-Learning Platform Unlock the Power of Education in Ethiopia!
            </p>
          </div>
          <div className='flex flex-1 flex-col justify-center'>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <Label value='Your username' />
                <TextInput
                  type='text'
                  placeholder='Username'
                  id='username'
                  onChange={handleChange}
                />
              </div>
              <div className='mb-4'>
                <Label value='Your password' />
                <TextInput
                  type='password'
                  placeholder='**********'
                  id='password'
                  onChange={handleChange}
                />
              </div>
              <Button
                type='submit'
                disabled={loading}
                className='border-2 py-2 px-4 bg-[#228be6] rounded-md text-[#fff] flex items-center'
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
            <div className='mt-4 flex items-center text-sm text-gray-600'>
              <span>Don't have an account?</span>
              <Link to='/sign-up' className='ml-1 text-blue-500'>
                Sign Up
              </Link>
            </div>
            {errorMessage && (
              <Alert className='mt-4' color='failure'>
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
