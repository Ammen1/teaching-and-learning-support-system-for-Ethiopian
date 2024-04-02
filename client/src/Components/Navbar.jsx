import React, { useEffect, useState } from "react";
import { Button, Navbar as FlowBiteNavbar, TextInput } from 'flowbite-react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
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

  return (
    <nav className="border-b-2 bg-gray-800 w-full">
      <div className="px-8 py-4 md:px-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link
            to='/'
            className='self-center text-xl font-semibold text-indigo-500 dark:text-white'
          >
            <img src="Company/R.png" alt="logo" className="w-24 " />
          </Link>
          <div className="flex gap-4">
            <Link to='/home' className='text-gray-800 dark:text-white hover:text-indigo-500 hover:underline'>Home</Link> 
            <Link to='/sign-in' className='text-gray-800 dark:text-white hover:text-indigo-500 hover:underline'>Signin</Link> 
            <Link to='/about' className='text-gray-800 dark:text-white hover:text-indigo-500 hover:underline'>About</Link> 
            <Link to='/courses' className='text-gray-800 dark:text-white hover:text-indigo-500 hover:underline'>Coures</Link> 
          </div>
        </div>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
        </Button>
        <div className="px-8 flex items-center justify-end"> {/* Adjusted position to end */}
          <Link
            to='/'
            className='self-center text-xl font-semibold text-indigo-500 dark:text-white'
          >
            <img src="Company/R.png" alt="logo" className="w-24 " />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
