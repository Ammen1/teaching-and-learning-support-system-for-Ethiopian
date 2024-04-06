import React, { useEffect, useState } from "react";
import { Button, Navbar as FlowBiteNavbar, TextInput } from 'flowbite-react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import MobileNav from "./MobileNav";

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
    <nav className={`border-b-4 py-2 overflow-hidden ${scrolling ? 'bg-[#228be6]' : ''} w-full fixed lg:-translate-y-20`}>
      <div className="px-8 py-4 md:px-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link
            to='/'
            className='self-center text-xl font-semibold  text-black'
          >
           
            <span className="px-2 py-2 bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-900 rounded-lg text-white">
            Empowering
        </span>
        Ethiopian Education
          </Link>
          <div className={`lg:flex hidden gap-4 ${scrolling ? 'text-white' : 'text-gray-800'}`}> 
            <Link to='/home' className='hover:text-indigo-500 hover:underline'>Home</Link> 
            <Link to='/sign-in' className='hover:text-indigo-500 hover:underline'>Signin</Link> 
            <Link to='/about' className='hover:text-indigo-500 hover:underline'>About</Link> 
            <Link to='/courses' className='hover:text-indigo-500 hover:underline'>Courses</Link> 
            <Link to='/books' className='hover:text-indigo-500 hover:underline'>Books</Link> 
          </div>
        </div>
        <div className="px-8 flex items-center justify-end">
          <Button className='w-12 h-10 lg:hidden' color={scrolling ? 'gray' : 'indigo'} pill> 
            <MobileNav />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
