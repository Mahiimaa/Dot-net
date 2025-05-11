import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SideProfile from "../../Components/SideProfile";
import Navbar from "../Layout/Navbar";

const Account = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const API_BASE_URL = "http://localhost:5127";

  const tabs = [
    { name: "Account Overview", path: "/account" },
    { name: "Orders", path: "/order" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Reviews", path: "/review" },
    { name: "Settings", path: "/settings" },
  ];

  const fetchData = async (isManualRetry = false) => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    let userId;

    if (user && user.id) {
      userId = user.id;
    } else if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        userId = parsedUser.id;
        if (!userId) {
          setError("Invalid user data. Please log in again.");
          navigate("/login");
          return;
        }
      } catch (err) {
        setError("Failed to parse user data. Please log in again.");
        navigate("/login");
        return;
      }
    } else {
      setError("No user data found. Please log in.");
      navigate("/login");
      return;
    }

    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const ordersResponse = await fetch(`${API_BASE_URL}/api/Order/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (ordersResponse.status === 401) {
        localStorage.clear();
        setError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!ordersResponse.ok) {
        const errorText = await ordersResponse.text();
        throw new Error(`Failed to fetch orders: ${errorText || "Unknown error"}`);
      }

      const ordersData = await ordersResponse.json();
      setOrders(ordersData);

      const wishlistResponse = await fetch(`${API_BASE_URL}/api/Wishlist/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (wishlistResponse.status === 401) {
        localStorage.clear();
        setError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!wishlistResponse.ok) {
        const errorText = await wishlistResponse.text();
        throw new Error(`Failed to fetch wishlist: ${errorText || "Unknown error"}`);
      }

      const wishlistData = await wishlistResponse.json();
      setWishlist(wishlistData);
    } catch (err) {
      console.error("Error:", err.message);
      if (err.message.includes("Failed to fetch")) {
        setError(
          `Cannot connect to the server at ${API_BASE_URL}. Ensure the backend is running and the port is correct.`
        );
        if (!isManualRetry && retryCount < 3) {
          setTimeout(() => setRetryCount(retryCount + 1), 2000);
        }
      } else {
        setError(err.message);
      }
      if (err.message.includes("401")) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate, retryCount]);

  const handleRetry = () => {
    setLoading(true);
    fetchData(true);
  };

  // Calculate statistics
  const booksPurchased = orders.reduce((sum, order) => {
    const items = order.OrderItems || order.orderItems || [];
    return sum + items.reduce((s, item) => s + (item.Quantity || item.quantity || 0), 0);
  }, 0);

  const totalOrders = orders.length;

  const discountEarned = orders
    .reduce((sum, order) => {
      const items = order.OrderItems || order.orderItems || [];
      const subtotal = items.reduce((s, item) => {
        const price = item.Price || item.price || 0;
        const quantity = item.Quantity || item.quantity || 0;
        return s + quantity * price;
      }, 0);
      const discount = subtotal - (order.TotalAmount || order.totalAmount || 0);
      return sum + (discount > 0 ? discount : 0);
    }, 0)
    .toFixed(2);

  const upcomingPickups = orders
    .filter((order) => ["Pending", "Fulfilled"].includes(order.Status || order.status))
    .slice(0, 2);

  const recentActivities = [
    ...orders
      .slice(0, 2)
      .map((order) => {
        const items = order.OrderItems || order.orderItems || [];
        return {
          icon: "🛒",
          title: "Order Placed",
          desc: `You ordered ${
            items.length > 1
              ? `${items.length} books`
              : items[0]?.Book?.Title || items[0]?.book?.title || "Unknown"
          }`,
        };
      }),
    ...wishlist
      .slice(0, 1)
      .map((item) => ({
        icon: "❤️",
        title: "Book Added to Wishlist",
        desc: `Added '${item.Book?.Title || item.book?.title || "Unknown"}' to your wishlist`,
      })),
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>
            <Link
              to="/login"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6 mt-8">
          <SideProfile />
          <div className="w-3/4 space-y-6">
            {/* Profile Summary */}
            {/* <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user?.firstName || "User"}!</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {user?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Membership ID:</span> {user?.membershipId || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Joined:</span>{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <Link
                to="/setting"
                className="mt-4 inline-block bg-brown-600 text-white px-4 py-2 rounded-lg hover:bg-brown-700 transition"
              >
                Edit Profile
              </Link>
            </div> */}

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
                  
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard number={booksPurchased} label="Books Purchased" />
              <StatCard number={totalOrders} label="Total Orders" />
              <StatCard number={`Rs.${discountEarned}`} label="Discounts Earned" />
            </div>

            {/* Upcoming Pickups */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Upcoming Pickups</h3>
                {upcomingPickups.length > 0 && (
                  <Link to="/order" className="text-brown-600 hover:text-brown-700 text-sm">
                    View All
                  </Link>
                )}
              </div>
              {upcomingPickups.length > 0 ? (
                upcomingPickups.map((order) => (
                  <PickupCard
                    key={order.Id || order.id}
                    title={
                      (order.OrderItems || order.orderItems || []).length > 1
                        ? "Multiple Items"
                        : (order.OrderItems?.[0]?.Book?.Title ||
                           order.orderItems?.[0]?.book?.title ||
                           "Unknown")
                    }
                    author={
                      (order.OrderItems || order.orderItems || []).length > 1
                        ? `Order #${order.Id || order.id}`
                        : (order.OrderItems?.[0]?.Book?.Author ||
                           order.orderItems?.[0]?.book?.author ||
                           "Unknown")
                    }
                    imageUrl={
                      (order.OrderItems?.[0]?.Book?.ImageUrl ||
                        order.orderItems?.[0]?.book?.imageUrl)
                        ? `${API_BASE_URL}/${order.OrderItems?.[0]?.Book?.ImageUrl ||
                            order.orderItems?.[0]?.book?.imageUrl}`
                        : "https://via.placeholder.com/60x90"
                    }
                    status={order.Status || order.status}
                    date={new Date(order.OrderDate || order.orderDate).toLocaleDateString()}
                    code={order.ClaimCode || order.claimCode}
                    badgeColor={(order.Status || order.status) === "Fulfilled" ? "green" : "orange"}
                  />
                ))
              ) : (
                <p className="text-gray-500">No upcoming pickups.</p>
              )}
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
                {recentActivities.length > 0 && (
                  <Link to="/order" className="text-brown-600 hover:text-brown-700 text-sm">
                    View All
                  </Link>
                )}
              </div>
              {recentActivities.length > 0 ? (
                recentActivities.map((item, index) => (
                  <RecentItem
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    desc={item.desc}
                  />
                ))
              ) : (
                <p className="text-gray-500">No recent activities.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ number, label }) => (
  <div className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition">
    <div className="text-3xl font-bold text-gray-800">{number}</div>
    <div className="text-sm text-gray-600 mt-1">{label}</div>
  </div>
);

const PickupCard = ({ title, author, imageUrl, status, date, code, badgeColor }) => (
  <div className="flex items-center gap-4 mb-4 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
    <img
      src={imageUrl}
      alt={title}
      className="w-16 h-24 rounded object-cover"
      onError={(e) => (e.target.src = "https://via.placeholder.com/60x90")}
    />
    <div className="flex-1">
      <h4 className="font-semibold text-lg text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500">{author}</p>
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            badgeColor === "green"
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {status}
        </span>
        <span className="text-xs text-gray-500">Claim by: {date}</span>
      </div>
      {code && (
        <div className="mt-2 text-xs text-gray-700">
          Claim code: <span className="font-semibold">{code}</span>
        </div>
      )}
    </div>
  </div>
);

const RecentItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 mb-3 p-2 rounded-lg hover:bg-gray-50 transition">
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="font-medium text-sm text-gray-800">{title}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  </div>
);

export default Account;