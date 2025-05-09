import React, { useState, useEffect } from "react";
import AdminNav from "../Components/AdminNavbar";
import AdminTop from "../Components/AdminTop";
import { CiSearch } from "react-icons/ci";

function AdminReview() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const url = bookId
          ? `http://localhost:5127/api/Reviews?bookId=${bookId}`
          : `http://localhost:5127/api/Reviews`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        console.log("Fetched reviews:", data);
        setReviews(data);
        setFilteredReviews(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [bookId]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = reviews.filter(
      (review) =>
        review.bookTitle?.toLowerCase().includes(query) ||
        review.comment?.toLowerCase().includes(query) ||
        review.memberName?.toLowerCase().includes(query)
    );
    setFilteredReviews(filtered);
  };

  const handleBookIdChange = (e) => {
    const value = e.target.value;
    setBookId(value);
    setSearchQuery("");
    setFilteredReviews(reviews);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Unknown Date" : date.toLocaleDateString();
  };

  return (
    <div className="h-screen flex ">
      <AdminNav />
      <div className="flex-1 flex flex-col">
        <AdminTop />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
          <div className="mb-4 flex justify-between w-1/2 gap-6">
            <div className="flex border rounded-lg border-gray-300 items-center w-full">
              <CiSearch className="w-6 h-6" />
              <input
                type="number"
                placeholder="Enter Book ID (leave empty for all reviews)"
                value={bookId}
                onChange={handleBookIdChange}
                className="border-none p-2 focus:outline-none focus:ring-0 focus:border-none w-full"
              />
            </div>
            <div className="flex border rounded-lg border-gray-300 items-center w-full">
              <CiSearch className="w-6 h-6" />
              <input
                type="text"
                placeholder="Search by book title, review content, or user..."
                value={searchQuery}
                onChange={handleSearch}
                className="border-none p-2 focus:outline-none focus:ring-0 focus:border-none w-full"
              />
            </div>
          </div>

          {loading && <p>Loading reviews...</p>}

          {error && <p className="text-red-500">Error: {error}</p>}

          {!loading && !error && (
            <div className="space-y-4">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <div
                    key={review.Id}
                    className="p-4 border rounded-md shadow-sm"
                  >
                    <p className="font-semibold">User: {review.memberName}</p>
                    <p className="text-gray-600">Book: {review.bookTitle}</p>
                    <p className="text-gray-600">Rating: {review.rating}/5</p>
                    <p className="text-gray-600">Comment: {review.comment}</p>
                    <p className="text-sm text-gray-400">
                      Posted on: {formatDate(review.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p>No reviews match your search.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReview;
