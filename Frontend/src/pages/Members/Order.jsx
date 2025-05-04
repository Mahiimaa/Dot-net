// import React from "react";
// import MemNavbar from "../../Components/MemNavbar";
// import SideProfile from "../../Components/SideProfile";

// const Orders = () => {
//   const orders = [
//     {
//       id: "BK 122",
//       date: "Apr 15, 2025",
//       price: 225,
//       title: "The silent Patient",
//       author: "Alex",
//       qty: 1,
//       status: "Ready for Pickup",
//       claimCode: "#BK-122",
//       badgeColor: "green",
//       action: "Cancel Order",
//     },
//     {
//       id: "BK 123",
//       date: "Apr 16, 2025",
//       price: 750,
//       title: "Multiple Items",
//       author: "Order #BK123",
//       status: "Processing",
//       badgeColor: "yellow",
//       action: "Cancel Order",
//     },
//     {
//       id: "BK 121",
//       date: "Mar 2, 2025",
//       price: 976,
//       title: "Multiple Items",
//       author: "Order #BK123",
//       status: "Completed",
//       badgeColor: "green",
//       action: "Leave a Review",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <MemNavbar />

//       <div className="flex gap-8">
//         <SideProfile />

//         <div className="w-3/4">
//           {/* Tabs */}
//           <div className="flex gap-6 border-b border-gray-200 mb-6">
//             {["Account Overview", "Orders", "Wishlist", "Reviews", "Settings"].map((tab) => (
//               <button
//                 key={tab}
//                 className={`pb-2 border-b-2 ${
//                   tab === "Orders" ? "border-brown-500 text-brown-700 font-medium" : "text-gray-500"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           <h2 className="text-lg font-semibold mb-4">Your Orders</h2>

//           <div className="space-y-4">
//             {orders.map((order) => (
//               <div key={order.id} className="bg-white rounded-xl p-4 shadow border border-gray-100">
//                 <div className="flex justify-between items-start mb-2">
//                   <div>
//                     <p className="text-sm font-semibold">Order #{order.id}</p>
//                     <p className="text-xs text-gray-500">Placed on {order.date}</p>
//                     <p className="text-sm font-medium mt-1">Rs. {order.price}</p>
//                   </div>
//                   {order.action === "Cancel Order" ? (
//                     <button className="border border-red-500 text-red-500 text-sm px-3 py-1 rounded-full">
//                       Cancel Order
//                     </button>
//                   ) : (
//                     <button className="border border-green-300 text-green-700 text-sm px-3 py-1 rounded-full">
//                       Leave a Review
//                     </button>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <img
//                     src="https://via.placeholder.com/60x90"
//                     alt={order.title}
//                     className="w-16 h-24 rounded object-cover"
//                   />
//                   <div className="flex-1">
//                     <h4 className="font-semibold">{order.title}</h4>
//                     <p className="text-sm text-gray-500">{order.author}</p>
//                     {order.qty && (
//                       <p className="text-xs mt-1 text-gray-500">
//                         Qty: {order.qty} | Rs. {order.price}
//                       </p>
//                     )}

//                     <div className="flex items-center gap-2 mt-2">
//                       <span
//                         className={`text-xs font-medium px-2 py-1 rounded-full ${
//                           order.status === "Ready for Pickup"
//                             ? "bg-green-100 text-green-700"
//                             : order.status === "Processing"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : "bg-green-50 text-green-600"
//                         }`}
//                       >
//                         {order.status}
//                       </span>

//                       {order.claimCode && (
//                         <span className="text-xs bg-gray-50 border rounded px-2 py-1 text-gray-700">
//                           {order.claimCode}
//                         </span>
//                       )}
//                     </div>

//                     {order.status === "Processing" || order.status === "Completed" ? (
//                       <p className="text-sm text-red-500 mt-2 cursor-pointer">View Details</p>
//                     ) : null}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Orders;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import MemNavbar from "../../Components/MemNavbar";
import SideProfile from "../../Components/SideProfile";

const Orders = () => {
  const location = useLocation();

  const tabs = [
    { name: "Account Overview", path: "/account" },
    { name: "Orders", path: "/order" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Reviews", path: "/review" },
    { name: "Settings", path: "/setting" },
  ];

  const orders = [
    {
      id: "BK 122",
      date: "Apr 15, 2025",
      price: 225,
      title: "The silent Patient",
      author: "Alex",
      qty: 1,
      status: "Ready for Pickup",
      claimCode: "#BK-122",
      badgeColor: "green",
      action: "Cancel Order",
    },
    {
      id: "BK 123",
      date: "Apr 16, 2025",
      price: 750,
      title: "Multiple Items",
      author: "Order #BK123",
      status: "Processing",
      badgeColor: "yellow",
      action: "Cancel Order",
    },
    {
      id: "BK 121",
      date: "Mar 2, 2025",
      price: 976,
      title: "Multiple Items",
      author: "Order #BK123",
      status: "Completed",
      badgeColor: "green",
      action: "Leave a Review",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <MemNavbar />

      <div className="flex gap-8">
        <SideProfile />

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

          <h2 className="text-lg font-semibold mb-4">Your Orders</h2>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl p-4 shadow border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-semibold">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">Placed on {order.date}</p>
                    <p className="text-sm font-medium mt-1">Rs. {order.price}</p>
                  </div>
                  {order.action === "Cancel Order" ? (
                    <button className="border border-red-500 text-red-500 text-sm px-3 py-1 rounded-full">
                      Cancel Order
                    </button>
                  ) : (
                    <button className="border border-green-300 text-green-700 text-sm px-3 py-1 rounded-full">
                      Leave a Review
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src="https://via.placeholder.com/60x90"
                    alt={order.title}
                    className="w-16 h-24 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{order.title}</h4>
                    <p className="text-sm text-gray-500">{order.author}</p>
                    {order.qty && (
                      <p className="text-xs mt-1 text-gray-500">
                        Qty: {order.qty} | Rs. {order.price}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          order.status === "Ready for Pickup"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {order.status}
                      </span>

                      {order.claimCode && (
                        <span className="text-xs bg-gray-50 border rounded px-2 py-1 text-gray-700">
                          {order.claimCode}
                        </span>
                      )}
                    </div>

                    {(order.status === "Processing" || order.status === "Completed") && (
                      <p className="text-sm text-red-500 mt-2 cursor-pointer">View Details</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
