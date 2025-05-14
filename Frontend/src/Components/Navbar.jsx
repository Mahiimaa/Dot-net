import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-6 w-6" />
        <span className="font-bold text-lg">Foliana</span>
      </div>

      {/* Menu */}
      <ul className="flex gap-6 text-gray-600">
        <li className="hover:text-black cursor-pointer">Home</li>
        <li className="hover:text-black cursor-pointer">Books</li>
        <li className="hover:text-black cursor-pointer">Authors</li>
        <li className="hover:text-black cursor-pointer">Genres</li>
        <li>
          <span className="bg-green-100 text-green-900 px-3 py-1 rounded-full font-medium">
            Shop
          </span>
        </li>
      </ul>

      {/* Login */}
      <div className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-black">
        <img src={loginIcon} alt="Login" className="h-5 w-5" />
        <span>Login</span>
      </div>
    </nav>
  );
};

export default Navbar;
