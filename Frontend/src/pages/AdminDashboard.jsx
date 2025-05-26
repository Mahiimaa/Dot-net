import React, { useState, useEffect } from "react";
import AdminNav from "../Components/AdminNavbar";
import AdminTop from "../Components/AdminTop";
import {
  PackageCheck,
  DollarSign,
  BookOpenText,
  Megaphone,
  ClipboardList,
  Gift,
  ShoppingCart,
  Users,
} from "lucide-react";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    books: 0,
    inventory: 0,
    discounts: 0,
    announcements: 0,
    orders: 0,
    readyOrders: 0,
    revenue: 0,
    users: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  console.log('AdminDashboard - Token before refresh:', token);
  console.log('AdminDashboard - UserData before refresh:', userData);
  const fetchDashboardStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
    setError("No authentication token found. Please log in.");
    setIsLoading(false);
    return;
  }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const [
        booksRes,
        inventoryRes,
        discountsRes,
        announcementsRes,
        ordersRes,
        usersRes,
      ] = await Promise.all([
        axios.get("http://localhost:5127/api/books", config),
        axios.get("http://localhost:5127/api/inventory", config),
        axios.get("http://localhost:5127/api/discounts", config),
        axios.get("http://localhost:5127/api/announcements", config),
        axios.get("http://localhost:5127/api/Order/all", config),
        axios.get("http://localhost:5127/api/users", config),
      ]);
      if (!booksRes.data || !ordersRes.data) {
        throw new Error("Invalid data from API");
      }
      const booksData = booksRes.data?.books || booksRes.data || [];
      const inventoryData =
        inventoryRes.data?.inventory || inventoryRes.data || [];
      const discountsData =
        discountsRes.data?.discounts || discountsRes.data || [];
      const announcementsData =
        announcementsRes.data?.announcements || announcementsRes.data || [];
      const ordersData = ordersRes.data?.orders || ordersRes.data || [];
      const usersData = usersRes.data?.users || usersRes.data || [];

      console.log("Processed booksData:", booksData);
      console.log("Processed ordersData:", ordersData);

      const readyOrders =
        ordersData.filter((order) => order.Status === "Ready for Pickup") || [];
      const totalRevenue =
        ordersData.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0) || 0;
      const recent =
        ordersData.slice(0, 5).map((o) => {
          console.log("Order books for ID", o.id, ":", o.books); // Detailed logging
          return {
            id: o.id,
            customerName: o.userName,
            bookName:
              o.books
                ?.map((book) => book.book?.title)
                .filter(Boolean)
                .join(", ") || "N/A",
            totalAmount: o.totalAmount,
            status: o.status,
          };
        }) || [];

      console.log("Recent Orders:", recent);
      setStats({
        books: booksData.length || 0,
        inventory: inventoryData.length || 0,
        discounts: discountsData.length || 0,
        announcements: announcementsData.length || 0,
        orders: ordersData.length || 0,
        readyOrders: readyOrders.length,
        revenue: totalRevenue,
        users: usersData.length || 0,
      });
      setRecentOrders(recent);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load dashboard stats", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(
        `Failed to load dashboard data: ${err.response?.status || err.message}`
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <AdminNav />
      <div className="flex-1 flex flex-col">
        <AdminTop />
        <div className="p-6 space-y-8 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading dashboard...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                  label="Total Books"
                  value={stats.books}
                  icon={<BookOpenText />}
                  color="bg-blue-100"
                />
                <StatCard
                  label="Inventory Items"
                  value={stats.inventory}
                  icon={<PackageCheck />}
                  color="bg-amber-100"
                />
                <StatCard
                  label="Active Discounts"
                  value={stats.discounts}
                  icon={<Gift />}
                  color="bg-pink-100"
                />
                <StatCard
                  label="Announcements"
                  value={stats.announcements}
                  icon={<Megaphone />}
                  color="bg-purple-100"
                />
                <StatCard
                  label="Total Orders"
                  value={stats.orders}
                  icon={<ShoppingCart />}
                  color="bg-sky-100"
                />
                <StatCard
                  label="Ready for Pickup"
                  value={stats.readyOrders}
                  icon={<ClipboardList />}
                  color="bg-green-100"
                />
                <StatCard
                  label="Total Revenue"
                  value={`Rs. ${stats.revenue}`}
                  icon={<DollarSign />}
                  color="bg-emerald-100"
                />
                <StatCard
                  label="Total Users"
                  value={stats.users}
                  icon={<Users />}
                  color="bg-indigo-100"
                />
              </div>

              {/* Recent Orders */}
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                {recentOrders.length === 0 ? (
                  <p className="text-gray-500">No recent orders.</p>
                ) : (
                  <div className="overflow-auto">
                    <table className="w-full text-sm border">
                      <thead className="bg-gray-200 text-left">
                        <tr>
                          <th className="px-4 py-2">Order ID</th>
                          <th className="px-4 py-2">Customer</th>
                          <th className="px-4 py-2">Book</th>
                          <th className="px-4 py-2">Amount</th>
                          <th className="px-4 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((o) => (
                          <tr key={o.id} className="border-t">
                            <td className="px-4 py-2">{o.id}</td>
                            <td className="px-4 py-2">{o.customerName}</td>
                            <td className="px-4 py-2">{o.bookName}</td>
                            <td className="px-4 py-2">Rs. {o.totalAmount}</td>
                            <td className="px-4 py-2">
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  o.status === "Ready for Pickup"
                                    ? "bg-green-200 text-green-800"
                                    : "bg-yellow-200 text-yellow-800"
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon, color }) => (
  <div
    className={`p-5 rounded-lg shadow border ${color} flex items-center gap-4`}
  >
    <div className="bg-white p-2 rounded-full shadow">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);
export default AdminDashboard;
