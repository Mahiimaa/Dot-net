// import React from "react";
// import { Link, useLocation } from "react-router-dom";

// const tabs = [
//   { name: "Account Overview", path: "/account" },
//   { name: "Orders", path: "/orders" },
//   { name: "Wishlist", path: "/wishlist" },
//   { name: "Reviews", path: "/reviews" },
//   { name: "Settings", path: "/settings" },
// ];

// const AccountTabs = () => {
//   const location = useLocation();

//   return (
//     <div className="flex gap-6 border-b border-gray-200 mb-6">
//       {tabs.map((tab) => (
//         <Link
//           key={tab.name}
//           to={tab.path}
//           className={`pb-2 border-b-2 ${
//             location.pathname === tab.path
//               ? "border-brown-500 text-brown-700 font-medium"
//               : "text-gray-500"
//           }`}
//         >
//           {tab.name}
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default AccountTabs;
