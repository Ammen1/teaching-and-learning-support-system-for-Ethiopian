import { useEffect, useState } from "react";
import { Button, Card } from 'flowbite-react';

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
    <nav
      className={`${
        scrolling && "backdrop-blur-lg shadow-md"
      } sticky top-0 left-0 w-full max-w-[1600px] mx-auto px-6 py-4 items-center justify-between gap-5 z-50 hidden md:flex`}
    >
      <h1  alt="logo" className="rounded-full text-center" ><span className="py-2 px-6 bg-[#228be6] rounded-lg text-white">TEACHING</span>SUPPORT</h1>
      <ul className="flex items-center gap-12 font-[500] text-textColor z-50">
        <li>
          <a href="#home">Home</a>
        </li>
        <li className=" overflow-hidden hover:overflow-visible group relative">
          <a href="#Courses" className="flex items-center gap-3">
            Courses{" "}
            <IoIosArrowDown className=" group-hover:rotate-[180deg] transition-all duration-300" />
          </a>

          <div className="flex flex-col gap-5 w-[250px] shadow-drop p-6 translate-y-[100px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute top-[25px] left-0 bg-[#fff]">
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
        </li>
        <li className=" overflow-hidden hover:overflow-visible group relative">
          <a href="#Article" className="flex items-center gap-3">
            Articles
            <IoIosArrowDown className=" group-hover:rotate-[180deg] transition-all duration-300" />
          </a>
          <div className="flex flex-col gap-5 w-[250px] shadow-drop p-6 translate-y-[100px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute top-[25px] left-0 bg-[#fff]">
            <p className="hover:text-brandColor hover:tracking-wider transition-all duration-300 cursor-pointer">
              Web Development
            </p>
            <p className="hover:text-brandColor hover:tracking-wider transition-all duration-300 cursor-pointer">
              Website SEO
            </p>
            <p className="hover:text-brandColor hover:tracking-wider transition-all duration-300 cursor-pointer">
              System Design
            </p>
            <p className="hover:text-brandColor hover:tracking-wider transition-all duration-300 cursor-pointer">
              Remote Job
            </p>
          </div>
        </li>
        <li>
          <a href="#Support">Support</a>
        </li>

        <Button className=" bg-[#228be6] rounded-md text-[#fff]">
          Sign Up
        </Button>
      </ul>
    </nav>
  );
};

export default Navbar;
