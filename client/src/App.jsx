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
import CourseCategory from './Components/CourseCategory';
import PaymentSuccessPage from './Components/PaymentSuccessPag';
import ForgotPasswordForm from './pages/ForgetPassword';
import ResetPasswordForm from './pages/ResetPasswordForm';
import PasswordResetComplete from './Components/PasswordResetComplete';
import UploadFiles from './Components/Books';
import QuizList from './Components/QuizList';
import QuizDetailForm from './Components/QuizDetailForm';
import Quiz from './Components/Quiz';
import QuestionComponent from './Components/QuestionComponent';




export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/courses' element={<CourseCategory />} />
        <Route path='/payment-success/:trx_ref' element={<PaymentSuccessPage />} />
        <Route path='/course/:slug' element={<SingleCoursePage />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/books' element={<UploadFiles />} />
        <Route path='/quizs' element={<QuizList />} />
        {/* <Route path="/quiz/:id" element={<QuizDetailForm />} />QuestionComponent */}
        <Route path="/quiz/:id" element={<QuestionComponent />} />

        <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordForm />} />
        <Route path="/reset-password/complete" element={<PasswordResetComplete />} />
        <Route exact path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
