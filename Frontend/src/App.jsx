import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { SignalRProvider } from './context/SignalRContext';
import { useContext } from 'react';
import ProtectedRoute from './Components/ProtectedRoute';
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
import BookList from './pages/BookList';
import Layout from './pages/Layout/layout';
import ForgotPassword from './pages/Auth/ForgotPassword';
import OtpVerification from './pages/Auth/OtpVerification';
import NewPassword from './pages/Auth/NewPasswordStep';
import BookDetail from './pages/BookDetail';
import Authors from './pages/Authors';
import Account from './pages/Members/Account';
import Wishlist from './pages/Members/Wishlist';
import Order from './pages/Members/Order';
import AddCart from './pages/Members/AddCart';
import Settings from './pages/Members/Settings';
import Genres from './pages/Genres';
import Book from './pages/Book';
import Review from './pages/Members/Review';
import Reviews from './pages/Review';
import StaffOrderPortal from './pages/StaffOrderPortal';
import BroadcastMessages from './Components/BroadcastMessages';
import './App.css';

function RoutesWithNotifications() {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Routes where BroadcastMessages should not appear
  const excludedRoutes = [
    '/login',
    '/register',
    '/forgotpassword',
    '/otpverification',
    '/newpassword',
  ];

  // Check if current route is excluded
  const isExcludedRoute = excludedRoutes.includes(location.pathname);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />} />
        <Route path="/BookList" element={<BookList />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/otpverification" element={<OtpVerification />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/book" element={<Book />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/review" element={<Review />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/account" element={<Account />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/order" element={<Order />} />
        <Route path="/staff/orders" element={<StaffOrderPortal />} />
        <Route path="/addcart" element={<AddCart />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />

        {/* Admin Routes (Protected) */}
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
      {/* Show BroadcastMessages only for non-admin/staff authenticated users on non-excluded routes */}
      {!loading && isAuthenticated && user && user.role !== 'Admin' && user.role !== 'Staff' && !isExcludedRoute && (
        <BroadcastMessages />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <SignalRProvider>
        <Router>
          <RoutesWithNotifications />
        </Router>
      </SignalRProvider>
    </AuthProvider>
  );
}

export default App;