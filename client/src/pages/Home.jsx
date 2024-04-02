
// all components

import Hero from "../Components/Hero";
import CourseOutlet from "../Components/CourseOutlet";
import Status from "../Components/Status";
import CourseCategory from "../Components/CourseCategory";
import JoinCommunity from "../Components/JoinCommunity";
import Review from "../Components/Review";
import Support from "../Components/Support";
import MobileNav from "../Components/MobileNav";


const App = () => {
  return (
    <div className=" dark:bg-white"> 
      <MobileNav />
      <Hero />
      <CourseOutlet />
      <Status />
      <JoinCommunity />
      <Review />
      <Support />
    </div>
  );
};

export default App;
