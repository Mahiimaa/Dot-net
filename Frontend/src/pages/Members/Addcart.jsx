import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Navbar from "../Layout/Navbar";
import { AuthContext } from "../../context/AuthContext";

const AddCart = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUserId = user?.id;

  // Parse UTC date for discount checks
  const parseUTCDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr + (dateStr.endsWith('Z') ? '' : 'Z'));
    } catch (e) {
      console.error(`Invalid date format: ${dateStr}`);
      return null;
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !currentUserId) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5127/api/Cart/user/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Cart response:", response.data); // Debug: Log raw response
        const flattenedData = response.data.map((item) => {
          const originalPrice = item.book?.price || 0;
          const isDiscountActive =
            item.book?.isOnSale &&
            (!item.book?.discountStart || parseUTCDate(item.book.discountStart) <= new Date()) &&
            (!item.book?.discountEnd || parseUTCDate(item.book.discountEnd) >= new Date());
          const discountedPrice = isDiscountActive
            ? (originalPrice * (1 - (item.book.discountPercent || 0) / 100)).toFixed(2)
            : originalPrice.toFixed(2);
          console.log(`Item ${item.book?.title}:`, { // Debug: Log calculations
            isOnSale: item.book?.isOnSale,
            discountPercent: item.book?.discountPercent,
            discountStart: item.book?.discountStart,
            discountEnd: item.book?.discountEnd,
            isDiscountActive,
            originalPrice,
            discountedPrice
          });
          return {
            id: item.id,
            bookId: item.bookId,
            title: item.book?.title || "Untitled",
            author: item.book?.author || "Unknown",
            price: originalPrice,
            discountedPrice: parseFloat(discountedPrice),
            image: item.book?.imageUrl
              ? `http://localhost:5127/${item.book.imageUrl}`
              : "https://via.placeholder.com/100x150",
            quantity: item.quantity,
          };
        });
        setCartItems(flattenedData);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Failed to fetch cart. Please try again.";
        setError(errorMessage);
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [currentUserId, isAuthenticated, navigate]);

  const handleQuantityChange = async (id, delta) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    try {
      await axios.post(
        "http://localhost:5127/api/Cart/add",
        {
          userId: currentUserId,
          bookId: item.bookId,
          quantity: newQuantity - item.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to update quantity. Please try again.";
      alert(errorMessage);
      console.error("Update quantity error:", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:5127/api/Cart/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to remove from cart. Please try again.";
      alert(errorMessage);
      console.error("Remove from cart error:", error);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated || !currentUserId) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5127/api/Order/place",
        { userId: currentUserId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`Order placed successfully! Claim code: ${response.data.claimCode}`);
      setCartItems([]);
      navigate("/order");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to place order. Please try again.";
      alert(errorMessage);
      console.error("Checkout error:", error);
    }
  };

  // Calculate totals using discountedPrice
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.discountedPrice * item.quantity,
    0
  );
  // Calculate total discount
  const totalDiscount = cartItems.reduce(
    (acc, item) => acc + (item.price - item.discountedPrice) * item.quantity,
    0
  );
  const total = subtotal; // Final total computed by backend

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
        {loading ? (
          <p className="text-gray-500">Loading cart...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="flex gap-8 flex-wrap md:flex-nowrap">
            <div className="flex-1 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border p-4 flex gap-4 rounded-md bg-white relative"
                >
                  <Link to={`/books/${item.bookId}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-40 object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/books/${item.bookId}`}>
                      <h3 className="text-md font-semibold hover:underline">{item.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-1">By {item.author}</p>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      {item.discountedPrice < item.price ? (
                        <>
                          <span className="line-through text-gray-400">
                            Rs {item.price.toFixed(2)}
                          </span>
                          <span className="text-green-600 font-semibold">
                            Rs {item.discountedPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-blue-700 font-semibold">
                          Rs {item.discountedPrice.toFixed(2)}
                        </span>
                      )}
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
            <div className="w-full md:w-1/3 bg-[#f7f0e8] p-6 rounded-md shadow mt-6 md:mt-0">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2 text-sm">
                <span>SUBTOTAL </span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between mb-2 text-sm">
                  <span>TOTAL DISCOUNT</span>
                  <span>Rs {totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-2 text-sm">
                <span>ADDITIONAL DISCOUNTS</span>
                <span>Calculated at checkout</span>
              </div>
              <hr className="mb-4" />
              <div className="flex justify-between font-medium mb-6">
                <span>ESTIMATED TOTAL</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-[#003b5c] text-white py-2 font-semibold rounded hover:bg-[#002b45]"
                disabled={cartItems.length === 0}
              >
                CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCart;