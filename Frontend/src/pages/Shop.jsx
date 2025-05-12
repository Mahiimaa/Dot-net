import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Quote } from 'lucide-react';
import Slider from 'react-slick';
import api from '../api/axios';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { AuthContext } from '../context/AuthContext';
import gen from "../assets/Images/genre.png"

// Slick carousel settings
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
};

// BookCard component (modified for Shop page)
const BookCard = ({ book, addToCart, addToWishlist, isAuthenticated }) => {
  const parseUTCDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr + (dateStr.endsWith('Z') ? '' : 'Z'));
  };

  const isDiscountActive =
    book.isOnSale &&
    (!book.discountStart || parseUTCDate(book.discountStart) <= new Date()) &&
    (!book.discountEnd || parseUTCDate(book.discountEnd) >= new Date());

  return (
    <div className="relative border rounded-xl p-4 flex flex-col items-center shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 bg-white">
      {isDiscountActive && (
        <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
          On Sale!
        </span>
      )}
      <Link to={`/books/${book.id}`} className="w-full flex justify-center">
        <img
          src={
            book.imageUrl
              ? `http://localhost:5127/${book.imageUrl}`
              : 'https://via.placeholder.com/150x200?text=Book+Cover'
          }
          alt={book.title}
          className="w-48 h-64 object-contain rounded-md bg-gray-50"
        />
      </Link>
      <div className="absolute top-2 right-2 flex space-x-1">
        {isAuthenticated && (
          <>
            <button
              onClick={() => addToCart(book.id)}
              className="bg-gray-100 p-1.5 rounded-full hover:bg-amber-200 transition"
              title="Add to Cart"
              aria-label="Add book to cart"
            >
              🛒
            </button>
            <button
              onClick={() => addToWishlist(book.id)}
              className="bg-gray-100 p-1.5 rounded-full hover:bg-amber-200 transition"
              title="Add to Wishlist"
              aria-label="Add book to wishlist"
            >
              <Heart className="w-4 h-4 text-red-500" />
            </button>
          </>
        )}
      </div>
      <div className="w-full mt-3 px-2">
        <Link to={`/books/${book.id}`} className="hover:underline">
          <h3 className="text-base font-semibold text-center line-clamp-2" title={book.title}>
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-600 text-center mt-1">{book.author}</p>
        <div className="flex justify-center items-center mt-1">
          {[...Array(book.rating || 0)].map((_, i) => (
            <span key={i} className="text-amber-400 text-sm">★</span>
          ))}
          {[...Array(5 - (book.rating || 0))].map((_, i) => (
            <span key={i} className="text-gray-300 text-sm">★</span>
          ))}
        </div>
        <p className="mt-2 text-center font-medium text-sm">
          {isDiscountActive ? (
            <>
              <span className="line-through text-gray-500 mr-1">Rs. {book.price}</span>
              <span className="text-amber-600">
                Rs. {(book.price * (1 - book.discountPercent / 100)).toFixed(2)}
              </span>
            </>
          ) : (
            `Rs. ${book.price}`
          )}
        </p>
      </div>
    </div>
  );
};

const Shop = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [staffPicks, setStaffPicks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      setError(null);
      try {
        const featuredResponse = await api.get('/api/Books', {
          params: { tab: 'New Releases', page: 1, pageSize: 5 },
        });
        setFeaturedBooks(featuredResponse.data.books || []);

        const staffPicksResponse = await api.get('/api/Books', {
          params: { tab: 'Bestsellers', page: 1, pageSize: 4 }, 
        });
        setStaffPicks(staffPicksResponse.data.books || []);

        const trendingResponse = await api.get('/api/Books', {
          params: { sortBy: 'popularity', page: 1, pageSize: 4 },
        });
        setTrendingBooks(trendingResponse.data.books || []);
      } catch (err) {
        setError('Failed to load shop data. Please try again later.');
        console.error('Shop fetch error:', err.response?.status, err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  const addToCart = async (bookId) => {
    if (!isAuthenticated || !user?.id) {
      alert('Please log in to add to cart.');
      navigate('/login');
      return;
    }
    try {
      await api.post('/api/Cart/add', {
        userId: user.id,
        bookId,
        quantity: 1,
      });
      alert('Book added to cart!');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to add to cart. Please try again.';
      alert(errorMessage);
      console.error('Add to cart error:', err.response?.status, err.response?.data || err.message);
    }
  };

  const addToWishlist = async (bookId) => {
    if (!isAuthenticated || !user?.id) {
      alert('Please log in to add to wishlist.');
      navigate('/login');
      return;
    }
    try {
      await api.post('/api/Wishlist/add', { userId: user.id, bookId });
      alert('Book added to wishlist!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add to wishlist. Please try again.';
      alert(errorMessage);
      console.error('Wishlist error:', err.response?.status, err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center">
              <p className="text-lg text-gray-600">Loading shop...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 text-center mb-6 rounded-lg border border-red-200">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <Slider {...carouselSettings}>
                  {featuredBooks.map((book) => (
                    <div key={book.id} className="relative">
                      <div className="bg-gradient-to-r from-amber-600 to-teal-600 text-white rounded-xl shadow-2xl overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center p-6 md:p-12">
                          <div className="md:w-1/2">
                            <h1 className="text-2xl md:text-4xl font-bold mb-4">{book.title}</h1>
                            <p className="text-sm md:text-lg mb-6 line-clamp-3">
                              {book.description || 'Discover this exciting new release!'}
                            </p>
                            <Link
                              to={`/books/${book.id}`}
                              className="inline-block bg-white text-amber-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
                            >
                              Shop Now
                            </Link>
                          </div>
                          <div className="md:w-1/2 mt-6 md:mt-0">
                            <img
                              src={
                                book.imageUrl
                                  ? `http://localhost:5127/${book.imageUrl}`
                                  : 'https://via.placeholder.com/400x300?text=Featured+Book'
                              }
                              alt={book.title}
                              className="w-full h-64 md:h-80 object-contain rounded-lg shadow-md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Explore Genres</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Young Adult'].map(
                    (genre) => (
                      <Link
                        key={genre}
                        to={`/book?genre=${genre}`}
                        className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-105"
                      >
                        <img
                          src={gen}
                          alt={genre}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">{genre}</span>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              </div>
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Staff Picks</h2>
                  <Link to="/book?tab=Bestsellers" className="text-amber-600 hover:underline">
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {staffPicks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      addToCart={addToCart}
                      addToWishlist={addToWishlist}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
                  <Link to="/book?sortBy=popularity" className="text-amber-600 hover:underline">
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {trendingBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      addToCart={addToCart}
                      addToWishlist={addToWishlist}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-amber-100 rounded-xl p-8 mb-12 text-center">
                <Quote className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <p className="text-lg text-gray-800 italic mb-4">
                  "Foliana has transformed my reading experience with its incredible selection and personalized recommendations!"
                </p>
                <p className="text-sm font-semibold text-gray-900">– Happy Reader</p>
              </div>

              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Find Your Next Book?</h2>
                <Link
                  to="/book"
                  className="inline-block bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-700 transition"
                >
                  Shop All Books
                </Link>
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-4 right-4 bg-amber-600 text-white p-3 rounded-full shadow-lg hover:bg-amber-700 transition"
                aria-label="Back to top"
              >
                ↑
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;