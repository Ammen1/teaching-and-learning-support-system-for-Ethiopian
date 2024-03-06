import heroAnimation from '../animation/Animation 7.json';
import Lottie from "lottie-react";


// react icons
import { FaArrowRight } from "react-icons/fa6";

const Review = () => {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-6 py-16 flex items-center justify-between gap-10 flex-col md:flex-row">
      <div className="w-full md:w-[45%]">
        <h2 className="text-[20px] md:text-[30px] font-[700] text-textColor">
          What our Students Say?
        </h2>
        <p className="text-[14px] md:text-[18px] font-[500] text-textColor my-4">
          We have got students from all over the world. And day by day our
          learning community has become bigger, students can give their review
          from anywhere anytime here..
        </p>

        <p className="text-[14px] md:text-[18px] font-[500] text-textColor">
          What do you think about us ?
        </p>

        <div className="border border-[#228be6] rounded-md p-4 mt-8 w-full md:w-[70%]">
          <div className=" relative">
            <p className="text-[14px] md:text-[18px] font-[500] text-[#228be6]">
              Write Your Review
            </p>
            <button className="py-4 md:py-5 px-8 rounded-full text-[#fff] bg-[#228be6] absolute top-[-18px] right-[-35px]">
              <FaArrowRight className="text-[1.5rem]" />
            </button>
          </div>
        </div>
      </div>
      <Lottie
        animationData={heroAnimation}
        loop
        autoplay
        style={{ width: '100%', maxWidth: '600px' }}
      />
    </section>
  );
};

export default Review;
