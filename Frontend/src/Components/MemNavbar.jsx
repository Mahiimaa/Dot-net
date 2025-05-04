// import React from "react";
// import { useNavigate } from "react-router-dom";

// const MemberNavbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {

//     if (window.confirm("Are you sure you want to logout?")) {
//       localStorage.removeItem("token");
//       navigate("/register");
//     }
//   };

//   return (
//     <header className="flex items-center justify-between mb-8">
//       <h1 className="text-2xl font-bold text-gray-800">Foliana</h1>
//       <nav className="flex space-x-6 text-gray-600">
//         <a href="#">Home</a>
//         <a href="#">Books</a>
//         <a href="#">Authors</a>
//         <a href="#">Genres</a>
//         <button className="bg-green-100 text-green-700 px-4 py-1 rounded-full">
//           Shop
//         </button>
//         <button
//           onClick={handleLogout}
//           className="bg-blue-500 text-white px-4 py-1 rounded-full"
//         >
//           Logout
//         </button>
//         <div className="w-6 h-6 bg-black rounded-full"></div>
//       </nav>
//     </header>
//   );
// };

// export default MemberNavbar;

import React from "react";
import { useNavigate } from "react-router-dom";

const MemberNavbar = () => {
  const navigate = useNavigate();

  // Assuming user image URL is stored in localStorage (you can adjust this)
  const userProfileImage = localStorage.getItem("profileImage");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("profileImage"); // also clear profile image if needed
      navigate("/register");
    }
  };

  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold text-gray-800">Foliana</h1>
      <nav className="flex items-center space-x-6 text-gray-600">
        <a href="#">Home</a>
        <a href="#">Books</a>
        <a href="#">Authors</a>
        <a href="#">Genres</a>
        <button className="bg-green-100 text-green-700 px-4 py-1 rounded-full">
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
            U
          </div>
        )}
      </nav>
    </header>
  );
};

export default MemberNavbar;
