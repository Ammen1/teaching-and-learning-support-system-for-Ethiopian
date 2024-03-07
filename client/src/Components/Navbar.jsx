import React, { useEffect, useState } from "react";
import { Button, Navbar as FlowBiteNavbar, TextInput, Dropdown, Avatar } from 'flowbite-react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import { FaSun, FaMoon } from 'react-icons/fa';
import { toggleTheme } from '../redux/theme/themeSlice';
import { useSelector, useDispatch } from 'react-redux';

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignout = () => {
    // Implement signout logic here
  };

  return (
    <FlowBiteNavbar
      className={`${
        scrolling ? "scrolled" : ""
      } border-b-2 p-2  sm:block hidden `}
    >
      <div className="flex items-center mr-16">
        <Link
          to='/'
          className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
        >
          <img src="Company/R.png" alt="logo" className="w-[150px] px-2 py-1 bg-gradient-to-r from-indigo-500 rounded-lg" />
        </Link>
        <form className=" ml-56">
          <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
          />
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
        </Button>
      </div>
    </FlowBiteNavbar>
  );
};

export default Navbar;
