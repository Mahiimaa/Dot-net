import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import backgroundImg from '../assets/Background.png';
import bgPattern from '../assets/Images/Bg.jpg';
import api from '../api/axios'; 
import book1 from '../assets/Books/book1.jpg';
import book2 from '../assets/Books/book2.jpg';
import book3 from '../assets/Books/book3.jpeg';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bestSellers, setBestSellers] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   setIsLoggedIn(!!token);
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  // Fetch Best Sellers and Featured Books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const bestSellersResponse = await api.get('/api/Books', {
          params: {
            tab: 'Bestsellers',
            page: 1,
            pageSize: 10,
          },
        });
        setBestSellers(bestSellersResponse.data.books || []);

        const featuredResponse = await api.get('/api/Books', {
          params: {
            isFeatured: true,
            page: 1,
            pageSize: 3, 
          },
        });
        setFeaturedBooks(featuredResponse.data.books || []);
      } catch (err) {
        setError('Failed to load books. Please try again.');
        console.error('Fetch error:', err.response?.status, err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("resetEmail");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const scrollLeft = () => {
    const scrollAmount = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const scrollAmount = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="font-sans w-full min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow">
        {/* Hero Section */}
        <section
          className="flex items-center justify-center flex-col text-center w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImg})`, minHeight: "calc(100vh - 80px - 60px)" }}
        >
          <h1 className="text-4xl font-bold text-gray-800">Welcome to</h1>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Book Shop</h2>
          <p className="text-gray-600 max-w-xl mb-6">
            Discover a world of literary treasures and explore our vast selection of books
          </p>
          <a
            href="/shop"
            className="bg-[#f29d7e] text-white px-6 py-2 rounded-full text-lg hover:bg-[#f28663] transition"
          >
            Shop Now
          </a>
        </section>

        {/* Best Sellers Section */}
        <section className="py-16 px-4 md:px-16 bg-gray-50 relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold"><span className="text-green-600">Best</span>Sellers</h2>
            <button
              onClick={() => navigate("/book", { state: { activeTab: "Bestsellers" } })}
              className="text-blue-700 hover:underline cursor-pointer"
            >
              See All
            </button>
          </div>

          {loading ? (
            <div className="text-center">
              <p className="text-lg text-gray-600">Loading best sellers...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 text-center mb-6 rounded-lg border border-red-200">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          ) : bestSellers.length === 0 ? (
            <div className="text-center">
              <p className="text-lg text-gray-600">No best sellers available.</p>
            </div>
          ) : (
            <>
              <button
                onClick={scrollLeft}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                &lt;
              </button>
              <button
                onClick={scrollRight}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                &gt;
              </button>

              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 custom-hide-scrollbar"
              >
                {bestSellers.map((book) => (
                  <div
                    key={book.id}
                    className="min-w-[250px] bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 relative snap-start"
                  >
                    {book.isOnSale && (
                      <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        On Sale
                      </span>
                    )}
                    <img
                      src={
                        book.imageUrl
                          ? `http://localhost:5127/${book.imageUrl}`
                          : 'https://via.placeholder.com/150x200?text=Book+Cover'
                      }
                      alt={book.title}
                      className="w-full h-64 object-contain mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <div className="flex items-center my-2">
                      {[...Array(book.rating || 0)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#fbbf24"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-5 h-5 text-yellow-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.062 6.319a1 1 0 00.95.69h6.631c.969 0 1.371 1.24.588 1.81l-5.367 3.906a1 1 0 00-.364 1.118l2.062 6.318c.3.922-.755 1.688-1.54 1.118l-5.367-3.906a1 1 0 00-1.175 0l-5.367 3.906c-.784.57-1.838-.196-1.54-1.118l2.062-6.318a1 1 0 00-.364-1.118L2.819 11.746c-.783-.57-.38-1.81.588-1.81h6.631a1 1 0 00.95-.69l2.062-6.319z"
                          />
                        </svg>
                      ))}
                      {[...Array(5 - (book.rating || 0))].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-5 h-5 text-yellow-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.062 6.319a1 1 0 00.95.69h6.631c.969 0 1.371 1.24.588 1.81l-5.367 3.906a1 1 0 00-.364 1.118l2.062 6.318c.3.922-.755 1.688-1.54 1.118l-5.367-3.906a1 1 0 00-1.175 0l-5.367 3.906c-.784.57-1.838-.196-1.54-1.118l2.062-6.318a1 1 0 00-.364-1.118L2.819 11.746c-.783-.57-.38-1.81.588-1.81h6.631a1 1 0 00.95-.69l2.062-6.319z"
                          />
                        </svg>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      {book.isOnSale && book.discountPercent > 0 && (
                        <span className="text-gray-500 line-through">Rs. {book.price}</span>
                      )}
                      <span className="text-lg font-bold text-gray-800">
                        Rs. {book.isOnSale && book.discountPercent > 0
                          ? (book.price * (1 - book.discountPercent / 100)).toFixed(2)
                          : book.price}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/books/${book.id}`)}
                      className="mt-4 w-full bg-[#f29d7e] text-white py-2 rounded-full hover:bg-[#f28663] transition"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Featured Books Section */}
        <section className="py-16 px-4 md:px-16 bg-white">
          <h2 className="text-3xl font-bold text-center mb-10"><span className="text-[#f29d7e]">Featured</span> Books</h2>
          {loading ? (
            <div className="text-center">
              <p className="text-lg text-gray-600">Loading featured books...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 text-center mb-6 rounded-lg border border-red-200">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          ) : featuredBooks.length === 0 ? (
            <div className="text-center">
              <p className="text-lg text-gray-600">No featured books available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col items-center"
                >
                  <img
                    src={
                      book.imageUrl
                        ? `http://localhost:5127/${book.imageUrl}`
                        : 'https://via.placeholder.com/150x200?text=Book+Cover'
                    }
                    alt={book.title}
                    className="w-full h-72 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <button
                    onClick={() => navigate(`/books/${book.id}`)}
                    className="mt-4 bg-[#f29d7e] text-white px-4 py-2 rounded-full hover:bg-[#f28663] transition"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* New Login/Register + Books Tilt Section */}
        <section
          className="py-16 px-4 md:px-16 bg-cover bg-center flex flex-col lg:flex-row items-center justify-between"
          style={{ backgroundImage: `url(${bgPattern})` }}
        >
          {/* Left Side: Text + Buttons */}
          <div className="mb-10 lg:mb-0 max-w-lg text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Join Our Community</h2>
            <p className="text-gray-600 mb-6">
              Sign up now to access exclusive deals and discover more amazing books!
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-[#f29d7e] text-white px-6 py-2 rounded-full text-lg hover:bg-[#f28663] transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="border-2 border-[#f29d7e] text-[#f29d7e] px-6 py-2 rounded-full text-lg hover:bg-[#f29d7e] hover:text-white transition"
              >
                Register
              </button>
            </div>
          </div>

          {/* Right Side: Tilted Book Images */}
          {/* <div className="flex gap-6">
            {featuredBooks.slice(0, 3).map((book, index) => (
              <img
                key={book.id}
                src={
                  book.imageUrl
                    ? `http://localhost:5127/${book.imageUrl}`
                    : 'https://via.placeholder.com/150x200?text=Book+Cover'
                }
                alt={book.title}
                className={`w-32 h-48 object-cover rounded-lg shadow-lg transform ${
                  index === 0 ? 'rotate-[-10deg]' : index === 1 ? 'rotate-[10deg]' : 'rotate-[-5deg]'
                }`}
              />
            ))}
          </div> */}
          {/* Right Side: Tilted Book Images */}
          <div className="flex gap-6">
            <img src={book1} alt="Book 1" className="w-32 h-48 object-cover rounded-lg transform rotate-[-10deg] shadow-lg" />
            <img src={book2} alt="Book 2" className="w-32 h-48 object-cover rounded-lg transform rotate-[10deg] shadow-lg" />
            <img src={book3} alt="Book 3" className="w-32 h-48 object-cover rounded-lg transform rotate-[-5deg] shadow-lg" />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}