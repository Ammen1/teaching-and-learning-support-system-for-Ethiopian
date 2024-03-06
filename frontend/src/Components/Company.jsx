

const Company = () => {
  return (
    <section className="w-full max-w-[1600px] mx-auto py-8 px-6">
      <div className="shadow-company flex items-center justify-center flex-col py-8 px-3 md:px-0">
        <p className="text-[16px] text-center md:text-start md:text-[20px] text-textColor font-[500] mb-5">
          Trusted By 400+ Companies Around The World
        </p>
        <div className="flex items-center gap-8 md:gap-16 overflow-y-scroll md:overflow-y-hidden">
          <img
            src="/Company/OIP.jpg"
            alt="company"
            className="w-[40px] md:w-[70px] rounded-full"
          />
          <img
            src="/Company/4.png"
            alt="company"
            className="w-[40px] md:w-[70px] rounded-full"
          />
          <img
            src="/Company/4.png"
            alt="company"
            className="w-[40px] md:w-[70px] rounded-full"
          />
          <img
            src="/Company/2.jpg"
            alt="company"
            className="w-[40px] md:w-[70px] rounded-full"
          />
                    <img
            src="/Company/4.png"
            alt="company"
            className="w-[40px] md:w-[70px] rounded-full"
          />
          <img
            src="/Company/2.jpg"
            alt="company"
            className="w-[40px] md:w-[70px] rounded-full"
          />
          
        </div>
      </div>
    </section>
  );
};

export default Company;
