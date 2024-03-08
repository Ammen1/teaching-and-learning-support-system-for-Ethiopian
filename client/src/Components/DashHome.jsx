import DashSidebar from './DashSidebar';
import Header from './Header';
import ThemeProvider from "../Components/ThemeProvider.jsx";
import Courses from '../pages/Courses';
import PostPage from '../pages/PostPage';

export default function DashHome() {
  return (
    <> 
    <ThemeProvider>
      <Header />
      <DashSidebar />
    </ThemeProvider>
    </>
  );
};





