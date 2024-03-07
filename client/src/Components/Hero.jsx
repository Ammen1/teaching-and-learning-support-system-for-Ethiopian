import Lottie from "lottie-react";
import heroAnimation from '../animation/Animation 2.json';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "flowbite-react";

const Hero = () => {
  return (
    <header className="flex items-center justify-between gap-8 w-full max-w-[1600px] mx-auto px-6 py-6 md:py-16 flex-col md:flex-row">
      <div>
        <h1 className=" text-textColor font-[700] text-[35px] md:text-[60px] leading-[3rem] md:leading-[4.5rem]">
          <span className="text-[#228be6]">Studying Online</span> Is Much
          Easier Now!
        </h1>
        <p className="text-[16px] md:text-[20px] font-[500] text-textColor mt-3 w-full md:w-[50%]">
        Your E-Learning Platform Unlock the Power of Education in Ethiopia!
        </p>

        <div className="flex items-center gap-5 mt-8">
          <button className="">
            
          </button>
          <Link to='/sign-in'>
          <Button gradientDuoTone='purpleToBlue' className="border-2 py-2 px-2 bg-[#228be6] rounded-md text-[#fff]">
          Get Started
          </Button>
        </Link>
        {/* <Link to='/sign-in'>
          <Button gradientDuoTone='purpleToBlue' className="border-2 py-2 px-2 bg-[#228be6] rounded-md text-[#fff]">
          Try Free
          </Button>
        </Link> */}

        </div>
      </div>

      <Lottie
        animationData={heroAnimation}
        loop
        autoplay
        style={{ width: '80%', maxWidth: '600px' }} className=" rounded-lg overflow-hidden bg-cover"
      />
    </header>
  );
};

export default Hero;
