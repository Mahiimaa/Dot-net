import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Home,
  BookOpen,
  Package,
  Percent,
  Megaphone,
  ShoppingCart,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const { user} = useContext(AuthContext);

  const allNavItems = [
    { name: "Home", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Books", icon: <BookOpen size={18} />, path: "/adminbook" },
    { name: "Inventory", icon: <Package size={18} />, path: "/inventory" },
    { name: "Discounts & Sales", icon: <Percent size={18} />, path: "/discounts" },
    { name: "Announcements", icon: <Megaphone size={18} />, path: "/announcements" },
    { name: "Orders", icon: <ShoppingCart size={18} />, path: "/adminOrders" },
    { name: "Order Portal", icon: <ShoppingCart size={18} />, path: "/staff/orders" },
    { name: "Review", icon: <MessageSquare size={18} />, path: "/adminReview" },
    { name: "Settings", icon: <Settings size={18} />, path: "/adminSettings" },
  ];

  const navItems = user?.role === "Staff"
    ? allNavItems.filter(item => item.path === "/staff/orders" || item.path ===  "/adminOrders")
    : allNavItems;

  return (
    <div className="w-60 bg-[#07375c] text-white flex flex-col h-full">
      <div className="text-2xl font-bold p-4 border-b border-gray-500">Foliana</div>
      <nav className="flex flex-col flex-grow">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 gap-3 text-sm hover:bg-[#0b4f82] ${
                isActive ? "bg-[#5c2314]" : ""
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;