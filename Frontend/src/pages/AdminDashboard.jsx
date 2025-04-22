import React, {useState, useEffect} from 'react'
import AdminNav from "../Components/AdminNavbar"
import AdminTop from "../Components/AdminTop"
import { PackageCheck, DollarSign, BookOpenText, Megaphone, ClipboardList, Gift, ShoppingCart } from "lucide-react";

function AdminDashboard() {
    const [stats, setStats] = useState({
        books: 0,
        inventory: 0,
        discounts: 0,
        announcements: 0,
        orders: 0,
        readyOrders: 0,
        revenue: 0,
      });

      const [recentOrders, setRecentOrders] = useState([]);
    
      const fetchDashboardStats = async () => {
        try {
          const [booksRes, inventoryRes, discountsRes, announcementsRes, ordersRes] =
            await Promise.all([
              axios.get("http://localhost:5000/api/books"),
              axios.get("http://localhost:5000/api/inventory"),
              axios.get("http://localhost:5000/api/discounts"),
              axios.get("http://localhost:5000/api/announcements"),
              axios.get("http://localhost:5000/api/orders"),
            ]);
    
          const readyOrders = ordersRes.data.filter(
            (order) => order.status === "Ready for Pickup"
          );
          const totalRevenue = ordersRes.data.reduce(
            (sum, o) => sum + Number(o.totalAmount || 0),
            0
          );
    
          const recent = ordersRes.data.slice(0, 5); // latest 5
    
          setStats({
            books: booksRes.data.length,
            inventory: inventoryRes.data.length,
            discounts: discountsRes.data.length,
            announcements: announcementsRes.data.length,
            orders: ordersRes.data.length,
            readyOrders: readyOrders.length,
            revenue: totalRevenue,
          });
    
          setRecentOrders(recent);
        } catch (err) {
          console.error("Failed to load dashboard stats", err);
        }
      };
    
      useEffect(() => {
        fetchDashboardStats();
      }, []);    
  return (
    <div className="h-screen w-screen flex overflow-hidden">
        <AdminNav />
        <div className='flex-1 flex flex-col'>
        <AdminTop />
        <div className="p-6 space-y-8 overflow-y-auto">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard label="Total Books" value={stats.books} icon={<BookOpenText />} color="bg-blue-100" />
            <StatCard label="Inventory Items" value={stats.inventory} icon={<PackageCheck />} color="bg-amber-100" />
            <StatCard label="Active Discounts" value={stats.discounts} icon={<Gift />} color="bg-pink-100" />
            <StatCard label="Announcements" value={stats.announcements} icon={<Megaphone />} color="bg-purple-100" />
            <StatCard label="Total Orders" value={stats.orders} icon={<ShoppingCart />} color="bg-sky-100" />
            <StatCard label="Ready for Pickup" value={stats.readyOrders} icon={<ClipboardList />} color="bg-green-100" />
            <StatCard label="Total Revenue" value={`Rs. ${stats.revenue}`} icon={<DollarSign />} color="bg-emerald-100" />
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
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon, color }) => (
  <div className={`p-5 rounded-lg shadow border ${color} flex items-center gap-4`}>
    <div className="bg-white p-2 rounded-full shadow">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);
export default AdminDashboard