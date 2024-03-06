import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Footer from "./Components/Footer";
import SignIn from './pages/SignIn';
import Navbar from './Components/Navbar';





export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
