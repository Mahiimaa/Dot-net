import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import productImg from "../assets/Images/Love.webp";

export default function Bestseller() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const bestSellerProducts = [
    {
      id: 1,
      title: "The Great Adventure",
      price: 935,
      originalPrice: 1100,
      rating: 0,
      onSale: true,
      image: productImg,
    },
    {
      id: 2,
      title: "The Great Adventure",
      price: 935,
      originalPrice: null,
      rating: 0,
      onSale: false,
      image: productImg,
    },
    {
      id: 3,
      title: "The Great Adventure",
      price: 1000,
      originalPrice: null,
      rating: 4,
      onSale: false,
      image: productImg,
    },
    {
      id: 4,
      title: "New Arrival",
      price: 800,
      originalPrice: 950,
      rating: 5,
      onSale: true,
      image: productImg,
    },
    {
      id: 5,
      title: "Classic Tale",
      price: 500,
      originalPrice: null,
      rating: 3,
      onSale: false,
      image: productImg,
    },
  ];

  return (
    <div className="font-sans w-full min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow px-4 md:px-16 py-16 bg-gray-50">
        {/* Breadcrumb Navigation */}
        <div className="text-sm text-gray-600 mb-4">
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Home
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Bestseller</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">
          <span className="text-green-600">Best</span> Sellers
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {bestSellerProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 relative"
            >
              {product.onSale && (
                <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  On Sale
                </span>
              )}

              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 object-contain mb-4"
              />

              <h3 className="text-lg font-semibold text-gray-800">
                {product.title}
              </h3>

              <div className="flex items-center my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={star <= product.rating ? "#fbbf24" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-yellow-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.062 6.319a1 1 0 00.95.69h6.631c.969 0 1.371 1.24.588 1.81l-5.367 3.906a1 1 0 00-.364 1.118l2.062 6.318c.3.922-.755 1.688-1.54 1.118l-5.367-3.906a1 1 0 00-1.175 0l-5.367 3.906c-.784.57-1.838-.196-1.54-1.118l2.062-6.318a1 1 0 00-.364-1.118L2.819 11.746c-.783-.57-.38-1.81.588-1.81h6.631a1 1 0 00.95-.69l2.062-6.319z"
                    />
                  </svg>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                {product.originalPrice && (
                  <span className="text-gray-500 line-through">
                    Rs. {product.originalPrice}
                  </span>
                )}
                <span className="text-lg font-bold text-gray-800">
                  Rs. {product.price}
                </span>
              </div>

              <button className="mt-4 w-full bg-[#f29d7e] text-white py-2 rounded-full hover:bg-[#f28663] transition">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
