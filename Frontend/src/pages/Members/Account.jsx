// import React from "react";
// import profileImg from '../../assets/Profile.jpeg'; 

// const Wishlist = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <header className="flex items-center justify-between mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Foliana</h1>
//         <nav className="flex space-x-6 text-gray-600">
//           <a href="#">Home</a>
//           <a href="#">Books</a>
//           <a href="#">Authors</a>
//           <a href="#">Genres</a>
//           <button className="bg-green-100 text-green-700 px-4 py-1 rounded-full">Shop</button>
//           <button className="bg-blue-500 text-white px-4 py-1 rounded-full">Logout</button>
//           <div className="w-6 h-6 bg-black rounded-full"></div>
//         </nav>
//       </header>

//       {/* Main Content */}
//       <div className="flex gap-8">
//         {/* Left Profile */}
//         <div className="w-1/4 bg-white p-4 rounded-xl shadow">
//         <img
//             src={profileImg}
//             alt="Profile"
//             className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
//         />
//           <h2 className="text-center font-semibold text-lg">Prinsha Shresthaa</h2>
//           <p className="text-center text-sm text-gray-500">Member since April 3, 2012</p>
//           <p className="mt-2 text-center text-gray-600 text-sm">
//             Book enthusiast with a love for mystery novels and historical fiction.
//           </p>
//         </div>

//         {/* Right Content */}
//         <div className="w-3/4">
//           {/* Tabs */}
//           <div className="flex gap-4 mb-6">
//             {["Account Overview", "Orders", "Wishlist", "Reviews", "Settings"].map((tab) => (
//               <button
//                 key={tab}
//                 className={`px-4 py-2 rounded-full ${
//                   tab === "Account Overview" ? "bg-gray-200" : "text-gray-600"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-3 gap-4 mb-6">
//             <StatCard number="23" label="Books purchased" />
//             <StatCard number="5" label="Orders" />
//             <StatCard number="10%" label="Discount Earned" />
//           </div>

//           {/* Upcoming Pickups */}
//           <div className="bg-green-50 p-4 rounded-xl mb-6">
//             <h3 className="font-semibold text-lg mb-4">Upcoming Pickups</h3>
//             <PickupCard
//               title="The silent Patient"
//               author="Alex"
//               status="Ready for pickup"
//               date="Apr 30, 2025"
//               code="BN-1176"
//               badgeColor="green"
//             />
//             <PickupCard
//               title="Multiple Items"
//               author="Order #BK123"
//               status="Processing"
//               date="Apr 30, 2025"
//               badgeColor="orange"
//             />
//           </div>

//           {/* Recents */}
//           <div className="bg-white p-4 rounded-xl shadow">
//             <h3 className="font-semibold text-lg mb-4">Recents</h3>
//             <RecentItem icon="🛒" title="Order Placed" desc="You ordered The silent Patient" />
//             <RecentItem icon="%" title="Discount Earned" desc="Earned 10% discount for your next order" />
//             <RecentItem icon="❤️" title="Book Added to Wishlist" desc="Added 'Promised land' to your wishlist" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ number, label }) => (
//   <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
//     <div className="text-2xl font-bold">{number}</div>
//     <div className="text-sm text-gray-600">{label}</div>
//   </div>
// );

// const PickupCard = ({ title, author, status, date, code, badgeColor }) => (
//   <div className="flex items-center gap-4 mb-4 bg-white p-4 rounded-xl shadow">
//     <img
//       src="https://via.placeholder.com/60x90"
//       alt={title}
//       className="w-16 h-24 rounded object-cover"
//     />
//     <div className="flex-1">
//       <h4 className="font-semibold">{title}</h4>
//       <p className="text-sm text-gray-500">{author}</p>
//       <div className="flex items-center gap-2 mt-2">
//         <span
//           className={`text-xs font-medium px-2 py-1 rounded-full ${
//             badgeColor === "green"
//               ? "bg-green-100 text-green-700"
//               : "bg-orange-100 text-orange-700"
//           }`}
//         >
//           {status}
//         </span>
//         <span className="text-xs text-gray-500">Claim by: {date}</span>
//       </div>
//       {code && (
//         <div className="mt-2 text-xs text-gray-700">
//           Claim code: <span className="font-semibold">{code}</span>
//         </div>
//       )}
//     </div>
//   </div>
// );

