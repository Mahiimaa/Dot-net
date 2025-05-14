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
  const [completedOrders, setCompletedOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUserId = user?.id;

  const parseUTCDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr + (dateStr.endsWith("Z") ? "" : "Z"));
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

    const fetchCartAndOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch cart items
        const cartResponse = await axios.get(
          `http://localhost:5127/api/Cart/user/${currentUserId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Cart response:", cartResponse.data);
        const flattenedData = cartResponse.data.map((item) => {
          const originalPrice = parseFloat(item.book?.price || 0);
          const isDiscountActive =
            item.book?.isOnSale &&
            (!item.book?.discountStart ||
              parseUTCDate(item.book.discountStart) <= new Date()) &&
            (!item.book?.discountEnd ||
              parseUTCDate(item.book.discountEnd) >= new Date());
          const discountedPrice = isDiscountActive
            ? (
                originalPrice *
                (1 - (item.book.discountPercent || 0) / 100)
              ).toFixed(2)
            : originalPrice.toFixed(2);
          console.log(`Item ${item.book?.title}:`, {
            isOnSale: item.book?.isOnSale,
            discountPercent: item.book?.discountPercent,
            discountStart: item.book?.discountStart,
            discountEnd: item.book?.discountEnd,
            isDiscountActive,
            originalPrice,
            discountedPrice,
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

        // Fetch user orders to count completed orders
        const ordersResponse = await axios.get(
          `http://localhost:5127/api/Order/user/${currentUserId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const fulfilledOrders = ordersResponse.data.filter(
          (order) => order.status === "Fulfilled"
        ).length;
        setCompletedOrders(fulfilledOrders);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          "Failed to fetch cart or orders. Please try again.";
        setError(errorMessage);
        console.error("Failed to fetch cart/orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndOrders();
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
        error.response?.data?.error ||
        "Failed to update quantity. Please try again.";
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
        error.response?.data?.error ||
        "Failed to remove from cart. Please try again.";
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
      alert(
        `Order placed successfully! Claim code: ${response.data.claimCode}`
      );
      setCartItems([]);
      navigate("/order");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Failed to place order. Please try again.";
      alert(errorMessage);
      console.error("Checkout error:", error);
    }
  };

  // Calculate totals
  const subtotal = parseFloat(
    cartItems.reduce(
      (acc, item) => acc + item.discountedPrice * item.quantity,
      0
    )
  ).toFixed(2);
  const totalBooks = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  // Book-specific discounts
  const bookDiscount = parseFloat(
    cartItems.reduce(
      (acc, item) => acc + (item.price - item.discountedPrice) * item.quantity,
      0
    )
  ).toFixed(2);
  // 5% discount for 5+ books
  const fivePlusBooksDiscount =
    totalBooks >= 5 ? parseFloat(subtotal * 0.05).toFixed(2) : 0;
  // 10% stackable discount after every 10 completed orders
  const loyaltyDiscount =
    completedOrders >= 10 && completedOrders % 10 === 0
      ? parseFloat(subtotal * 0.1).toFixed(2)
      : 0;
  const totalDiscount = parseFloat(
    parseFloat(bookDiscount) +
      parseFloat(fivePlusBooksDiscount) +
      parseFloat(loyaltyDiscount)
  ).toFixed(2);
  const total = parseFloat(subtotal - totalDiscount).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Navbar />
      <div className="mt-6">
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
                      <h3 className="text-md font-semibold hover:underline">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-1">
                      By {item.author}
                    </p>
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
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to remove this item from your cart?"
                        )
                      ) {
                        handleRemove(item.id);
                      }
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
            <div className="w-full md:w-1/3 bg-[#f7f0e8] p-6 rounded-md shadow mt-6 md:mt-0">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2 text-sm">
                <span>SUBTOTAL</span>
                <span>Rs {subtotal}</span>
              </div>
              {bookDiscount > 0 && (
                <div className="flex justify-between mb-2 text-sm">
                  <span>BOOK DISCOUNTS</span>
                  <span>Rs {bookDiscount}</span>
                </div>
              )}
              {fivePlusBooksDiscount > 0 && (
                <div className="flex justify-between mb-2 text-sm">
                  <span>5+ BOOKS DISCOUNT (5%)</span>
                  <span>Rs {fivePlusBooksDiscount}</span>
                </div>
              )}
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between mb-2 text-sm">
                  <span>LOYALTY DISCOUNT (10%)</span>
                  <span>Rs {loyaltyDiscount}</span>
                </div>
              )}
              {totalDiscount > 0 && (
                <div className="flex justify-between mb-2 text-sm">
                  <span>TOTAL DISCOUNT</span>
                  <span>Rs {totalDiscount}</span>
                </div>
              )}
              <hr className="mb-4" />
              <div className="flex justify-between font-medium mb-6">
                <span>ESTIMATED TOTAL</span>
                <span>Rs {total}</span>
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
