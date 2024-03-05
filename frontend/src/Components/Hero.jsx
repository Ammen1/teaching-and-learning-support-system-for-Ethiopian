import Lottie from "lottie-react";
import heroAnimation from '../animation/Animation 2.json';

const Hero = () => {
  return (
    <header className="flex items-center justify-between gap-8 w-full max-w-[1600px] mx-auto px-6 py-6 md:py-16 flex-col md:flex-row">
      <div>
        <h1 className=" text-textColor font-[700] text-[35px] md:text-[60px] leading-[3rem] md:leading-[4.5rem]">
          <span className="text-[#228be6]">Studying Online</span> Is Much
          Easier Now!
        </h1>
        <p className="text-[16px] md:text-[20px] font-[500] text-textColor mt-3 w-full md:w-[50%]">
          This is the future of learning. Learn right & Grow!
        </p>

        <div className="flex items-center gap-5 mt-8">
          <button className="py-2 px-6 bg-[#228be6] rounded-md text-[#fff]">
            Get Started
          </button>
          <button className="py-2 px-6 border bg-[#228be6] rounded-md  text-white">
            Try Free
          </button>
        </div>
      </div>

      <Lottie
        animationData={heroAnimation}
        loop
        autoplay
        style={{ width: '100%', maxWidth: '600px' }}
      />
    </header>
  );
};

export default Hero;
