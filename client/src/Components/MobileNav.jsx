import { useEffect, useState } from "react";

// react icons
import { IoIosArrowDown } from "react-icons/io";
import { RiMenu3Line } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";

const MobileNav = () => {
  const [scrolling, setScrolling] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      <nav
        className={`${
          scrolling && "backdrop-blur-lg shadow-md"
        } sticky top-0 left-0 w-full max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between gap-5 z-50 md:hidden`}
      >    
                      <img src="Company/R.png"  alt="logo" className="w-[150px]"/>       <RiMenu3Line 
          className="text-[1.5rem] text-textColor"
          onClick={() => setIsOpen(true)}
        />
      </nav>
      <ul
        className={`${
          isOpen
            ? " translate-x-0 opacity-100"
            : " translate-x-[400px] opacity-0"
        } transition-all duration-300 flex items-center gap-8 font-[500] text-textColor flex-col fixed top-0 right-0 h-screen overflow-y-scroll w-[70%] bg-[#ffff] z-50`}
      >
        <div className="flex items-end justify-end p-6 w-full">
          <RxCross1
            className="text-[1.2rem]"
            onClick={() => setIsOpen(false)}
          />
        </div>
        <li>
          <a href="#home">Home</a>
        </li>
        <li className=" overflow-hidden hover:overflow-visible group relative">
          <a href="#Courses" className="flex items-center gap-3">
            Courses{" "}
            <IoIosArrowDown className=" group-hover:rotate-[180deg] transition-all duration-300" />
          </a>

          <div className="flex flex-col gap-5 w-[250px] shadow-drop p-6 translate-y-[100px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 z-50 transition-all duration-300 absolute top-[25px] left-[-80px] bg-[#fff]">
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
          <div className="flex flex-col gap-5 w-[250px] shadow-drop p-6 translate-y-[100px] opacity-0 z-50 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute top-[25px] left-[-80px] bg-[#fff]">
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

        <button className="py-2 px-6 bg-brandColor rounded-md text-[#fff]">
          Sign Up
        </button>
      </ul>
    </>
  );
};

export default MobileNav;
