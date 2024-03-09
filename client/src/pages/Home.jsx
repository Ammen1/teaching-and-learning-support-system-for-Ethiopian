
// all components

import Hero from "../Components/Hero";
import Company from "../Components/Company";
import CourseOutlet from "../Components/CourseOutlet";
import Status from "../Components/Status";
import Instructor from "../Components/Instructor";
import CourseCategory from "../Components/CourseCategory";
import JoinCommunity from "../Components/JoinCommunity";
import UpcomingWorkshop from "../Components/UpcomingWorkshop";
import Review from "../Components/Review";
import Support from "../Components/Support";
import MobileNav from "../Components/MobileNav";
import Navbar from '../Components/Navbar';
import { CiGlass } from "react-icons/ci";

const App = () => {
  return (
    <div className=" dark:bg-white"> 
      <Navbar />
      <MobileNav />
      <Hero />
      <Company />
      <CourseOutlet />
      <Status />
      <Instructor />
      <CourseCategory />
      <JoinCommunity />
      <UpcomingWorkshop />
      <Review />
      <Support />
    </div>
  );
};

export default App;
