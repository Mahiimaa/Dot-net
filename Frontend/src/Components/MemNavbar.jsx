import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MemberNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout(); 
      navigate("/login"); // Redirect to login
    }
  };

  const userProfileImage = user?.profileImageUrl || localStorage.getItem("profileImage");
  const placeholderInitial = user?.firstName?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold text-gray-800">Foliana</h1>
      <nav className="flex items-center space-x-6 text-gray-600">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        
        {/* <Link to="/authors">Authors</Link> */}
        {/* <Link to="/genres">Genres</Link> */}
        <button
          onClick={() => navigate("/books")}
          className="bg-green-100 text-green-700 px-4 py-1 rounded-full"
        >
          Shop
        </button>
        <button
          onClick={handleLogout}
          className="bg-blue-500 text-white px-4 py-1 rounded-full"
        >
          Logout
        </button>
        {/* Profile Circle */}
        {userProfileImage ? (
          <img
            src={userProfileImage}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
            {placeholderInitial}
          </div>
        )}
      </nav>
    </header>
  );
};

export default MemberNavbar;