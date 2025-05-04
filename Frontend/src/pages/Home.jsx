import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './Layout/Navbar'; 
import Footer from './Layout/Footer';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
  }, []);

  const handleLogout = () => {
    // Clear token and user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("resetEmail"); // Clean up any leftover reset email
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="font-sans w-full">
      {/* Use the existing Navbar component */}
      <Navbar />

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