import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Footer from "./Components/Footer";
import SignIn from './pages/SignIn';
import ScrollToTop from './Components/ScrollToTop';
// import Dashboard from './pages/Dashboard';
import DashHome from './Components/DashHome';




export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/dashboard' element= { <DashHome />} />
      
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
