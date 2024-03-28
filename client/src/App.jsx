import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Footer from "./Components/Footer";
import SignIn from './pages/SignIn';
import ScrollToTop from './Components/ScrollToTop';
import Dashboard from './pages/Dashboard';
import DashUsers from './Components/DashUsers';
import PrivateRoute from "./Components/PrivateRoute"
import Navbar from './Components/Navbar';




export default function App() {
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
