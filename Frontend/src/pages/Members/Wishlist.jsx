// // // import React from "react";
// // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // import MemNavbar from "../../Components/MemNavbar";
// // // import SideProfile from "../../Components/SideProfile";
// // // import { FaHeart } from "react-icons/fa";

// // // const Wishlist = () => {
// // //   const location = useLocation();
// // //   const navigate = useNavigate();

// // //   const tabs = [
// // //     { name: "Account Overview", path: "/account" },
// // //     { name: "Orders", path: "/order" },
// // //     { name: "Wishlist", path: "/wishlist" },
// // //     { name: "Reviews", path: "/review" },
// // //     { name: "Settings", path: "/setting" },
// // //   ];

// // //   const wishlistItems = Array(6).fill({
// // //     title: "The Great Adventure",
// // //     price: 935,
// // //     image: "https://via.placeholder.com/100x150", // Replace with actual image
// // //     author: "John Strass",
// // //     originalPrice: 1100,
// // //     rating: 5,
// // //     reviews: 1,
// // //   });

// // //   const handleAddToCart = (item) => {
// // //     navigate("/addcart", { state: { item } });
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 p-6">
// // //       <MemNavbar />

// // //       <div className="flex gap-8">
// // //         <SideProfile />

// // //         <div className="w-3/4">
// // //           {/* Tabs */}
// // //           <div className="flex gap-6 border-b border-gray-200 mb-6">
// // //             {tabs.map((tab) => (
// // //               <Link
// // //                 key={tab.name}
// // //                 to={tab.path}
// // //                 className={`pb-2 border-b-2 ${
// // //                   location.pathname === tab.path
// // //                     ? "border-brown-500 text-brown-700 font-medium"
// // //                     : "text-gray-500"
// // //                 }`}
// // //               >
// // //                 {tab.name}
// // //               </Link>
// // //             ))}
// // //           </div>

// // //           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
// // //             My Wishlist <FaHeart className="text-pink-500" />
// // //           </h2>

// // //           <div className="grid grid-cols-3 gap-6">
// // //             {wishlistItems.map((item, idx) => (
// // //               <div key={idx} className="bg-white rounded-xl p-4 shadow border">
// // //                 <img
// // //                   src={item.image}
// // //                   alt={item.title}
// // //                   className="mx-auto h-40 mb-3"
// // //                 />
// // //                 <h4 className="text-center text-sm font-semibold">
// // //                   {item.title}
// // //                 </h4>
// // //                 <p className="text-center text-blue-700 font-medium mb-2">
// // //                   Rs. {item.price}
// // //                 </p>
// // //                 <div className="flex items-center justify-between">
// // //                   <FaHeart className="text-red-500 text-lg" />
// // //                   <button
// // //                     onClick={() => handleAddToCart(item)}
// // //                     className="border px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-100"
// // //                   >
// // //                     Add to cart
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Wishlist;

// // import React, { useEffect, useState } from "react";
// // import { Link, useLocation, useNavigate } from "react-router-dom";
// // import MemNavbar from "../../Components/MemNavbar";
// // import SideProfile from "../../Components/SideProfile";
// // import { FaHeart } from "react-icons/fa";

// // const Wishlist = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();

// //   const tabs = [
// //     { name: "Account Overview", path: "/account" },
// //     { name: "Orders", path: "/order" },
// //     { name: "Wishlist", path: "/wishlist" },
// //     { name: "Reviews", path: "/review" },
// //     { name: "Settings", path: "/setting" },
// //   ];

// //   // ✅ State for wishlist items
// //   const [wishlistItems, setWishlistItems] = useState([]);

// //   // ✅ Load wishlist from localStorage on mount
// //   useEffect(() => {
// //     const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
// //     setWishlistItems(storedWishlist);
// //   }, []);

// //   // ✅ Save wishlist to localStorage whenever it changes
// //   useEffect(() => {
// //     localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
// //   }, [wishlistItems]);

// //   // ✅ Add to Cart handler
// //   const handleAddToCart = (item) => {
// //     // Get existing cart
// //     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

// //     // Check if item already exists
// //     const exists = storedCart.find((cartItem) => cartItem.title === item.title);

// //     if (!exists) {
// //       storedCart.push({ ...item, id: Date.now(), quantity: 1 });
// //       localStorage.setItem("cart", JSON.stringify(storedCart));
// //     }

// //     navigate("/addcart");
// //   };

