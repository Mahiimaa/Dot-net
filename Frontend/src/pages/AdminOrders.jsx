import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "../Components/AdminNavbar";
import AdminTop from "../Components/AdminTop";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { CiSearch } from "react-icons/ci";

function AdminOrders() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check authentication and role
  useEffect(() => {
    if (!isAuthenticated || !["Staff", "Admin"].includes(user.role)) {
      navigate("/login");
    }
  }, [isAuthenticated, user.role, navigate]);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5127/api/Order/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Failed to fetch orders. Please try again.";
      setError(errorMessage);
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm) ||
        order.claimCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Handle order cancellation
  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.delete(`http://localhost:5127/api/Order/cancel/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o))
      );
      alert("Order cancelled successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Failed to cancel order. Please try again.";
      alert(errorMessage);
      console.error("Cancel failed:", err);
    }
  };

  // Handle order deletion
  const handleDelete = async (orderId) => {
    if (
      !window.confirm("Are you sure you want to permanently delete this order?")
    )
      return;
    try {
      await axios.delete(`http://localhost:5127/api/Order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      alert("Order deleted successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Failed to delete order. Please try again.";
      alert(errorMessage);
      console.error("Delete failed:", err);
    }
  };

  // Map status to display text
  const getStatusDisplay = (status) => {
    switch (status) {
      case "Pending":
        return "Processing";
      case "Fulfilled":
        return "Fulfilled";
      case "Cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

    const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="h-screen flex">
      <AdminNav />
      <div className="flex-1 flex flex-col">
        <AdminTop />
        <div className="p-6">
          <h2 className="text-center text-lg font-semibold mb-4">Orders</h2>
          <div className="flex border rounded-lg border-gray-300 items-center w-1/3 ml-auto mb-2">
            <CiSearch className="w-6 h-6" />
            <input
              type="text"
              placeholder="Search by customer name"
              className="border-none p-2 focus:outline-none focus:ring-0 focus:border-none w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              aria-label="Search books by title, author, or ISBN"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="overflow-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-black text-white text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Customer Name</th>
                  <th className="px-4 py-2 text-left">Books</th>
                  <th className="px-4 py-2 text-left">Claim Code</th>
                  <th className="px-4 py-2 text-left">Total Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Order Date</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="border-t"
                    >
                      <td className="px-4 py-2">{o.id}</td>
                      <td className="px-4 py-2">{o.userName}</td>
                      <td className="px-4 py-2" onClick={() => openModal(o)}>
                        {o.books.length > 1
                          ? `${o.books.length} items`
                          : o.books[0]?.book?.title || "N/A"}
                      </td>
                      <td className="px-4 py-2">{o.claimCode}</td>
                      <td className="px-4 py-2">Rs.{o.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        {getStatusDisplay(o.status)}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(o.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 space-y-2">
                        {o.status === "Pending" && (
                          <button
                            onClick={() => handleCancel(o.id)}
                            className="bg-red-600 text-white px-4 py-1 rounded w-full"
                          >
                            Cancel
                          </button>
                        )}
                        {user.role === "Admin" && (
                          <button
                            onClick={() => handleDelete(o.id)}
                            className="bg-red-800 text-white px-4 py-1 rounded w-full"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-[rgba(243,244,246,0.6)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <div className="space-y-4">
              <p>
                <strong>Order ID:</strong> {selectedOrder.id}
              </p>
              <p>
                <strong>Customer Name:</strong> {selectedOrder.userName}
              </p>
              <p>
                <strong>Claim Code:</strong> {selectedOrder.claimCode}
              </p>
              <p>
                <strong>Total Amount:</strong> Rs.
                {selectedOrder.totalAmount.toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {getStatusDisplay(selectedOrder.status)}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(selectedOrder.orderDate).toLocaleDateString()}
              </p>
              <div>
                <strong>Books:</strong>
                <ul className="list-disc pl-5 mt-2">
                  {selectedOrder.books.map((item, index) => (
                    <li key={index}>
                      {item.book?.title || "N/A"} (Quantity: {item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              {selectedOrder.status === "Pending" && (
                <button
                  onClick={() => handleCancel(selectedOrder.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Cancel Order
                </button>
              )}
              {user.role === "Admin" && (
                <button
                  onClick={() => handleDelete(selectedOrder.id)}
                  className="bg-red-800 text-white px-4 py-2 rounded"
                >
                  Delete Order
                </button>
              )}
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
