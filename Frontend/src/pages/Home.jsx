import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Clear token and user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("resetEmail"); // Clean up any leftover reset email
    setIsLoggedIn(false);
    setMenuOpen(false); // Close mobile menu on logout
    navigate("/login");
  };

  return (
    <div className="font-sans w-full">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 py-3 md:px-8 w-full">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <FaPaperPlane size={24} className="text-black" />
            <span className="text-xl font-bold text-black">Foliana</span>
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
            <ul className="flex gap-6 text-gray-700">
              <li className="hover:text-green-600 text-green-700">Home</li>
              <li className="hover:text-green-600">Books</li>
              <li className="hover:text-green-600">Authors</li>
              <li className="hover:text-green-600">Genres</li>
              <li className="hover:text-green-600 bg-green-100 px-3 py-1 rounded-full">
                Shop
              </li>
            </ul>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex gap-4 items-center">
                <button
                  onClick={handleLogout}
                  className="hidden md:block bg-blue-600 text-white px-4 py-1 rounded-full"
                >
                  Logout
                </button>
                <FaShoppingCart size={20} className="text-black cursor-pointer" />
                <FaUserCircle size={24} className="text-black cursor-pointer" />
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition space-x-1"
              >
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 flex flex-col space-y-3">
            <a href="#" className="text-gray-600 hover:text-green-700">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-green-700">
              Books
            </a>
            <a href="#" className="text-gray-600 hover:text-green-700">
              Authors
            </a>
            <a href="#" className="text-gray-600 hover:text-green-700">
              Genres
            </a>
            <button className="bg-green-100 text-green-800 px-4 py-2 rounded-full hover:bg-green-200 transition w-max">
              Shop
            </button>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-4 py-2 rounded-full w-max hover:bg-blue-700 transition"
              >
                <FiLogOut className="inline-block mr-1" /> Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition w-max"
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-[#e3eae6] flex items-center justify-center flex-col text-center py-24 w-full">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to</h1>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Book Shop</h2>
        <p className="text-gray-600 max-w-xl mb-6">
          Discover a world of literary treasures and explore our vast selection of books
        </p>
        <button className="bg-[#f29d7e] text-white px-6 py-2 rounded-full text-lg">
          Shop Now
        </button>
      </section>
    </div>
  );
}