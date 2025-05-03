import React from "react";
import { FaPaperPlane, FaShoppingCart, FaUserCircle } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="font-sans w-full">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 shadow-md bg-white w-full">
        <div className="text-2xl font-bold flex items-center gap-2">
          <FaPaperPlane size={24} className="text-black" />
          <span>Foliana</span>
        </div>
        <ul className="flex gap-6 text-gray-700">
          <li className="hover:text-green-600 text-green-600">Home</li>
          <li className="hover:text-green-600">Books</li>
          <li className="hover:text-green-600">Authors</li>
          <li className="hover:text-green-600">Genres</li>
          <li className="hover:text-green-600 bg-green-100 px-3 py-1 rounded-full">Shop</li>
        </ul>
        <div className="flex gap-4 items-center">
          <button className="bg-blue-600 text-white px-4 py-1 rounded-full">Logout</button>
          <FaShoppingCart size={20} className="text-black cursor-pointer" />
          <FaUserCircle size={24} className="text-black cursor-pointer" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#e3eae6] flex items-center justify-center flex-col text-center py-24 w-full">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to</h1>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Book Shop</h2>
        <p className="text-gray-600 max-w-xl mb-6">
          Discover a world of literary treasures and explore our vast selection of books
        </p>
        <button className="bg-[#f29d7e] text-white px-6 py-2 rounded-full text-lg">Shop Now</button>
      </section>
    </div>
  );
}