// //   // ✅ Remove from wishlist
// //   const handleRemoveFromWishlist = (title) => {
// //     const updated = wishlistItems.filter((item) => item.title !== title);
// //     setWishlistItems(updated);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <MemNavbar />

// //       <div className="flex gap-8">
// //         <SideProfile />

// //         <div className="w-3/4">
// //           {/* Tabs */}
// //           <div className="flex gap-6 border-b border-gray-200 mb-6">
// //             {tabs.map((tab) => (
// //               <Link
// //                 key={tab.name}
// //                 to={tab.path}
// //                 className={`pb-2 border-b-2 ${
// //                   location.pathname === tab.path
// //                     ? "border-brown-500 text-brown-700 font-medium"
// //                     : "text-gray-500"
// //                 }`}
// //               >
// //                 {tab.name}
// //               </Link>
// //             ))}
// //           </div>

// //           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
// //             My Wishlist <FaHeart className="text-pink-500" />
// //           </h2>

// //           {wishlistItems.length === 0 ? (
// //             <p className="text-gray-500">No items in wishlist.</p>
// //           ) : (
// //             <div className="grid grid-cols-3 gap-6">
// //               {wishlistItems.map((item, idx) => (
// //                 <div
// //                   key={idx}
// //                   className="bg-white rounded-xl p-4 shadow border"
// //                 >
// //                   <img
// //                     src={item.image}
// //                     alt={item.title}
// //                     className="mx-auto h-40 mb-3"
// //                   />
// //                   <h4 className="text-center text-sm font-semibold">
// //                     {item.title}
// //                   </h4>
// //                   <p className="text-center text-blue-700 font-medium mb-2">
// //                     Rs. {item.price}
// //                   </p>
// //                   <div className="flex items-center justify-between">
// //                     {/* Remove from wishlist */}
// //                     <button
// //                       onClick={() => handleRemoveFromWishlist(item.title)}
// //                       className="text-red-500 text-sm"
// //                     >
// //                       Remove
// //                     </button>

// //                     {/* Add to cart */}
// //                     <button
// //                       onClick={() => handleAddToCart(item)}
// //                       className="border px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-100"
// //                     >
// //                       Add to cart
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Wishlist;


// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import MemNavbar from "../../Components/MemNavbar";
// import SideProfile from "../../Components/SideProfile";
// import { FaHeart } from "react-icons/fa";
// import axios from "axios";

// const Wishlist = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const tabs = [
//     { name: "Account Overview", path: "/account" },
//     { name: "Orders", path: "/order" },
//     { name: "Wishlist", path: "/wishlist" },
//     { name: "Reviews", path: "/review" },
//     { name: "Settings", path: "/setting" },
//   ];

//   // State for wishlist items
//   const [wishlistItems, setWishlistItems] = useState([]);

//   // Get user id (replace this with actual user ID management)
//   const currentUserId = 1;  // Hardcoded for example purposes, replace with real user ID logic.

//   // Get wishlist items from backend
//   // useEffect(() => {
//   //   const fetchWishlist = async () => {
//   //     try {
//   //       const response = await axios.get(`/api/wishlist/user/${currentUserId}`);
//   //       setWishlistItems(response.data); // Set the wishlist items
//   //     } catch (error) {
//   //       console.error("Failed to fetch wishlist", error);
//   //     }
//   //   };

//   //   fetchWishlist();
//   // }, [currentUserId]);
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const response = await axios.get(`/api/wishlist/user/${currentUserId}`);
//         console.log("Fetched wishlist response:", response.data); // ✅ Check this in your browser console
//         setWishlistItems(response.data);
//       } catch (error) {
//         console.error("Failed to fetch wishlist", error);
//       }
//     };
  
//     fetchWishlist();
//   }, [currentUserId]);
  

//   // Add to wishlist handler
//   const handleAddToWishlist = async (bookId) => {
//     try {
//       const response = await axios.post("/api/wishlist/add", {
//         userId: currentUserId,
//         bookId: bookId,
//       });
//       alert(response.data.message); // Show message returned from backend
//       setWishlistItems([...wishlistItems, { bookId }]); // Update state to reflect added item
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to add to wishlist");
//     }
//   };

