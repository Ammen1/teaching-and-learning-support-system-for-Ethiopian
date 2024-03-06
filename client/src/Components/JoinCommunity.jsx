
import heroAnimation from '../animation/Animation 4.json';
import Lottie from "lottie-react";
const JoinCommunity = () => {
  return (
    <section className="w-full my-10 md:my-16 bg-[#F1F7FF] overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-6 py-8 md:py-24 flex items-center justify-between gap-10 flex-col md:flex-row">
      <Lottie
        animationData={heroAnimation}
        loop
        autoplay
        style={{ width: '100%', maxWidth: '600px' }}
      />

        <div className="w-full md:w-[45%]">
          <h2 className="text-[20px] md:text-[30px] font-[700] text-[#228be6]">
            Let’s Study Together
          </h2>
          <p className="text-[14px] md:text-[18px] font-[500] text-textColor mt-3 mb-8">
            We aim to provide you the best quality education & scope for
            betterment. Join now & make your own study group to grow together &
            build community.
          </p>
          <button className="py-3 px-6 bg-[#228be6] rounded-md text-[#fff]">
            Join Community
          </button>
        </div>
      </div>
    </section>
  );
};

export default JoinCommunity;
