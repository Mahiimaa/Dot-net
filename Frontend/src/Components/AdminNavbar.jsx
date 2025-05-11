import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  const navItems = [
    { name: "Home", icon: <Home size={18} />, path: "/" },
    { name: "Books", icon: <BookOpen size={18} />, path: "/adminbook" },
    { name: "Inventory", icon: <Package size={18} />, path: "/inventory" },
    { name: "Discounts & Sales", icon: <Percent size={18} />, path: "/discounts" },
    { name: "Announcements", icon: <Megaphone size={18} />, path: "/announcements" },
    { name: "Orders", icon: <ShoppingCart size={18} />, path: "/adminOrders" },
    { name: "Order Portal", icon: <ShoppingCart size={18} />, path: "/staff/orders" },
    { name: "Review", icon: <MessageSquare size={18} />, path: "/adminReview" },
    { name: "Settings", icon: <Settings size={18} />, path: "/adminSettings" },
  ];

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
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 gap-3 text-sm hover:bg-[#0b4f82]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;