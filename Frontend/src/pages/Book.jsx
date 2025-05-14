import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import * as signalR from "@microsoft/signalr";
import { debounce } from "lodash";
import api from "../api/axios";
import Navbar from "./Layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import Footer from "./Layout/Footer";

const BookCard = ({
  book,
  addToCart,
  isAuthenticated,
  isInWishlist,
  toggleWishlist,
}) => {
  const parseUTCDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr + (dateStr.endsWith("Z") ? "" : "Z"));
  };

  const isDiscountActive =
    book.isOnSale &&
    (!book.discountStart || parseUTCDate(book.discountStart) <= new Date()) &&
    (!book.discountEnd || parseUTCDate(book.discountEnd) >= new Date());

  const isCartDisabled =
    book.availability === "Out of Stock" ||
    book.availability === "Library Only";

  return (
    <div className="relative border rounded-lg p-6 flex flex-col items-center shadow-md hover:shadow-lg transition h-full bg-white">
      {isDiscountActive && (
        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
          On Sale!
        </span>
      )}
      <Link to={`/books/${book.id}`} className="w-full flex justify-center">
        <img
          src={
            book.imageUrl
              ? `http://localhost:5127/${book.imageUrl}`
              : "https://via.placeholder.com/150x200?text=Book+Cover"
          }
          alt={book.title}
          className="w-80 h-56 object-contain rounded-md p-4 bg-white"
        />
      </Link>
      <div className="absolute top-3 right-3 flex space-x-2">
        {isAuthenticated && (
          <>
            <button
              onClick={() => addToCart(book.id)}
              className={`bg-gray-100 p-2 rounded-full transition shadow-sm ${
                isCartDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200"
              }`}
              title={isCartDisabled ? "Not available for cart" : "Add to Cart"}
              aria-label={
                isCartDisabled
                  ? "Book not available for cart"
                  : "Add book to cart"
              }
              disabled={isCartDisabled}
            >
              🛒
            </button>
            <button
              onClick={() => toggleWishlist(book.id)}
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition shadow-sm"
              title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              aria-label={
                isInWishlist
                  ? "Remove book from wishlist"
                  : "Add book to wishlist"
              }
            >
              <Heart
                className="w-5 h-5"
                fill={isInWishlist ? "red" : "none"}
                stroke="red"
              />
            </button>
          </>
        )}
      </div>
      <div className="w-full mt-4 px-2">
        <Link to={`/books/${book.id}`} className="hover:underline">
          <h3
            className="text-lg font-semibold text-center line-clamp-2"
            title={book.title}
          >
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 text-center mt-1">{book.author}</p>
        <p className="text-xs text-gray-500 text-center mt-1">
          {book.genre} | {book.format}
        </p>
        <div className="flex justify-center items-center mt-2">
          {[...Array(book.rating || 0)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg">
              ★
            </span>
          ))}
          {[...Array(5 - (book.rating || 0))].map((_, i) => (
            <span key={i} className="text-gray-300 text-lg">
              ★
            </span>
          ))}
        </div>
        <p className="mt-2 text-center font-medium">
          {isDiscountActive ? (
            <>
              <span className="line-through text-gray-500 mr-2">
                Rs. {book.price}
              </span>
              <span className="text-green-600">
                Rs. {(book.price * (1 - book.discountPercent / 100)).toFixed(2)}
              </span>
            </>
          ) : (
            `Rs. ${book.price}`
          )}
        </p>
        <p
          className={`text-xs text-center mt-1 ${
            book.availability === "Available"
              ? "text-green-600"
              : "text-blue-600"
          }`}
        >
          {book.availability}
        </p>
      </div>
    </div>
  );
};

