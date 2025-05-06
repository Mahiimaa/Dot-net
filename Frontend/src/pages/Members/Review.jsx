import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import MemNavbar from "../../Components/MemNavbar";
import SideProfile from "../../Components/SideProfile";
import { FaStar } from "react-icons/fa";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const Review = () => {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!isAuthenticated) return;
        const response = await api.get("/api/Reviews/my-reviews");
        setReviews(response.data);
      } catch (err) {
        console.error("Failed to fetch user reviews:", err);
      }
    };
    fetchReviews();
  }, [isAuthenticated]);


  const tabs = [
    { name: "Account Overview", path: "/account" },
    { name: "Orders", path: "/order" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Reviews", path: "/review" },
    { name: "Settings", path: "/setting" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <MemNavbar />

      <div className="flex gap-8">
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

          <h2 className="text-lg font-semibold mb-4">Your Reviews</h2>

          <div className="flex flex-col gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow border flex gap-4">
                <img src={review.image || 'https://via.placeholder.com/80x120'} alt={review.title} className="h-32 rounded" />
                <div>
                  <h3 className="font-semibold">{review.title}</h3>
                  <p className="text-gray-500 mb-2">{review.author}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {Array(review.rating)
                      .fill(0)
                      .map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-gray-700">{review.reviewText}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
