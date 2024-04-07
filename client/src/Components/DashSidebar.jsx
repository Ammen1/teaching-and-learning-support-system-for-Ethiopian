import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { Sidebar } from 'flowbite-react';
import { 
  HiUser, 
  HiArrowSmRight, 
  HiChartPie, 
  HiPlus 
} from 'react-icons/hi';

const DashboardSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/account/logout/', {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLabelBasedOnRole = () => {
    const roleLabels = {
      'Admin': 'Admin',
      'Student': 'Student',
      'Lecturer': 'Lecturer',
      'Parent': 'Parent',
      'Unknown': 'Unknown Role'
    };
    return roleLabels[currentUser.user_role] || roleLabels['Unknown'];
  };

  return (
    <Sidebar className=" ">
      <Sidebar.Items className=' '>
        <Sidebar.ItemGroup className="flex flex-col gap-1 ">
          {currentUser.user_role === 'Admin' && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={getLabelBasedOnRole()}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.user_role === 'Admin' && (
            <Link to="/dashboard?tab=staffAdd">
              <Sidebar.Item
                active={tab === 'staffAdd' || !tab}
                icon={HiPlus}
                as="div"
              >
                StaffAdd
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.user_role === 'Admin' && (
            <Link to="/dashboard?tab=addstudents">
              <Sidebar.Item
                active={tab === 'addstudents' || !tab}
                icon={HiPlus}
                as="div"
              >
                AddStudent
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashboardSidebar;