// const RecentItem = ({ icon, title, desc }) => (
//   <div className="flex items-center gap-3 mb-2">
//     <div className="text-xl">{icon}</div>
//     <div>
//       <p className="font-medium text-sm">{title}</p>
//       <p className="text-xs text-gray-500">{desc}</p>
//     </div>
//   </div>
// );

// export default Wishlist;

// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import profileImg from "../../assets/Profile.jpeg"; 

// // const Wishlist = () => {
// //   const navigate = useNavigate();
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     const userData = localStorage.getItem("user");

// //     if (!token || !userData) {
// //       navigate("/login"); 
// //       return;
// //     }

// //     try {
// //       const parsedUser = JSON.parse(userData);
// //       setUser(parsedUser);
// //     } catch (err) {
// //       localStorage.clear(); 
// //       navigate("/login");
// //     }
// //   }, [navigate]);

// //   if (!user) return null; 
// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       {/* Header */}
// //       <header className="flex items-center justify-between mb-8">
// //         <h1 className="text-2xl font-bold text-gray-800">Foliana</h1>
// //         <nav className="flex space-x-6 text-gray-600">
// //           <a href="#">Home</a>
// //           <a href="#">Books</a>
// //           <a href="#">Authors</a>
// //           <a href="#">Genres</a>
// //           <button className="bg-green-100 text-green-700 px-4 py-1 rounded-full">Shop</button>
// //           <button
// //             onClick={() => {
// //               localStorage.clear();
// //               navigate("/login");
// //             }}
// //             className="bg-blue-500 text-white px-4 py-1 rounded-full"
// //           >
// //             Logout
// //           </button>
// //           <img
// //             src={profileImg}
// //             alt="Profile"
// //             className="w-6 h-6 rounded-full object-cover"
// //           />
// //         </nav>
// //       </header>

// //       <div className="flex gap-8">
// //         {/* Left Profile */}
// //         <div className="w-1/4 bg-white p-4 rounded-xl shadow">
// //           <img
// //             src={profileImg}
// //             alt="Profile"
// //             className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
// //           />
// //           <h2 className="text-center font-semibold text-lg">
// //             {user.firstName} {user.lastName}
// //           </h2>
// //           <p className="text-center text-sm text-gray-500">
// //             Member since {new Date(user.joinedDate || Date.now()).toLocaleDateString()}
// //           </p>
// //           <p className="mt-2 text-center text-gray-600 text-sm">
// //             Book enthusiast with a love for mystery novels and historical fiction.
// //           </p>
// //         </div>

// //         {/* Right Content */}
// //         <div className="w-3/4">
// //           <div className="flex gap-4 mb-6">
// //             {["Account Overview", "Orders", "Wishlist", "Reviews", "Settings"].map((tab) => (
// //               <button
// //                 key={tab}
// //                 className={`px-4 py-2 rounded-full ${
// //                   tab === "Account Overview" ? "bg-gray-200" : "text-gray-600"
// //                 }`}
// //               >
// //                 {tab}
// //               </button>
// //             ))}
// //           </div>

// //           <div className="grid grid-cols-3 gap-4 mb-6">
// //             <StatCard number="23" label="Books purchased" />
// //             <StatCard number="5" label="Orders" />
// //             <StatCard number="10%" label="Discount Earned" />
// //           </div>

// //           <div className="bg-green-50 p-4 rounded-xl mb-6">
// //             <h3 className="font-semibold text-lg mb-4">Upcoming Pickups</h3>
// //             <PickupCard
// //               title="The Silent Patient"
// //               author="Alex"
// //               status="Ready for pickup"
// //               date="Apr 30, 2025"
// //               code="BN-1176"
// //               badgeColor="green"
// //             />
// //             <PickupCard
// //               title="Multiple Items"
// //               author="Order #BK123"
// //               status="Processing"
// //               date="Apr 30, 2025"
// //               badgeColor="orange"
// //             />
// //           </div>

// //           <div className="bg-white p-4 rounded-xl shadow">
// //             <h3 className="font-semibold text-lg mb-4">Recents</h3>
// //             <RecentItem icon="🛒" title="Order Placed" desc="You ordered The Silent Patient" />
// //             <RecentItem icon="%" title="Discount Earned" desc="Earned 10% discount for your next order" />
// //             <RecentItem icon="❤️" title="Book Added to Wishlist" desc="Added 'Promised Land' to your wishlist" />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const StatCard = ({ number, label }) => (
// //   <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
// //     <div className="text-2xl font-bold">{number}</div>
// //     <div className="text-sm text-gray-600">{label}</div>
// //   </div>
// // );