const Book = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    author: "",
    genre: "",
    availability: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    language: "",
    format: "",
    publisher: "",
  });
  const [sortBy, setSortBy] = useState("");
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "All Books"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const booksPerPage = 6;
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [activeAnnouncementIndex, setActiveAnnouncementIndex] = useState(0);

  // Debounce search query updates
  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchQuery(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSetSearch(value);
  };

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      setCurrentPage(1);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const booksResponse = await api.get("/api/Books", {
          params: {
            search: debouncedSearchQuery || undefined,
            author: filters.author || undefined,
            genre: filters.genre || undefined,
            availability: filters.availability || undefined,
            minPrice: filters.minPrice || undefined,
            maxPrice: filters.maxPrice || undefined,
            rating: filters.rating || undefined,
            language: filters.language || undefined,
            format: filters.format || undefined,
            publisher: filters.publisher || undefined,
            sortBy: sortBy || undefined,
            tab: activeTab !== "All Books" ? activeTab : undefined,
            page: currentPage,
            pageSize: booksPerPage,
          },
        });

        const books = booksResponse.data.books || [];
        setBooks(books);
        setTotalBooks(booksResponse.data.total || 0);
        setTotalPages(Math.ceil(booksResponse.data.total / booksPerPage) || 1);

        const announcementsResponse = await api.get("/api/Announcements");
        const activeAnnouncements = announcementsResponse.data.filter(
          (ann) =>
            (!ann.startDate ||
              new Date(
                ann.startDate + (ann.startDate.endsWith("Z") ? "" : "Z")
              ) <= new Date()) &&
            (!ann.endDate ||
              new Date(ann.endDate + (ann.endDate.endsWith("Z") ? "" : "Z")) >=
                new Date())
        );
        setAnnouncements(activeAnnouncements);

        if (isAuthenticated && user?.id) {
          const wishlistResponse = await api.get(
            `/api/Wishlist/user/${user.id}`
          );
          setWishlistItems(wishlistResponse.data || []);
        } else {
          setWishlistItems([]);
        }
      } catch (err) {
        if (err.response?.status === 500) {
          setError(
            "Failed to load books. Please try a different query or try again later."
          );
        } else {
          setError(
            "Failed to load data. Please check your network and try again."
          );
        }
        console.error(
          "Fetch error:",
          err.response?.status,
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    filters,
    sortBy,
    activeTab,
    currentPage,
    debouncedSearchQuery,
    isAuthenticated,
    user,
  ]);

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setActiveAnnouncementIndex((prev) => (prev + 1) % announcements.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5127/orderHub", { withCredentials: true })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("orderBroadcast", (message) => {
      console.log("Received broadcast:", message);
      setBroadcastMessage(message);
      setTimeout(() => setBroadcastMessage(""), 5000);
    });

    connection.onreconnecting((error) => {
      console.warn("SignalR reconnecting:", error?.message);
      setConnectionStatus("reconnecting");
    });

    connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected with ID:", connectionId);
      setConnectionStatus("connected");
    });

    connection.onclose((error) => {
      console.error("SignalR connection closed:", error?.message);
      setConnectionStatus("disconnected");
    });

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR connection started");
        setConnectionStatus("connected");
      } catch (err) {
        console.error("SignalR connection failed:", err.message);
        setConnectionStatus("failed");
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      console.log("Stopping SignalR connection");
      connection
        .stop()
        .catch((err) => console.error("Error stopping SignalR:", err.message));
    };
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      author: "",
      genre: "",
      availability: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      language: "",
      format: "",
      publisher: "",
    });
    setSortBy("");
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setCurrentPage(1);
  };

  const toggleFilterSection = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  const addToCart = async (bookId) => {
    if (!isAuthenticated || !user?.id) {
      alert("Please log in to add to cart.");
      navigate("/login");
      return;
    }
    try {
      await api.post("/api/Cart/add", {
        userId: user.id,
        bookId,
        quantity: 1,
      });
      alert("Book added to cart!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to add to cart. Please try again.";
      alert(errorMessage);
      console.error(
        "Add to cart error:",
        err.response?.status,
        err.response?.data || err.message
      );
    }
  };

  const toggleWishlist = async (bookId) => {
    if (!isAuthenticated || !user?.id) {
      alert("Please log in to add to wishlist.");
      navigate("/login");
      return;
    }
    try {
      const wishlistItem = wishlistItems.find((item) => item.bookId === bookId);
      if (wishlistItem) {
        await api.delete(`/api/Wishlist/remove/${wishlistItem.id}`);
        setWishlistItems((prev) =>
          prev.filter((item) => item.bookId !== bookId)
        );
        alert("Book removed from wishlist!");
      } else {
        const response = await api.post("/api/Wishlist/add", {
          userId: user.id,
          bookId,
        });
        const wishlistResponse = await api.get(`/api/Wishlist/user/${user.id}`);
        setWishlistItems(wishlistResponse.data || []);
        alert("Book added to wishlist!");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to update wishlist. Please try again.";
      alert(errorMessage);
      console.error(
        "Wishlist error:",
        err.response?.status,
        err.response?.data || err.message
      );
    }
  };

  const authors = [...new Set(books.map((b) => b.author).filter(Boolean))];
  const genres = [...new Set(books.map((b) => b.genre).filter(Boolean))];
  const languages = [...new Set(books.map((b) => b.language).filter(Boolean))];
  const formats = [...new Set(books.map((b) => b.format).filter(Boolean))];
  const publishers = [
    ...new Set(books.map((b) => b.publisher).filter(Boolean)),
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F6EFE4]">
        <style>
          {`
            .announcement-carousel {
            position: relative;
            max-width: 1400px;
            margin: 0 auto 2rem;
            overflow: hidden;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Softer shadow for minimal look */
            background: linear-gradient(135deg, #fce7f3, #dbeafe); /* Pastel pink to pastel blue gradient */
            padding: 12px;
            border: 1px solid #e5e7eb; /* Light gray border to match theme */
            animation: pulse 4s ease-in-out infinite; /* Gentle pulse to attract attention */
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }
            50% {
              transform: scale(1.01); /* Subtle scale for pulse effect */
              box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
            }
          }

          .announcement-item {
            display: none;
            opacity: 0;
            transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
          }

          .announcement-item.active {
            display: block;
            opacity: 1;
            transform: translateY(0) scale(1);
            animation: fadeScaleIn 0.6s ease-in-out; /* Combined fade, slide, and scale animation */
          }

          .announcement-item:not(.active) {
            transform: translateY(10px) scale(0.95); /* Starting position and scale */
          }

          .announcement-item p {
            color: #4b5563; /* text-gray-600 for soft text */
            font-size: 1.2rem;
            font-weight: 500; /* Medium weight for minimal aesthetic */
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 14px 20px;
            line-height: 1.6;
            display: inline-block;
            animation: marquee 10s linear infinite; /* Smooth marquee */
            transition: color 0.3s, text-shadow 0.3s; /* Smooth hover transition */
          }

          .announcement-item p:hover {
            animation-play-state: paused;
            color: #374151; /* text-gray-700 for hover */
            text-shadow: 0 0 8px rgba(147, 197, 253, 0.5); /* Subtle blue glow */
            cursor: pointer;
          }

          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }

          @keyframes fadeScaleIn {
            0% {
              opacity: 0;
              transform: translateY(10px) scale(0.95);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .carousel-dots {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 12px;
          }

          .carousel-dot {
            width: 10px;
            height: 10px;
            background: #d1d5db; /* gray-300 for inactive dots */
            border-radius: 50%;
            cursor: pointer;
            transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
          }

          .carousel-dot.active {
            background: #93c5fd; /* Pastel blue (blue-300) for theme consistency */
            transform: scale(1.2);
            box-shadow: 0 0 6px rgba(147, 197, 253, 0.6); /* Subtle blue glow */
          }

          .carousel-dot:hover {
            background: #60a5fa; /* blue-400 for hover */
            transform: scale(1.1);
            box-shadow: 0 0 8px rgba(147, 197, 253, 0.4);
          }

          @media (max-width: 640px) {
            .announcement-carousel {
              margin: 0 1rem 1.5rem;
              padding: 10px;
              border-radius: 10px;
              box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
              animation: pulse 4s ease-in-out infinite; /* Maintain pulse on mobile */
            }

            .announcement-item p {
              font-size: 1.05rem;
              padding: 12px 16px;
            }

            .carousel-dot {
              width: 8px;
              height: 8px;
            }
          }
          `}
        </style>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center">
              <p className="text-lg text-gray-600">Loading books...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 text-center mb-6 rounded-lg border border-red-200">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          ) : (
            <>
              {announcements.length > 0 && (
                <div className="announcement-carousel">
                  {announcements.map((ann, index) => (
                    <div
                      key={ann.id}
                      className={`announcement-item ${
                        index === activeAnnouncementIndex ? "active" : ""
                      }`}
                    >
                      <p>{ann.message}</p>
                    </div>
                  ))}
                  {announcements.length > 1 && (
                    <div className="carousel-dots">
                      {announcements.map((_, index) => (
                        <span
                          key={index}
                          className={`carousel-dot ${
                            index === activeAnnouncementIndex ? "active" : ""
                          }`}
                          onClick={() => setActiveAnnouncementIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {broadcastMessage && (
                <div className="bg-yellow-100 p-4 text-center mb-6 rounded-lg border border-yellow-200 animate-pulse">
                  <p className="text-yellow-800 font-medium">
                    📢 {broadcastMessage}
                  </p>
                </div>
              )}

              {connectionStatus !== "connected" && (
                <div className="bg-orange-100 p-4 text-center mb-6 rounded-lg border border-orange-200">
                  <p className="text-orange-800 font-medium">
                    SignalR Status: {connectionStatus}
                  </p>
                </div>
              )}

              <div className="max-w-4xl mx-auto text-center mb-10">
                <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">
                  Explore Our Extensive Book Collection
                </h1>
                <p className="text-lg text-gray-600">
                  Discover a vast array of books across various genres, from
                  captivating novels to insightful non-fiction. Browse our
                  curated selection and find your next literary adventure!
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                  "All Books",
                  "Bestsellers",
                  "Award Winners",
                  "New Releases",
                  "New Arrivals",
                  "Coming Soon",
                  "Deals",
                ].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-full transition ${
                      activeTab === tab
                        ? "bg-blue-900 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                    }`}
                    onClick={() => {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="search-container mb-10 ">
                <input
                  type="text"
                  placeholder="Search by title, ISBN, or description..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm mb-8 mt-8">
                <button
                  onClick={toggleFilterSection}
                  className="w-full flex justify-between items-center text-xl font-semibold text-gray-800"
                >
                  <span>Filter Books</span>
                  {isFilterExpanded ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </button>

                {isFilterExpanded && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Author
                      </label>
                      <select
                        name="author"
                        value={filters.author}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="">All Authors</option>
                        {authors.map((author) => (
                          <option key={author} value={author}>
                            {author}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Genre
                      </label>
                      <select
                        name="genre"
                        value={filters.genre}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="">All Genres</option>
                        {genres.map((genre) => (
                          <option key={genre} value={genre}>
                            {genre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                      <select
                        name="availability"
                        value={filters.availability}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="">All Availability</option>
                        <option value="Available">Available</option>
                        <option value="Library Only">Library Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <select
                        name="rating"
                        value={filters.rating}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="">All Ratings</option>
                        <option value="4">4+ Stars</option>
                        <option value="3">3+ Stars</option>
                        <option value="2">2+ Stars</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        name="language"
                        value={filters.language}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="">All Languages</option>
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Format
                      </label>
                      <select
                        name="format"
                        value={filters.format}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="">All Formats</option>
                        {formats.map((format) => (
                          <option key={format} value={format}>
                            {format}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Publisher
                      </label>
                      <select
                        name="publisher"
                        value={filters.publisher}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="">All Publishers</option>
                        {publishers.map((pub) => (
                          <option key={pub} value={pub}>
                            {pub}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Range
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          name="minPrice"
                          value={filters.minPrice}
                          onChange={handleFilterChange}
                          placeholder="Min"
                          className="w-1/2 p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        <input
                          type="number"
                          name="maxPrice"
                          value={filters.maxPrice}
                          onChange={handleFilterChange}
                          placeholder="Max"
                          className="w-1/2 p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-end mt-4 space-x-3">
                      <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                  <div className="text-teal-800 bg-teal-100 p-2 rounded-md mb-3 sm:mb-0">
                    {books.length > 0
                      ? `Showing ${books.length} of ${totalBooks} books`
                      : "No books match your filters"}
                  </div>
                  <div className="flex items-center">
                    <label className="mr-2 text-sm font-medium text-gray-700">
                      Sort by:
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="p-2 border border-gray-300 rounded-md shadow-sm"
                      disabled={books.length === 0}
                    >
                      <option value="">Default</option>
                      <option value="title">Title (A-Z)</option>
                      <option value="publishDate">
                        Publication Date (Newest)
                      </option>
                      <option value="priceLow">Price (Low to High)</option>
                      <option value="priceHigh">Price (High to Low)</option>
                      <option value="popularity">Popularity (Most Sold)</option>
                    </select>
                  </div>
                </div>

                {books.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      No books found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filters, or clear the search
                      term.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {books.map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          addToCart={addToCart}
                          isAuthenticated={isAuthenticated}
                          isInWishlist={wishlistItems.some(
                            (item) => item.bookId === book.id
                          )}
                          toggleWishlist={toggleWishlist}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex justify-center mt-12">
                        <nav
                          className="inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-l-md border ${
                              currentPage === 1
                                ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            Previous
                          </button>
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`px-4 py-2 border ${
                                currentPage === i + 1
                                  ? "z-10 bg-blue-900 border-blue-900 text-white"
                                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.min(p + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-r-md border ${
                              currentPage === totalPages
                                ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Book;