//   // Remove from wishlist handler
//   const handleRemoveFromWishlist = async (id) => {
//     try {
//       const response = await axios.delete(`/api/wishlist/remove/${id}`);
//       alert(response.data.message); // Show message returned from backend
//       setWishlistItems(wishlistItems.filter((item) => item.id !== id)); // Remove item from wishlist state
//     } catch (error) {
//       console.error("Failed to remove from wishlist", error);
//     }
//   };

//   // Render the wishlist
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <MemNavbar />

//       <div className="flex gap-8">
//         <SideProfile />

//         <div className="w-3/4">
//           {/* Tabs */}
//           <div className="flex gap-6 border-b border-gray-200 mb-6">
//             {tabs.map((tab) => (
//               <Link
//                 key={tab.name}
//                 to={tab.path}
//                 className={`pb-2 border-b-2 ${
//                   location.pathname === tab.path
//                     ? "border-brown-500 text-brown-700 font-medium"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {tab.name}
//               </Link>
//             ))}
//           </div>

//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             My Wishlist <FaHeart className="text-pink-500" />
//           </h2>

//           {Array.isArray(wishlistItems) && wishlistItems.length === 0 ? (
//             <p className="text-gray-500">No items in wishlist.</p>
//           ) : (
//             <div className="grid grid-cols-3 gap-6">
//               {Array.isArray(wishlistItems) &&
//                 wishlistItems.map((item, idx) => (
//                   <div key={idx} className="bg-white rounded-xl p-4 shadow border">
//                     <img
//                       src={item.image || "https://via.placeholder.com/100x150"}
//                       alt={item.title}
//                       className="mx-auto h-40 mb-3"
//                     />
//                     <h4 className="text-center text-sm font-semibold">
//                       {item.title}
//                     </h4>
//                     <p className="text-center text-blue-700 font-medium mb-2">
//                       Rs. {item.price}
//                     </p>
//                     <div className="flex items-center justify-between">
//                       {/* Remove from wishlist */}
//                       <button
//                         onClick={() => handleRemoveFromWishlist(item.id)}
//                         className="text-red-500 text-sm"
//                       >
//                         Remove
//                       </button>

//                       {/* Add to cart */}
//                       <button
//                         onClick={() => handleAddToCart(item)}
//                         className="border px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Add to cart
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Wishlist;


import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MemNavbar from "../../Components/MemNavbar";
import SideProfile from "../../Components/SideProfile";
import { FaHeart } from "react-icons/fa";
import axios from "axios";

const Wishlist = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: "Account Overview", path: "/account" },
    { name: "Orders", path: "/order" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Reviews", path: "/review" },
    { name: "Settings", path: "/setting" },
  ];

  // State for wishlist items
  const [wishlistItems, setWishlistItems] = useState([]);

  // Get user id (replace this with actual user ID management)
  const currentUserId = 1; // Hardcoded for example purposes, replace with real user ID logic.

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`/api/wishlist/user/${currentUserId}`);
        console.log("Fetched wishlist response:", response.data);

        // ✅ Flatten the data from backend
        const flattenedData = response.data.map((item) => ({
          id: item.id,
          bookId: item.bookId,
          title: item.book?.title || "Untitled",
          price: item.book?.price || 0,
          image: item.book?.image || "https://via.placeholder.com/100x150",
        }));

        setWishlistItems(flattenedData);
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      }
    };

    fetchWishlist();
  }, [currentUserId]);

  // Add to wishlist handler
  const handleAddToWishlist = async (bookId) => {
    try {
      const response = await axios.post("/api/wishlist/add", {
        userId: currentUserId,
        bookId: bookId,
      });
      alert(response.data.message);
      // Optionally, re-fetch the wishlist
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to wishlist");
    }
  };

  // Remove from wishlist handler
  const handleRemoveFromWishlist = async (id) => {
    try {
      const response = await axios.delete(`/api/wishlist/remove/${id}`);
      alert(response.data.message);
      setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  };

  // Dummy add to cart handler
  const handleAddToCart = (item) => {
    alert(`Added ${item.title} to cart!`);
  };

  // Render the wishlist
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

          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            My Wishlist <FaHeart className="text-pink-500" />
          </h2>

          {Array.isArray(wishlistItems) && wishlistItems.length === 0 ? (
            <p className="text-gray-500">No items in wishlist.</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow border"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="mx-auto h-40 mb-3"
                  />
                  <h4 className="text-center text-sm font-semibold">
                    {item.title}
                  </h4>
                  <p className="text-center text-blue-700 font-medium mb-2">
                    Rs. {item.price}
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="border px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
