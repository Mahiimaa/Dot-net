import React, { useEffect, useState } from "react";
import MemNavbar from "../../Components/MemNavbar";
import { FaTimes } from "react-icons/fa";

const Addcart = () => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (id, delta) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCartItems(updated);
  };

  const handleRemove = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 100 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <MemNavbar />

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="flex gap-8 flex-wrap md:flex-nowrap">
            {/* Cart Items */}
            <div className="flex-1 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border p-4 flex gap-4 rounded-md bg-white relative"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-40 object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-md font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">
                      By {item.author}
                    </p>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="line-through text-gray-400">
                        Rs {item.originalPrice}
                      </span>
                      <span className="text-blue-700 font-semibold">
                        Rs {item.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="border px-2 rounded-sm"
                      >
                        -
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="border px-2 rounded-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                    onClick={() => handleRemove(item.id)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full md:w-1/3 bg-[#f7f0e8] p-6 rounded-md shadow mt-6 md:mt-0">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2 text-sm">
                <span>SUBTOTAL ({cartItems.length} Books)</span>
                <span>Rs {subtotal}</span>
              </div>
              <div className="flex justify-between mb-4 text-sm">
                <span>SHIPPING</span>
                <span>Rs {shipping}</span>
              </div>
              <hr className="mb-4" />
              <div className="flex justify-between font-medium mb-6">
                <span>TOTAL COST</span>
                <span>Rs {total}</span>
              </div>
              <button className="w-full bg-[#003b5c] text-white py-2 font-semibold rounded hover:bg-[#002b45]">
                CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addcart;


// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import MemNavbar from "../../Components/MemNavbar";
// import { FaTimes } from "react-icons/fa";

// const Addcart = () => {
//   const location = useLocation();
//   const newItem = location.state?.item;

//   const [cartItems, setCartItems] = useState([
//     {
//       id: 1,
//       title: "The Great Adventure",
//       author: "John Strass",
//       price: 935,
//       originalPrice: 1100,
//       image: "https://via.placeholder.com/100x150",
//       quantity: 1,
//     },
//     {
//       id: 2,
//       title: "The Great Adventure",
//       author: "John Strass",
//       price: 935,
//       originalPrice: 1100,
//       image: "https://via.placeholder.com/100x150",
//       quantity: 1,
//     },
//   ]);

//   useEffect(() => {
//     if (newItem) {
//       const exists = cartItems.find((item) => item.title === newItem.title);
//       if (!exists) {
//         setCartItems((prev) => [
//           ...prev,
//           { ...newItem, id: Date.now(), quantity: 1 },
//         ]);
//       }
//     }
//   }, [newItem]);

//   const handleQuantityChange = (id, delta) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       )
//     );
//   };

//   const handleRemove = (id) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );
//   const shipping = 100;
//   const total = subtotal + shipping;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* This matches Wishlist structure exactly */}
//       <MemNavbar />

//       <div className="mt-6">
//         <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

//         <div className="flex gap-8 flex-wrap md:flex-nowrap">
//           {/* Cart Items */}
//           <div className="flex-1 space-y-6">
//             {cartItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="border p-4 flex gap-4 rounded-md bg-white relative"
//               >
//                 <img
//                   src={item.image}
//                   alt={item.title}
//                   className="h-40 object-cover"
//                 />
//                 <div className="flex-1">
//                   <h3 className="text-md font-semibold">{item.title}</h3>
//                   <p className="text-sm text-gray-500 mb-1">By {item.author}</p>
//                   <div className="flex items-center gap-2 text-sm mb-2">
//                     <span className="line-through text-gray-400">
//                       Rs {item.originalPrice}
//                     </span>
//                     <span className="text-blue-700 font-semibold">
//                       Rs {item.price}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handleQuantityChange(item.id, -1)}
//                       className="border px-2 rounded-sm"
//                     >
//                       -
//                     </button>
//                     <span className="px-2">{item.quantity}</span>
//                     <button
//                       onClick={() => handleQuantityChange(item.id, 1)}
//                       className="border px-2 rounded-sm"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//                 <button
//                   className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
//                   onClick={() => handleRemove(item.id)}
//                 >
//                   <FaTimes />
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Order Summary */}
//           <div className="w-full md:w-1/3 bg-[#f7f0e8] p-6 rounded-md shadow mt-6 md:mt-0">
//             <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
//             <div className="flex justify-between mb-2 text-sm">
//               <span>SUBTOTAL ({cartItems.length} Books)</span>
//               <span>Rs {subtotal}</span>
//             </div>
//             <div className="flex justify-between mb-4 text-sm">
//               <span>SHIPPING</span>
//               <span>Rs {shipping}</span>
//             </div>
//             <hr className="mb-4" />
//             <div className="flex justify-between font-medium mb-6">
//               <span>TOTAL COST</span>
//               <span>Rs {total}</span>
//             </div>
//             <button className="w-full bg-[#003b5c] text-white py-2 font-semibold rounded hover:bg-[#002b45]">
//               CHECKOUT
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Addcart;
