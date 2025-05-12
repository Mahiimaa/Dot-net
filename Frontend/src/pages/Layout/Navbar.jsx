import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { GiSpellBook } from "react-icons/gi";
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Clear token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('resetEmail'); // Clean up any leftover reset email
    setIsLoggedIn(false);
    setMenuOpen(false); // Close mobile menu on logout
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md px-4 py-3 md:px-8">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
        <GiSpellBook className="w-8 h-8 text-green-700" />
          <span className="text-xl font-bold text-green-700">Foliana</span>
        </div>

        {/* Hamburger - Mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 hover:text-black"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <a href="/" className={`text-gray-600 hover:text-green-700 transition ${
              isActive('/') ? 'text-green-700 font-semibold' : ''
            }`} > Home</a>
          <a href="/book" className={`text-gray-600 hover:text-green-700 transition ${
              isActive('/book') ? 'text-green-700 font-semibold' : ''
            }`}>Books</a>
          <a href="/authors" className={`text-gray-600 hover:text-green-700 transition ${
              isActive('/authors') ? 'text-green-700 font-semibold' : ''
            }`}>Authors</a>
          <a href="/genres" className={`text-gray-600 hover:text-green-700 transition ${
              isActive('/genres') ? 'text-green-700 font-semibold' : ''
            }`}>Genres</a>
          <a href="/aboutus" className={`text-gray-600 hover:text-green-700 transition ${
              isActive('/aboutus') ? 'text-green-700 font-semibold' : ''
            }`}> About US</a>
            <a
          className="bg-teal-100 text-teal-800 px-4 py-1 rounded-full hover:bg-teal-200 transition"
          href="/shop">
            Shop
          </a>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                className="hidden md:block bg-blue-900 text-white px-4 py-2 rounded-[10px] hover:bg-blue-800 transition"
              >
                Logout
              </button>
              <span className="p-2 bg-[brown] text-white rounded-[10px]" onClick={() => navigate('/addcart')}>
                <FiShoppingCart />
              </span>
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center border"
              onClick={() => navigate('/account')}
              >
                <FiUser className="text-gray-600" />
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center text-green-600 hover:text-green-700 transition space-x-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h14m-7-7l7 7-7 7"
                />
              </svg>
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col space-y-3">
         <a
            href="/"
            className={`text-gray-600 hover:text-green-700 transition ${
              isActive('/') ? 'text-green-700 font-semibold' : ''
            }`}
          >
            Home
          </a>
          <a
            href="/book"
            className={`text-gray-600 hover:text-green-700 transition ${
              isActive('/book') ? 'text-green-700 font-semibold' : ''
            }`}
          >
            Books
          </a>
          <a
            href="/authors"
            className={`text-gray-600 hover:text-green-700 transition ${
              isActive('/authors') ? 'text-green-700 font-semibold' : ''
            }`}
          >
            Authors
          </a>
          <a
            href="/genres"
            className={`text-gray-600 hover:text-green-700 transition ${
              isActive('/genres') ? 'text-green-700 font-semibold' : ''
            }`}
          >
            Genres
          </a>
          <a
            href="/aboutus"
            className={`text-gray-600 hover:text-green-700 transition ${
              isActive('/aboutus') ? 'text-green-700 font-semibold' : ''
            }`}
          >
            About Us
          </a>
          <a
         className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full hover:bg-teal这场-200 transition w-max"
          href="/shop">
            Shop
          </a>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-blue-900 text-white px-4 py-2 rounded-[10px] w-max hover:bg-blue-800 transition"
            >
              <FiLogOut className="inline-block mr-1" /> Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-900 text-white px-4 py-2 rounded-[10px] hover:bg-blue-800 transition w-max"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;