import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Footer from "./Components/Footer";
import SignIn from './pages/SignIn';
import Navbar from './Components/Navbar';
import ScrollToTop from './Components/ScrollToTop';
import Dashboard from './pages/Dashboard';




export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/dashboard' element= { <Dashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
