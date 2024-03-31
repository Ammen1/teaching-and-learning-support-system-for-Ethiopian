import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Footer from "./Components/Footer";
import SignIn from './pages/SignIn';

import Dashboard from './pages/Dashboard';
import DashUsers from './Components/DashUsers';
import PrivateRoute from "./Components/PrivateRoute"
import Navbar from './Components/Navbar';
import SignUp from './pages/SignUp';
import SingleCoursePage from './Components/CoureseSingle';




export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course/:slug' element={<SingleCoursePage />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
