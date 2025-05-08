import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MemNavbar from "../../Components/MemNavbar";
import SideProfile from "../../Components/SideProfile";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../Layout/Navbar";

const Wishlist = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: "Account Overview", path: "/account" },
    { name: "Orders", path: "/order" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Reviews", path: "/reviews" },
    { name: "Settings", path: "/settings" },
  ];

  // State for wishlist items
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user ID from AuthContext
  const currentUserId = user?.id;

  useEffect(() => {
    if (!isAuthenticated || !currentUserId) {
      navigate("/login");
      return;
    }

    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5127/api/Wishlist/user/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Fetched wishlist response:", response.data);

        // Flatten the data from backend
        const flattenedData = response.data.map((item) => ({
          id: item.id,
          bookId: item.bookId,
          title: item.book?.title || "Untitled",
          price: item.book?.price || 0,
          image: item.book?.imageUrl
            ? `http://localhost:5127/${item.book.imageUrl}`
            : "https://via.placeholder.com/100x150",
        }));

        setWishlistItems(flattenedData);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Failed to fetch wishlist. Please try again.";
        setError(errorMessage);
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [currentUserId, isAuthenticated, navigate]);

  // Add to wishlist handler
  const handleAddToWishlist = async (bookId) => {
    if (!isAuthenticated || !currentUserId) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5127/api/Wishlist/add",
        {
          userId: currentUserId,
          bookId: bookId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      // Re-fetch wishlist to update the UI
      const fetchWishlist = async () => {
        try {
          const response = await axios.get(`http://localhost:5127/api/Wishlist/user/${currentUserId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const flattenedData = response.data.map((item) => ({
            id: item.id,
            bookId: item.bookId,
            title: item.book?.title || "Untitled",
            price: item.book?.price || 0,
            image: item.book?.imageUrl
              ? `http://localhost:5127/${item.book.imageUrl}`
              : "https://via.placeholder.com/100x150",
          }));
          setWishlistItems(flattenedData);
        } catch (error) {
          const errorMessage =
            error.response?.data?.error || "Failed to fetch wishlist after adding.";
          alert(errorMessage);
          console.error("Failed to fetch wishlist:", error);
        }
      };
      fetchWishlist();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add to wishlist. Please try again.";
      alert(errorMessage);
      console.error("Add to wishlist error:", error);
    }
  };

  // Remove from wishlist handler
  const handleRemoveFromWishlist = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5127/api/Wishlist/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert(response.data.message);
      setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to remove from wishlist. Please try again.";
      alert(errorMessage);
      console.error("Remove from wishlist error:", error);
    }
  };

  // Add to cart handler
  const handleAddToCart = async (item) => {
    if (!isAuthenticated || !currentUserId) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5127/api/Cart/add",
        {
          userId: currentUserId,
          bookId: item.bookId,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`Added ${item.title} to cart!`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to add to cart. Please try again.";
      alert(errorMessage);
      console.error("Add to cart error:", error);
    }
  };

  // Render the wishlist
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />

      <div className="flex gap-8 mt-8">
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

          {loading ? (
            <p className="text-gray-500">Loading wishlist...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : Array.isArray(wishlistItems) && wishlistItems.length === 0 ? (
            <p className="text-gray-500">No items in wishlist.</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow border"
                >
                  <Link to={`/books/${item.bookId}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="mx-auto h-40 mb-3"
                    />
                    <h4 className="text-center text-sm font-semibold hover:underline">
                      {item.title}
                    </h4>
                  </Link>
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