import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBook from "./pages/AdminBook";
import Inventory from "./pages/Inventory";
import Discounts from "./pages/Discounts";
import Announcements from "./pages/Announcements";
import AdminOrders from "./pages/AdminOrders";
import AdminReview from "./pages/AdminReview";
import AdminSettings from "./pages/AdminSettings";
import './App.css'
import Home from './pages/Home';
import ProtectedRoute from "./Components/ProtectedRoute";
import Navbar from "./pages/Layout/Navbar";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import OtpVerification from "./pages/Auth/OtpVerification";
import NewPassword from "./pages/Auth/NewPasswordStep";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/navbar" element={<Navbar/>} />
        <Route path="/forgotpassword" element={<ForgotPassword/>} />
        <Route path="/otpverification" element={<OtpVerification/>} />
        <Route path="/newpassword" element={<NewPassword/>} />

      <Route path ="/dashboard" element ={<AdminDashboard/> }/>
      <Route path ="/adminBook" element ={<AdminBook/> }/>
      <Route path ="/inventory" element ={<Inventory/> }/>
      <Route path ="/discounts" element ={<Discounts/> }/>
      <Route path ="/announcements" element ={<Announcements/> }/>
      <Route path ="/adminOrders" element ={<AdminOrders/> }/>
      <Route path ="/adminReview" element ={<AdminReview/> }/>
      <Route path ="/adminsettings" element ={<AdminSettings/> }/>

      </Routes>
    </Router>
  )
}

export default App
