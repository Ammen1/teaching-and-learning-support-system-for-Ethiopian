import { useEffect, useState } from "react";
import { Button, Navbar as FlowBiteNavbar } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// react icons
import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <FlowBiteNavbar
      className={`${
        scrolling && "backdrop-blur-lg shadow-md"
      } sticky top-0 left-0 w-full max-w-[1600px] mx-auto px-6 py-4  z-50 hidden md:flex shadow-lg`}

    >
      
      <div className="flex items-center mr-16">
      <img src="Company/R.png"  alt="logo" className="w-[150px] mr-40"/> 
        <a href="#home" className="ml-6 text-textColor hover:text-brandColor transition-all duration-300">Home</a>
        <div className="ml-6 overflow-hidden hover:overflow-visible group relative">
          <a href="#Courses" className="flex items-center gap-3 text-textColor hover:text-brandColor transition-all duration-300">
            Courses{" "}
            <IoIosArrowDown className=" group-hover:rotate-[180deg] transition-all duration-300" />
          </a>

          <div className="flex flex-col gap-3 w-[200px] shadow-drop p-4 translate-y-[100px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute top-[25px] left-0 bg-[#fff]">
            <p className="hover:text-brandColor hover:tracking-wider transition-all duration-300 cursor-pointer">
              Web Development
            </p>
            <p className="hover:text-brandColor hover:tracking-wider transition-all duration-300 cursor-pointer">
              Machine Learning
            </p>
            <p className="hover:text-brandColor hover:tracking-wider transition-all duration-300 cursor-pointer">
              UI/UX Design
            </p>
            <p className="hover:text-brandColor hover:tracking-wider transition-all duration-300 cursor-pointer">
              AI Robotics
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center  ml-96 translate-x-18 ">
        <Link to='/sign-in' className="mr-6 w-full">
          <Button className=" bg-brandColor rounded-md text-[#fff]">
            Sign Up
          </Button>
        </Link>
      </div>
    </FlowBiteNavbar>
  );
};

export default Navbar;
