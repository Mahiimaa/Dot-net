// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from './Layout/Navbar'; 
// import Footer from './Layout/Footer';

// export default function HomePage() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();

//   // Check authentication status on component mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
//     if (!token) {
//       navigate("/login"); // Redirect to login if not logged in
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     // Clear token and user data from localStorage
//     localStorage.removeItem("token");
//     localStorage.removeItem("resetEmail"); // Clean up any leftover reset email
//     setIsLoggedIn(false);
//     setMenuOpen(false); 
//     navigate("/login");
//   };

//   return (
//     <div className="font-sans w-full">
//       {/* Use the existing Navbar component */}
//       <Navbar />

//       {/* Hero Section */}
//       <section className="bg-[#e3eae6] flex items-center justify-center flex-col text-center py-24 w-full">
//         <h1 className="text-4xl font-bold text-gray-800">Welcome to</h1>
//         <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Book Shop</h2>
//         <p className="text-gray-600 max-w-xl mb-6">
//           Discover a world of literary treasures and explore our vast selection of books
//         </p>
//         <button className="bg-[#f29d7e] text-white px-6 py-2 rounded-full text-lg">
//           Shop Now
//         </button>
//       </section>
//     </div>
//   );
// }




import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import backgroundImg from '../assets/Background.png';
import productImg from '../assets/Images/Love.webp';
import bgPattern from '../assets/Images/Bg.jpg'; // background pattern
import book1 from '../assets/Books/book1.jpg';
import book2 from '../assets/Books/book2.jpg';
import book3 from '../assets/Books/book3.jpeg';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("resetEmail");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const products = [
    { id: 1, title: "The Great Adventure", price: 935, originalPrice: 1100, rating: 0, onSale: true, image: productImg },
    { id: 2, title: "The Great Adventure", price: 935, originalPrice: null, rating: 0, onSale: false, image: productImg },
    { id: 3, title: "The Great Adventure", price: 1000, originalPrice: null, rating: 4, onSale: false, image: productImg },
    { id: 4, title: "New Arrival", price: 800, originalPrice: 950, rating: 5, onSale: true, image: productImg },
    { id: 5, title: "Classic Tale", price: 500, originalPrice: null, rating: 3, onSale: false, image: productImg },
  ];

  const featuredBooks = [
    { id: 1, title: "Featured Book 1", image: book1 },
    { id: 2, title: "Featured Book 2", image: book2 },
    { id: 3, title: "Featured Book 3", image: book3 },
  ];

  const scrollLeft = () => {
    const scrollAmount = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const scrollAmount = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="font-sans w-full min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow">
        {/* Hero Section */}
        <section
          className="flex items-center justify-center flex-col text-center w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImg})`, minHeight: "calc(100vh - 80px - 60px)" }}
        >
          <h1 className="text-4xl font-bold text-gray-800">Welcome to</h1>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Book Shop</h2>
          <p className="text-gray-600 max-w-xl mb-6">
            Discover a world of literary treasures and explore our vast selection of books
          </p>
          <button className="bg-[#f29d7e] text-white px-6 py-2 rounded-full text-lg hover:bg-[#f28663] transition">
            Shop Now
          </button>
        </section>

        {/* Best Sellers Section */}
        <section className="py-16 px-4 md:px-16 bg-gray-50 relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold"><span className="text-green-600">Best</span>Sellers</h2>
            <button onClick={() => navigate("/bestsellers")} className="text-blue-700 hover:underline cursor-pointer">
              See All
            </button>
          </div>

          <button onClick={scrollLeft} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100">
            &lt;
          </button>
          <button onClick={scrollRight} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100">
            &gt;
          </button>

          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 custom-hide-scrollbar">
            {products.map((product) => (
              <div key={product.id} className="min-w-[250px] bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 relative snap-start">
                {product.onSale && (
                  <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    On Sale
                  </span>
                )}
                <img src={product.image} alt={product.title} className="w-full h-64 object-contain mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                <div className="flex items-center my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" fill={star <= product.rating ? "#fbbf24" : "none"} viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-yellow-400">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.062 6.319a1 1 0 00.95.69h6.631c.969 0 1.371 1.24.588 1.81l-5.367 3.906a1 1 0 00-.364 1.118l2.062 6.318c.3.922-.755 1.688-1.54 1.118l-5.367-3.906a1 1 0 00-1.175 0l-5.367 3.906c-.784.57-1.838-.196-1.54-1.118l2.062-6.318a1 1 0 00-.364-1.118L2.819 11.746c-.783-.57-.38-1.81.588-1.81h6.631a1 1 0 00.95-.69l2.062-6.319z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  {product.originalPrice && (
                    <span className="text-gray-500 line-through">Rs. {product.originalPrice}</span>
                  )}
                  <span className="text-lg font-bold text-gray-800">Rs. {product.price}</span>
                </div>
                <button className="mt-4 w-full bg-[#f29d7e] text-white py-2 rounded-full hover:bg-[#f28663] transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Books Section */}
        <section className="py-16 px-4 md:px-16 bg-white">
          <h2 className="text-3xl font-bold text-center mb-10"><span className="text-[#f29d7e]">Featured</span> Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredBooks.map((book) => (
              <div key={book.id} className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col items-center">
                <img src={book.image} alt={book.title} className="w-full h-72 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                <button className="mt-4 bg-[#f29d7e] text-white px-4 py-2 rounded-full hover:bg-[#f28663] transition">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* New Login/Register + Books Tilt Section */}
        <section
          className="py-16 px-4 md:px-16 bg-cover bg-center flex flex-col lg:flex-row items-center justify-between"
          style={{ backgroundImage: `url(${bgPattern})` }}
        >
          {/* Left Side: Text + Buttons */}
          <div className="mb-10 lg:mb-0 max-w-lg text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Join Our Community</h2>
            <p className="text-gray-600 mb-6">
              Sign up now to access exclusive deals and discover more amazing books!
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              <button onClick={() => navigate("/login")} className="bg-[#f29d7e] text-white px-6 py-2 rounded-full text-lg hover:bg-[#f28663] transition">
                Login
              </button>
              <button onClick={() => navigate("/register")} className="border-2 border-[#f29d7e] text-[#f29d7e] px-6 py-2 rounded-full text-lg hover:bg-[#f29d7e] hover:text-white transition">
                Register
              </button>
            </div>
          </div>

          {/* Right Side: Tilted Book Images */}
          <div className="flex gap-6">
            <img src={book1} alt="Book 1" className="w-32 h-48 object-cover rounded-lg transform rotate-[-10deg] shadow-lg" />
            <img src={book2} alt="Book 2" className="w-32 h-48 object-cover rounded-lg transform rotate-[10deg] shadow-lg" />
            <img src={book3} alt="Book 3" className="w-32 h-48 object-cover rounded-lg transform rotate-[-5deg] shadow-lg" />
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