// // const PickupCard = ({ title, author, status, date, code, badgeColor }) => (
// //   <div className="flex items-center gap-4 mb-4 bg-white p-4 rounded-xl shadow">
// //     <img
// //       src="https://via.placeholder.com/60x90"
// //       alt={title}
// //       className="w-16 h-24 rounded object-cover"
// //     />
// //     <div className="flex-1">
// //       <h4 className="font-semibold">{title}</h4>
// //       <p className="text-sm text-gray-500">{author}</p>
// //       <div className="flex items-center gap-2 mt-2">
// //         <span
// //           className={`text-xs font-medium px-2 py-1 rounded-full ${
// //             badgeColor === "green"
// //               ? "bg-green-100 text-green-700"
// //               : "bg-orange-100 text-orange-700"
// //           }`}
// //         >
// //           {status}
// //         </span>
// //         <span className="text-xs text-gray-500">Claim by: {date}</span>
// //       </div>
// //       {code && (
// //         <div className="mt-2 text-xs text-gray-700">
// //           Claim code: <span className="font-semibold">{code}</span>
// //         </div>
// //       )}
// //     </div>
// //   </div>
// // );

// // const RecentItem = ({ icon, title, desc }) => (
// //   <div className="flex items-center gap-3 mb-2">
// //     <div className="text-xl">{icon}</div>
// //     <div>
// //       <p className="font-medium text-sm">{title}</p>
// //       <p className="text-xs text-gray-500">{desc}</p>
// //     </div>
// //   </div>
// // );

// // export default Wishlist;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import SideProfile from "../../Components/SideProfile";
import MemNavbar from "../../Components/MemNavbar";

const Account = () => {
  const location = useLocation();

  const tabs = [
    { name: "Account Overview", path: "/account" },
    { name: "Orders", path: "/order" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Reviews", path: "/review" },
    { name: "Settings", path: "/setting" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Navbar */}
      <MemNavbar />

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Left Profile */}
        <SideProfile />

        {/* Right Content */}
        <div className="w-3/4">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                className={`pb-2 border-b-2 ${
                  location.pathname === tab.path
                    ? "border-brown-500 text-brown-700 font-medium"
                    : "text-gray-500"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard number="23" label="Books purchased" />
            <StatCard number="5" label="Orders" />
            <StatCard number="10%" label="Discount Earned" />
          </div>

          {/* Upcoming Pickups */}
          <div className="bg-green-50 p-4 rounded-xl mb-6">
            <h3 className="font-semibold text-lg mb-4">Upcoming Pickups</h3>
            <PickupCard
              title="The silent Patient"
              author="Alex"
              status="Ready for pickup"
              date="Apr 30, 2025"
              code="BN-1176"
              badgeColor="green"
            />
            <PickupCard
              title="Multiple Items"
              author="Order #BK123"
              status="Processing"
              date="Apr 30, 2025"
              badgeColor="orange"
            />
          </div>

          {/* Recents */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-4">Recents</h3>
            <RecentItem icon="🛒" title="Order Placed" desc="You ordered The silent Patient" />
            <RecentItem icon="%" title="Discount Earned" desc="Earned 10% discount for your next order" />
            <RecentItem icon="❤️" title="Book Added to Wishlist" desc="Added 'Promised land' to your wishlist" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ number, label }) => (
  <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
    <div className="text-2xl font-bold">{number}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

const PickupCard = ({ title, author, status, date, code, badgeColor }) => (
  <div className="flex items-center gap-4 mb-4 bg-white p-4 rounded-xl shadow">
    <img
      src="https://via.placeholder.com/60x90"
      alt={title}
      className="w-16 h-24 rounded object-cover"
    />
    <div className="flex-1">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-500">{author}</p>
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            badgeColor === "green"
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {status}
        </span>
        <span className="text-xs text-gray-500">Claim by: {date}</span>
      </div>
      {code && (
        <div className="mt-2 text-xs text-gray-700">
          Claim code: <span className="font-semibold">{code}</span>
        </div>
      )}
    </div>
  </div>
);

const RecentItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-3 mb-2">
    <div className="text-xl">{icon}</div>
    <div>
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  </div>
);

export default Account;
