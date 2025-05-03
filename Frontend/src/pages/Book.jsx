import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import api from '../api/axios';
import Navbar from './Layout/Navbar';
import { AuthContext } from '../context/AuthContext';

const BookCard = ({ book, addToCart, bookmarkBook, isAuthenticated }) => {
  // Parse discountStart and discountEnd as UTC dates
  const parseUTCDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr + (dateStr.endsWith('Z') ? '' : 'Z'));
  };

  const isDiscountActive =
    book.isOnSale &&
    (!book.discountStart || parseUTCDate(book.discountStart) <= new Date()) &&
    (!book.discountEnd || parseUTCDate(book.discountEnd) >= new Date());

  return (
    <div className="relative border rounded-lg p-6 flex flex-col items-center shadow-md hover:shadow-lg transition h-full">
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
              : 'https://via.placeholder.com/150x200?text=Book+Cover'
          }
          alt={book.title}
          className="w-40 h-56 object-cover rounded-md"
        />
      </Link>
      <div className="absolute top-3 right-3 flex space-x-2">
        {isAuthenticated && (
          <>
            <button
              onClick={() => addToCart(book.id)}
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition shadow-sm"
              title="Add to Cart"
              aria-label="Add to cart"
            >
              🛒
            </button>
            <button
              onClick={() => bookmarkBook(book.id)}
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition shadow-sm"
              title="Bookmark"
              aria-label="Bookmark"
            >
              <Heart className="w-5 h-5 text-red-500" />
            </button>
          </>
        )}
      </div>
      <div className="w-full mt-4 px-2">
        <Link to={`/books/${book.id}`} className="hover:underline">
          <h3 className="text-lg font-semibold text-center line-clamp-2" title={book.title}>
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 text-center mt-1">{book.author}</p>
        <p className="text-xs text-gray-500 text-center mt-1">
          {book.genre} | {book.format}
        </p>
        <div className="flex justify-center items-center mt-2">
          {[...Array(book.rating || 0)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg">★</span>
          ))}
          {[...Array(5 - (book.rating || 0))].map((_, i) => (
            <span key={i} className="text-gray-300 text-lg">★</span>
          ))}
        </div>
        <p className="mt-2 text-center font-medium">
          {isDiscountActive ? (
            <>
              <span className="line-through text-gray-500 mr-2">Rs. {book.price}</span>
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
            book.availability === 'Available' ? 'text-green-600' : 'text-blue-600'
          }`}
        >
          {book.availability}
        </p>
      </div>
    </div>
  );
};

const Book = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    author: '',
    genre: '',
    availability: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    language: '',
    format: '',
    publisher: '',
  });
  const [sortBy, setSortBy] = useState('');
  const [activeTab, setActiveTab] = useState('All Books');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const booksPerPage = 6;

  // SignalR connection state
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Fetch books and announcements
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch books with filters, sorting, and pagination
        const booksResponse = await api.get('/api/Books', {
          params: {
            search: searchQuery || undefined,
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
            tab: activeTab !== 'All Books' ? activeTab : undefined,
            page: currentPage,
            pageSize: booksPerPage,
          },
        });
        setBooks(booksResponse.data.books || []);
        setTotalBooks(booksResponse.data.total || 0);
        setTotalPages(Math.ceil(booksResponse.data.total / booksResponse.data.pageSize) || 1);

        // Fetch announcements (corrected endpoint)
        const announcementsResponse = await api.get('/api/Announcements');
        const activeAnnouncements = announcementsResponse.data.filter(
          ann =>
            (!ann.startDate || new Date(ann.startDate + (ann.startDate.endsWith('Z') ? '' : 'Z')) <= new Date()) &&
            (!ann.endDate || new Date(ann.endDate + (ann.endDate.endsWith('Z') ? '' : 'Z')) >= new Date())
        );
        setAnnouncements(activeAnnouncements);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Fetch error:', err.response?.status, err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, filters, sortBy, activeTab, currentPage]);

  // Handle SignalR for real-time broadcasting
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5127/orderHub', { withCredentials: true })
      .withAutomaticReconnect([0, 2000, 5000, 10000]) // Retry delays in ms
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Handle incoming broadcasts
    connection.on('orderBroadcast', message => {
      console.log('Received broadcast:', message);
      setBroadcastMessage(message);
      setTimeout(() => setBroadcastMessage(''), 5000);
    });

    // Handle connection state changes
    connection.onreconnecting(error => {
      console.warn('SignalR reconnecting:', error?.message);
      setConnectionStatus('reconnecting');
    });

    connection.onreconnected(connectionId => {
      console.log('SignalR reconnected with ID:', connectionId);
      setConnectionStatus('connected');
    });

    connection.onclose(error => {
      console.error('SignalR connection closed:', error?.message);
      setConnectionStatus('disconnected');
    });

    // Start connection with retry logic
    const startConnection = async () => {
      try {
        await connection.start();
        console.log('SignalR connection started');
        setConnectionStatus('connected');
      } catch (err) {
        console.error('SignalR connection failed:', err.message);
        setConnectionStatus('failed');
        // Retry after 5 seconds
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    // Cleanup on unmount
    return () => {
      console.log('Stopping SignalR connection');
      connection.stop().catch(err => console.error('Error stopping SignalR:', err.message));
    };
  }, []);

  // Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      author: '',
      genre: '',
      availability: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      language: '',
      format: '',
      publisher: '',
    });
    setSortBy('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const addToCart = async (bookId) => {
    if (!isAuthenticated) {
      alert('Please log in to add to cart.');
      navigate('/login');
      return;
    }
    try {
      await api.post('/api/Cart', { bookId });
      alert('Book added to cart!');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to add to cart. Please try again.';
      alert(errorMessage);
      console.error('Add to cart error:', err.response?.status, err.response?.data || err.message);
    }
  };

  const bookmarkBook = async (bookId) => {
    if (!isAuthenticated) {
      alert('Please log in to bookmark.');
      navigate('/login');
      return;
    }
    try {
      await api.post('/api/Bookmarks', { bookId });
      alert('Book bookmarked!');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to bookmark. Please try again.';
      alert(errorMessage);
      console.error('Bookmark error:', err.response?.status, err.response?.data || err.message);
    }
  };

  // Unique filter options
  const authors = [...new Set(books.map(b => b.author).filter(Boolean))];
  const genres = [...new Set(books.map(b => b.genre).filter(Boolean))];
  const languages = [...new Set(books.map(b => b.language).filter(Boolean))];
  const formats = [...new Set(books.map(b => b.format).filter(Boolean))];
  const publishers = [...new Set(books.map(b => b.publisher).filter(Boolean))];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F6EFE4]">
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
              {/* Announcements */}
              {announcements.map(ann => (
                <div
                  key={ann.id}
                  className="bg-blue-100 p-4 text-center mb-6 rounded-lg border border-blue-200"
                >
                  <p className="text-blue-800 font-medium">{ann.message}</p>
                </div>
              ))}

              {/* Real-time Broadcast */}
              {broadcastMessage && (
                <div className="bg-yellow-100 p-4 text-center mb-6 rounded-lg border border-yellow-200 animate-pulse">
                  <p className="text-yellow-800 font-medium">📢 {broadcastMessage}</p>
                </div>
              )}

              {/* SignalR Connection Status (for debugging, can be removed in production) */}
              {connectionStatus !== 'connected' && (
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
                  Discover a vast array of books across various genres, from captivating novels to
                  insightful non-fiction. Browse our curated selection and find your next literary
                  adventure!
                </p>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                  'All Books',
                  'Bestsellers',
                  'Award Winners',
                  'New Releases',
                  'New Arrivals',
                  'Coming Soon',
                  'Deals',
                ].map(tab => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-full transition ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
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

              {/* Search */}
              <div className="flex justify-center mb-10">
                <div className="relative w-full max-w-2xl">
                  <input
                    type="text"
                    placeholder="Search by title, ISBN, or description..."
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Books</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <select
                      name="author"
                      value={filters.author}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">All Authors</option>
                      {authors.map(author => (
                        <option key={author} value={author}>
                          {author}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                    <select
                      name="genre"
                      value={filters.genre}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">All Genres</option>
                      {genres.map(genre => (
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      name="language"
                      value={filters.language}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">All Languages</option>
                      {languages.map(lang => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <select
                      name="format"
                      value={filters.format}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">All Formats</option>
                      {formats.map(format => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                    <select
                      name="publisher"
                      value={filters.publisher}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">All Publishers</option>
                      {publishers.map(pub => (
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
                </div>
                <div className="flex justify-end mt-4 space-x-3">
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Sort and Results Info */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="text-gray-600 mb-3 sm:mb-0">
                  {books.length > 0
                    ? `Showing ${books.length} of ${totalBooks} books`
                    : 'No books match your filters'}
                </div>
                <div className="flex items-center">
                  <label className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={e => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="p-2 border border-gray-300 rounded-md shadow-sm"
                    disabled={books.length === 0}
                  >
                    <option value="">Default</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="publishDate">Publication Date (Newest)</option>
                    <option value="priceLow">Price (Low to High)</option>
                    <option value="priceHigh">Price (High to Low)</option>
                    <option value="popularity">Popularity (Most Sold)</option>
                  </select>
                </div>
              </div>

              {/* Book Grid */}
              {books.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No books found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {books.map(book => (
                      <BookCard
                        key={book.id}
                        book={book}
                        addToCart={addToCart}
                        bookmarkBook={bookmarkBook}
                        isAuthenticated={isAuthenticated}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <nav
                        className="inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-l-md border ${
                            currentPage === 1
                              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
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
                                ? 'z-10 bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2 rounded-r-md border ${
                            currentPage === totalPages
                              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Book;