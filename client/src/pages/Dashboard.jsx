import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashProfile from '../Components/DashProfile';
import DashPosts from '../Components/DashPosts';
import DashUsers from '../Components/DashUsers';
import DashComments from '../Components/DashComments';
import DashboardComp from '../Components/DashboardComp';
import Courses from './Courses';

import Resources from '../Components/Resources';
import DashboardSidebar from '../Components/DashSidebar';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row  '>
      <div className='md:w-56'>
        <DashboardSidebar />
      </div>
   
      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}
      {tab === 'users' && <DashUsers />}
      {tab === 'comments' && <DashComments />}   
      {tab === 'dash' && <DashboardComp />}
      {tab === 'course' && <Courses />}
      {tab === 'resources' && <Resources />}
    </div>
  );
}
