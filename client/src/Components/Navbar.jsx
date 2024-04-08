import React, { useEffect, useState } from "react";
import { Button } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from "../redux/user/userSlice";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const path = useLocation().pathname;

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const handleLogout = async () => {
    try {
     
      const res = await fetch("http://127.0.0.1:8000/api/account/logout/", {
        method: "POST",
      
      });
  
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <nav className={`border-b-4 py-2 ${scrolling ? 'bg-[#228be6]' : ''} w-full `}>
      <div className="px-8 py-4 md:px-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link
            to='/'
            className='self-center text-xl font-semibold  text-black'
          >
            <span className="px-2 py-2 bg-gradient-to-r text-md from-indigo-900 via-purple-700 to-pink-900 rounded-lg text-white">
            TEACHING AND LEARNING SUPPORT

            </span>
            
          </Link>
          <div className={`lg:flex hidden gap-4 ${scrolling ? 'text-white' : 'text-gray-800'}`}> 
            <Link to='/home' className='hover:text-indigo-500 hover:underline'>Home</Link> 
            {currentUser ? null : <Link to='/sign-in' className='hover:text-indigo-500 hover:underline'>Signin</Link>}
            <Link to='/about' className='hover:text-indigo-500 hover:underline'>About</Link> 
            <Link to='/courses' className='hover:text-indigo-500 hover:underline'>Courses</Link> 
            <Link to='/books' className='hover:text-indigo-500 hover:underline'>Books</Link> 
            <Link to='/quizs' className='hover:text-indigo-500 hover:underline'>Quizs</Link>
            {currentUser && <Button className="text-black hover:text-indigo-500" onClick={handleLogout}>Logout</Button>}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
