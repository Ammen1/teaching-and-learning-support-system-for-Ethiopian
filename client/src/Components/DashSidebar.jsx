import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie, HiBell, HiOutlineBadgeCheck, HiEmojiHappy, HiPlus } from 'react-icons/hi';
import { MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp, MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowUp, MdOutlineKeyboardDoubleArrowDown } from 'react-icons/md';
import { Sidebar } from 'flowbite-react';

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
      const res = await fetch('/api/user/signout', {
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
    if (currentUser.is_superuser) {
      return 'Admin';
    } else if (currentUser.is_student) {
      return 'Student';
    } else if (currentUser.is_lecturer) {
      return 'Lecturer';
    } else if (currentUser.is_parent) {
      return 'Parent';
    } else {
      return 'Unknown Role';
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
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
          {/* Add more sidebar items based on user roles */}
          {/* Example: currentUser.is_student && (<Link ...></Link>) */}
          {/* Example: currentUser.is_lecturer && (<Link ...></Link>) */}
          {/* Example: currentUser.is_parent && (<Link ...></Link>) */}
          {/* Example: currentUser.is_superuser && (<Link ...></Link>) */}
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
