import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Layout/Navbar";
import SideProfile from "../../Components/SideProfile";
import { AuthContext } from "../../context/AuthContext";

const Orders = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUserId = user?.id;

  const tabs = [
    { name: "Account Overview", path: "/account" },
    { name: "Orders", path: "/order" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Reviews", path: "/review" },
    { name: "Settings", path: "/settings" },
  ];

  // Fetch orders from backend
  useEffect(() => {
    if (!isAuthenticated || !currentUserId) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5127/api/Order/user/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Failed to fetch orders. Please try again.";
        setError(errorMessage);
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUserId, isAuthenticated, navigate]);

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.delete(`http://localhost:5127/api/Order/cancel/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      alert("Order cancelled successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to cancel order. Please try again.";
      alert(errorMessage);
      console.error("Cancel order error:", error);
    }
  };

  // Map backend status to UI label and color
  const getStatusDisplay = (status) => {
    switch (status) {
      case "Pending":
        return { label: "Processing", color: "yellow" };
      case "Fulfilled":
        return { label: "Ready for Pickup", color: "green" };
      case "Cancelled":
        return { label: "Cancelled", color: "red" };
      default:
        return { label: status, color: "gray" };
    }
  };

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

          <h2 className="text-lg font-semibold mb-4">Your Orders</h2>

          {loading ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusDisplay = getStatusDisplay(order.status);
                const isMultipleItems = order.orderItems.length > 1;
                const title = isMultipleItems
                  ? "Multiple Items"
                  : order.orderItems[0]?.book?.title || "Untitled";
                const author = isMultipleItems
                  ? `Order #${order.id}`
                  : order.orderItems[0]?.book?.author || "Unknown";
                const qty = isMultipleItems ? null : order.orderItems[0]?.quantity;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl p-4 shadow border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-semibold">Order #{order.id}</p>
                        <p className="text-xs text-gray-500">
                          Placed on {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-medium mt-1">Rs. {order.totalAmount}</p>
                      </div>
                      {order.status === "Pending" ? (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="border border-red-500 text-red-500 text-sm px-3 py-1 rounded-full"
                        >
                          Cancel Order
                        </button>
                      ) : order.status === "Fulfilled" ? (
                        <Link
                          to="/reviews"
                          className="border border-green-300 text-green-700 text-sm px-3 py-1 rounded-full"
                        >
                          Leave a Review
                        </Link>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-4">
                      <img
                        src={
                          isMultipleItems
                            ? "https://via.placeholder.com/60x90"
                            : order.orderItems[0]?.book?.imageUrl
                            ? `http://localhost:5127/${order.orderItems[0].book.imageUrl}`
                            : "https://via.placeholder.com/60x90"
                        }
                        alt={title}
                        className="w-16 h-24 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-sm text-gray-500">{author}</p>
                        {qty && (
                          <p className="text-xs mt-1 text-gray-500">
                            Qty: {qty} | Rs. {order.orderItems[0]?.price}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              statusDisplay.color === "yellow"
                                ? "bg-yellow-100 text-yellow-700"
                                : statusDisplay.color === "green"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {statusDisplay.label}
                          </span>

                          {order.claimCode && (
                            <span className="text-xs bg-gray-50 border rounded px-2 py-1 text-gray-700">
                              #{order.claimCode}
                            </span>
                          )}
                        </div>

                        {(order.status === "Pending" || order.status === "Fulfilled") && (
                          <p className="text-sm text-red-500 mt-2 cursor-pointer">View Details</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;