import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import MemNavbar from "../../Components/MemNavbar";
import SideProfile from "../../Components/SideProfile";
import { FaStar } from "react-icons/fa";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../Layout/Navbar";

const Review = () => {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!isAuthenticated) {
        setError("Please log in to view your reviews.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(
          `/api/Reviews/my-reviews?page=${page}&pageSize=${pageSize}`
        );
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data;
        console.log("Fetched reviews data:", data);
        setReviews(data.reviews || []);
        setTotalReviews(data.totalReviews || 0);
      } catch (err) {
        console.error("Failed to fetch user reviews:", err);
        setError(
          err.response?.data?.error ||
            "Failed to load reviews. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [isAuthenticated, page, pageSize]);

  const totalPages = Math.ceil(totalReviews / pageSize);

  const tabs = [
    { name: "Account Overview", path: "/account" },
    { name: "Orders", path: "/order" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Reviews", path: "/review" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6 mt-8">
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
            {loading && <p className="text-gray-600">Loading reviews...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && reviews.length === 0 && (
              <p className="text-gray-500">
                You haven’t written any reviews yet.
              </p>
            )}
            {!loading && !error && reviews.length > 0 && (
              <>
                <div className="flex flex-col gap-6">
                  {reviews.map((review) => (
                    <Link
                      key={review.id}
                      to={`/books/${review.bookId}`}
                      className="block"
                    >
                      <div className="bg-white rounded-xl p-4 shadow border flex gap-4">
                        <img
                          src={
                            review.image &&
                            review.image !==
                              "https://via.placeholder.com/80x120"
                              ? `http://localhost:5127/${review.image}`
                              : "https://via.placeholder.com/80x120"
                          }
                          alt={review.title}
                          className="h-32 rounded"
                        />
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
                          <p className="text-sm text-gray-700">
                            {review.reviewText}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {totalReviews > 6 && (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 bg-brown-500 text-white rounded-lg hover:bg-brown-600 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-gray-700 font-medium">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages}
                      className="px-4 py-2 bg-brown-500 text-white rounded-lg hover:bg-brown-600 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
