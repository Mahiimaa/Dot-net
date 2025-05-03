import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminBook from './pages/AdminBook';
import Inventory from './pages/Inventory';
import Discounts from './pages/Discounts';
import Announcements from './pages/Announcements';
import AdminOrders from './pages/AdminOrders';
import AdminReview from './pages/AdminReview';
import AdminSettings from './pages/AdminSettings';
import Home from './pages/Home';
import Navbar from './pages/Layout/Navbar';
import ForgotPassword from './pages/Auth/ForgotPassword';
import OtpVerification from './pages/Auth/OtpVerification';
import NewPassword from './pages/Auth/NewPasswordStep';
import Book from './pages/Book';
import './App.css';
import { useContext } from 'react';


const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/otpverification" element={<OtpVerification />} />
          <Route path="/newpassword" element={<NewPassword />} />
          <Route path="/book" element={<Book />} />

          {/* Admin routes with ProtectedRoute */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminBook"
            element={
              <ProtectedRoute adminOnly>
                <AdminBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute adminOnly>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discounts"
            element={
              <ProtectedRoute adminOnly>
                <Discounts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute adminOnly>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminOrders"
            element={
              <ProtectedRoute adminOnly>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminReview"
            element={
              <ProtectedRoute adminOnly>
                <AdminReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminsettings"
            element={
              <ProtectedRoute adminOnly>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;