import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import AdminTop from "../Components/AdminTop";
import AdminNav from "../Components/AdminNavbar";

const StaffOrderPortal = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [claimCode, setClaimCode] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFulfill = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5127/api/Order/fulfill",
        { claimCode, membershipId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      setOrder(response.data.order);
      setClaimCode("");
      setMembershipId("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Failed to fulfill order. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="h-screen flex">
      <AdminNav />
      <div className="flex-1 flex flex-col">
        <AdminTop />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Staff Order Portal</h2>
          </div>

          {/* Fulfill Order Form */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Fulfill Order
            </h2>
            <form onSubmit={handleFulfill} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Claim Code
                  </label>
                  <input
                    type="text"
                    value={claimCode}
                    onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
                    className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-[#1b3a57]"
                    placeholder="e.g., ABC123"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Membership ID
                  </label>
                  <input
                    type="text"
                    value={membershipId}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      if (/^[A-F0-9]{0,8}$/.test(value)) {
                        setMembershipId(value);
                      }
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-[#1b3a57]"
                    placeholder="e.g., A1B2C3D4"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="bg-[#1b3a57] text-white px-4 py-2 rounded-md hover:bg-[#123146] transition"
              >
                {loading ? "Processing..." : "Fulfill Order"}
              </button>
            </form>
          </div>

          {/* Order Details Display */}
          {order && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Order ID: {order.id}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Order Date: {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Status: {order.status}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Claim Code: {order.claimCode}
                  </p>
                </div>
              </div>
              <p className="font-medium mb-4 border-t pt-2">
                Total Amount: Rs {order.totalAmount}
              </p>

              <h3 className="text-md font-medium mb-2">Order Items</h3>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.bookId} className="flex gap-4 border-b pb-4">
                    <img
                      src={
                        item.book?.imageUrl
                          ? `http://localhost:5127/${item.book.imageUrl}`
                          : "https://via.placeholder.com/100x150"
                      }
                      alt={item.book?.title}
                      className="h-20 w-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        {item.book?.title || "Untitled"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        By {item.book?.author || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × Rs {item.price} = Rs{" "}
                        {item.quantity * item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffOrderPortal;
