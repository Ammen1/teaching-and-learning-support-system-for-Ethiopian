import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaSkype,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full max-w-[1600px] mx-auto px-6 bg-[#228be6] border border-t-8 border-teal-500 py-12 text-[#fff]">
      <div className="flex justify-between gap-12 flex-col md:flex-row">
        <div className="w-full md:w-[30%]">
        <h1  alt="logo" className="rounded-full text-center" ><span className="py-2 px-6 bg-[#228be6] rounded-lg text-white">TEACHING</span>SUPPORT</h1>

          <p className="text-[14px] font-[400] my-4">
            It’s an e-learning website where we aim to provide the best quality
            education with best instructors. We also provide the 24 hour support
            to our learners & give back their feedback.
          </p>
          <h3 className="text-[18px] font-[700] mb-4">
            Connect with us on Social Media Platforms
          </h3>
          <div className="flex items-center gap-6">
            <FaFacebookF className="text-[1.5rem]" />
            <FaInstagram className="text-[1.5rem]" />
            <FaLinkedinIn className="text-[1.5rem]" />
            <FaSkype className="text-[1.5rem]" />
          </div>
        </div>

        <div className="flex justify-between w-full md:w-[60%] flex-col md:flex-row gap-8">
          <div className="flex  flex-col gap-3">
            <h3 className="text-[20px] font-[700]">Company</h3>
            <p className="hover:text-brandColor transition-all duration-300 cursor-pointer">
              About Us
            </p>
            <p className="hover:text-brandColor transition-all duration-300 cursor-pointer">
              Address
            </p>
            <p className="hover:text-brandColor transition-all duration-300 cursor-pointer">
              Our Services
            </p>
            <p className="hover:text-brandColor transition-all duration-300 cursor-pointer">
              Pricing
            </p>
          </div>

          <div className="flex  flex-col gap-3">
            <h3 className="text-[20px] font-[700]">Customer Sevice</h3>
            <p className="hover:text-brandColor transition-all duration-300 cursor-pointer">
              Contact Us
            </p>
            <p className="hover:text-brandColor transition-all duration-300 cursor-pointer">
              My Account
            </p>
            <p className="hover:text-brandColor transition-all duration-300 cursor-pointer">
              Community
            </p>
            <p className="hover:text-brandColor transition-all duration-300 cursor-pointer">
              Cancellation options
            </p>
          </div>

          <div className="flex  flex-col gap-3">
            <h3 className="text-[20px] font-[700]">Support</h3>
            <p className="hover:text-brandColor transition-all duration-300 cursor-pointer">
              Terms of Use
            </p>
            <p className="hover:text-brandColor transition-all duration-300 cursor-pointer">
              Privacy Policy
            </p>
            <p className="hover:text-brandColor transition-all duration-300 cursor-pointer">
              Afflifiates
            </p>
            <p className="hover:text-brandColor transition-all duration-300 cursor-pointer">
              Help & Support
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[2px] bg-[#fff] my-6"></div>
      <p className="text-center w-full">
        Copyright @TEACHING <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">SUPPORT</span>. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
