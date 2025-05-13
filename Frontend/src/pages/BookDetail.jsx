import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import api from '../api/axios';
import Navbar from './Layout/Navbar';
import { AuthContext } from '../context/AuthContext';
import Review from './Review';

function BookDetail() {
  const { id } = useParams();
  const bookId = parseInt(id);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('Book Details');
  const [wishlisted, setWishlisted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(false);

  const stableIsAuthenticated = useMemo(() => isAuthenticated, [isAuthenticated]);

  const parseUTCDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr + (dateStr.endsWith('Z') ? '' : 'Z'));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setIsCheckingPurchase(true);

      if (isNaN(bookId)) {
        setError('Invalid book ID.');
        setLoading(false);
        setIsCheckingPurchase(false);
        return;
      }

      try {
        console.log('Fetching book with ID:', bookId);
        const bookResponse = await api.get(`http://localhost:5127/api/Books/${bookId}`);
        setBook(bookResponse.data);

        try {
          const reviewsResponse = await api.get(`http://localhost:5127/api/Reviews?bookId=${bookId}`);
          setReviews(reviewsResponse.data || []);
        } catch (reviewErr) {
          console.warn('Reviews fetch failed:', reviewErr.response?.status, reviewErr.response?.data || reviewErr.message);
          setReviews([]);
        }

        if (stableIsAuthenticated) {
          try {
            const userResponse = await api.get('http://localhost:5127/Auth/me');
            setCurrentUser({
              id: userResponse.data.id,
              name: `${userResponse.data.firstName} ${userResponse.data.lastName}`,
            });
            console.log('Current user from API:', { id: userResponse.data.id, name: `${userResponse.data.firstName} ${userResponse.data.lastName}` });
          } catch (userErr) {
            console.warn('User fetch failed:', userErr.response?.status, userErr.response?.data || userErr.message);
            const token = localStorage.getItem('token');
            if (token) {
              try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUser({
                  id: payload.nameid || 'unknown',
                  name: payload.name || 'User',
                });
              } catch {
                setCurrentUser({ id: 'unknown', name: 'User' });
              }
            }
          }
          try {
            const purchaseCheck = await api.get(`http://localhost:5127/api/Reviews/has-purchased/${bookId}`);
            console.log('Purchase check response:', purchaseCheck.data);
            setHasPurchased(purchaseCheck.data.hasPurchased);
          } catch (err) {
            console.warn('Purchase check failed:', err.response?.status, err.response?.data || err.message);
          }
          try {
            const wishlistResponse = await api.get(`http://localhost:5127/api/Wishlist/user/${user?.id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            setWishlisted(wishlistResponse.data.some(b => b.bookId === bookId));
          } catch (wishlistErr) {
            console.warn('Wishlist fetch failed:', wishlistErr.response?.status, wishlistErr.response?.data || wishlistErr.message);
          }
        }
      } catch (err) {
        const errorMessage =
          err.response?.status === 404
            ? 'Book not found.'
            : err.response?.data?.error || err.message || 'Failed to load book details.';
        setError(errorMessage);
        console.error('Fetch error:', err.response?.status, err.response?.data || err.message);
      } finally {
        setLoading(false);
        setIsCheckingPurchase(false);
      }
    };
    fetchData();
  }, [bookId, stableIsAuthenticated, user?.id]);

  const isDiscountActive =
    book?.isOnSale &&
    (!book.discountStart || parseUTCDate(book.discountStart) <= new Date()) &&
    (!book.discountEnd || parseUTCDate(book.discountEnd) >= new Date());

  const discountedPrice = isDiscountActive
    ? (book?.price * (1 - book.discountPercent / 100)).toFixed(2)
    : book?.price;

  useEffect(() => {
    if (book && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      setBook({ ...book, rating: parseFloat(avgRating.toFixed(1)), ratingCount: reviews.length });
    }
  }, [reviews]);

  // Handlers
  const addToCart = async () => {
    if (!stableIsAuthenticated) {
      navigate('/login');
      return;
    }
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await api.post('http://localhost:5127/api/Cart/add', {
        userId: user.id,
        bookId: bookId,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert('Book added to cart!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add to cart.');
      console.error('Cart error:', err.response?.status, err.response?.data || err.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const buyNow = async () => {
  if (!stableIsAuthenticated) {
    navigate('/login');
    return;
  }
  if (isAddingToCart) return;
  setIsAddingToCart(true);
  try {
    await api.post(
      'http://localhost:5127/api/Cart/add',
      {
        userId: user.id,
        bookId: bookId,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    alert('Proceed to checkout to complete the order placement.');
    navigate('/addCart');
  } catch (err) {
    alert(err.response?.data?.error || 'Failed to process order.');
    console.error('Buy Now error:', err.response?.status, err.response?.data || err.message);
  } finally {
    setIsAddingToCart(false);
  }
};

  const toggleWishlistStatus = async () => {
    if (!stableIsAuthenticated) {
      navigate('/login');
      return;
    }
    if (!user?.id) {
      alert('User information is missing. Please log in again.');
      navigate('/login');
      return;
    }
    if (isTogglingWishlist) return;
    setIsTogglingWishlist(true);
    try {
      if (wishlisted) {
        // Find the wishlist item ID to delete
        const wishlistResponse = await api.get(`http://localhost:5127/api/Wishlist/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const wishlistItem = wishlistResponse.data.find(b => b.bookId === bookId);
        if (wishlistItem) {
          await api.delete(`http://localhost:5127/api/Wishlist/remove/${wishlistItem.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          alert('Book removed from wishlist!');
        }
      } else {
        await api.post('http://localhost:5127/api/Wishlist/add', { userId: user.id, bookId }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert('Book added to wishlist!');
      }
      setWishlisted(!wishlisted);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update wishlist.');
      console.error('Wishlist error:', err.response?.status, err.response?.data || err.message);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading book details...</p>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Book Cover Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img
                src={
                  book.imageUrl
                    ? `http://localhost:5127/${book.imageUrl}`
                    : 'https://via.placeholder.com/300x400?text=Book+Cover'
                }
                alt={book.title}
                className="w-full h-96 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/book-covers/default.jpg';
                }}
              />
            </div>
            <div className="mt-6 space-y-4">
              <button
                className="w-full flex items-center justify-center gap-2 bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={toggleWishlistStatus}
                disabled={isTogglingWishlist || !stableIsAuthenticated}
                aria-label={wishlisted ? 'Remove book from wishlist' : 'Add book to wishlist'}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-white' : ''}`} />
                {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
              <div className="flex gap-4">
                <button
                  className="flex-1 bg-green-900 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  onClick={addToCart}
                  disabled={isAddingToCart || book?.availability !== 'Available'}
                  aria-label="Add book to cart"
                >
                  Add to Cart
                </button>
                <button
                  className="flex-1 bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  onClick={buyNow}
                  disabled={isAddingToCart || book?.availability !== 'Available'}
                  aria-label="Buy book now"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Book Details Section */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{book.title}</h1>
            <p className="text-lg text-gray-600 mb-4">By {book.author}</p>
            <div className="flex items-center mb-4">
              {renderStars(book.rating || 0)}
              <span className="ml-2 text-gray-600 text-sm">
                ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
            <div className="mb-6">
              {isDiscountActive ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold text-gray-900">Rs. {discountedPrice}</span>
                  <span className="text-lg text-gray-500 line-through">Rs. {book.price}</span>
                </div>
              ) : (
                <span className="text-2xl font-semibold text-gray-900">Rs. {book.price}</span>
              )}
              <p
                className={`text-sm mt-2 ${
                  book.availability === 'Available' ? 'text-green-700' : 'text-blue-900'
                }`}
              >
                {book.availability}
              </p>
            </div>
            <p className="text-gray-700 mb-8 leading-relaxed">{book.description}</p>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex space-x-6">
                <button
                  className={`py-3 px-4 text-sm font-medium ${
                    activeTab === 'Book Details'
                      ? 'text-green-900 border-b-2 border-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('Book Details')}
                >
                  Book Details
                </button>
                <button
                  className={`py-3 px-4 text-sm font-medium ${
                    activeTab === 'Reviews'
                      ? 'text-green-900 border-b-2 border-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('Reviews')}
                >
                  Reviews ({reviews.length})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'Book Details' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-500">ISBN</h4>
                    <p className="text-gray-700">{book.isbn || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Genre</h4>
                    <p className="text-gray-700">{book.genre || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Publisher</h4>
                    <p className="text-gray-700">{book.publisher || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Publication Date</h4>
                    <p className="text-gray-700">
                      {book.publishDate
                        ? new Date(book.publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'Reviews' && (
                <Review
                  book={book}
                  reviews={reviews}
                  setReviews={setReviews}
                  currentUser={currentUser}
                  isAuthenticated={stableIsAuthenticated}
                  navigate={navigate}
                  hasPurchased={hasPurchased}
                  isCheckingPurchase={isCheckingPurchase}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;