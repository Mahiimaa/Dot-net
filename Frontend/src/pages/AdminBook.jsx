import React, { useEffect, useState } from "react";
import AdminNav from "../Components/AdminNavbar";
import AdminTop from "../Components/AdminTop";
import axios from "axios";
import { useDebounce } from "use-debounce";
import Pagination from "../Components/Pagination";
import { CiSearch } from "react-icons/ci";

function AdminBook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    author: "",
    genre: "",
    language: "",
    isbn: "",
    description: "",
    format: "Hardcover",
    price: "",
    publisher: "",
    availability: "Available",
    image: null,
    createdBy: "admin",
    inStockQty: 0,
    reservedQty: "",
    discountPercent: "",
    discountStart: "",
    discountEnd: "",
    isOnSale: false,
    isBestseller: false,
    isAwardWinner: false,
    isComingSoon: false,
    isFeatured: false,
    publishDate: "",
    totalSold: "",
  });
  const [editingBookId, setEditingBookId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // Unified message state: { type: "success" | "error", text: string }
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [booksPerPage, setBooksPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchBooks = async (page = 1, search = "") => {
    try {
      const res = await axios.get(`http://localhost:5127/api/books`, {
        params: {
          page,
          pageSize: booksPerPage,
          search,
        },
      });
      setBooks(res.data.books);
      setTotalPages(Math.ceil(res.data.Total / booksPerPage) || 1);
      setMessage(null); // Clear any previous error
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to load books. Please try again.",
      });
      setBooks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, booksPerPage]);

  useEffect(() => {
    fetchBooks(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm, booksPerPage]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.author) newErrors.author = "Author is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.inStockQty && formData.inStockQty !== 0)
      newErrors.inStockQty = "In Stock Quantity is required";
    if (
      formData.discountPercent &&
      (formData.discountPercent < 0 || formData.discountPercent > 100)
    ) {
      newErrors.discountPercent = "Discount must be between 0 and 100";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = new FormData();
    for (const key in formData) {
      if (
        formData[key] !== null &&
        formData[key] !== undefined &&
        formData[key] !== ""
      ) {
        payload.append(key, formData[key]);
      }
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingBookId) {
        await axios.put(
          `http://localhost:5127/api/books/${editingBookId}`,
          payload,
          config
        );
        setMessage({ type: "success", text: "Book updated successfully!" });
      } else {
        await axios.post("http://localhost:5127/api/books", payload, config);
        setMessage({ type: "success", text: "Book added successfully!" });
      }
      setShowModal(false);
      fetchBooks(currentPage, debouncedSearchTerm);
      setEditingBookId(null);
      setFormData({
        title: "",
        tags: "",
        author: "",
        genre: "",
        language: "",
        isbn: "",
        description: "",
        format: "Hardcover",
        price: "",
        publisher: "",
        availability: "Available",
        image: null,
        createdBy: "admin",
        inStockQty: 0,
        reservedQty: "",
        discountPercent: "",
        discountStart: "",
        discountEnd: "",
        isOnSale: false,
        isBestseller: false,
        isAwardWinner: false,
        isComingSoon: false,
        isFeatured: false,
        publishDate: "",
        totalSold: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Failed to add/update book:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          `Failed to ${editingBookId ? "update" : "add"} book. Please try again.`,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5127/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: "Book deleted successfully!" });
      if (books.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchBooks(currentPage, debouncedSearchTerm);
      }
    } catch (error) {
      console.error("Failed to delete book:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete book. Please try again.",
      });
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  useEffect(() => {
    if (filteredBooks.length === 0) {
      setCurrentPage(1);
    }
  }, [filteredBooks]);

  const handleRowClick = (book) => {
    setSelectedBook(book);
    setShowDetailsModal(true);
  };

  return (
    <div className="h-screen flex">
      <AdminNav />
      <div className="flex-1 flex flex-col">
        <AdminTop />
        <div className="p-6">
          <div className="flex flex-col justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Books</h2>
            {/* Message Display */}
            {message && (
              <div
                className={`flex items-center justify-between p-4 mb-4 rounded-lg w-full ${
                  message.type === "success"
                    ? "bg-green-100 border border-green-400 text-green-700"
                    : "bg-red-100 border border-red-400 text-red-700"
                }`}
                role="alert"
                aria-live="assertive"
              >
                <span>{message.text}</span>
                <button
                  onClick={() => setMessage(null)}
                  className="text-sm font-semibold focus:outline-none"
                  aria-label="Dismiss message"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex items-center gap-4 justify-between w-full mb-4">
              <div className="relative w-full">
                <div className="flex border rounded-lg border-gray-300 items-center w-1/3">
                  <CiSearch className="w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search by title, author, or ISBN"
                    className="border-none p-2 focus:outline-none focus:ring-0 focus:border-none w-full"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    aria-label="Search books by title, author, or ISBN"
                  />
                </div>
                {searchTerm && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              <select
                value={booksPerPage}
                onChange={(e) => {
                  setBooksPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="border p-2 rounded"
                aria-label="Select books per page"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <button
                className="bg-[#1b3a57] text-white whitespace-nowrap px-4 py-2 rounded hover:bg-[#0d2a40] transition"
                onClick={() => setShowModal(true)}
              >
                Add New Book
              </button>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-black text-white text-sm">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Author</th>
                    <th className="px-4 py-2 text-left">Genre</th>
                    <th className="px-4 py-2 text-left">Language</th>
                    <th className="px-4 py-2 text-left">Availability</th>
                    <th className="px-4 py-2 text-left">ISBN</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Publisher</th>
                    <th className="px-4 py-2 text-left">In Stock</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="23" className="text-center py-6">
                        Loading books...
                      </td>
                    </tr>
                  ) : filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan="23" className="text-center py-6">
                        No books available.
                      </td>
                    </tr>
                  ) : (
                    currentBooks.map((book) => (
                      <tr
                        key={book.id}
                        className="border-t hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleRowClick(book)}
                      >
                        <td className="px-4 py-2">{book.title}</td>
                        <td className="px-4 py-2">{book.author}</td>
                        <td className="px-4 py-2">{book.genre}</td>
                        <td className="px-4 py-2">{book.language}</td>
                        <td className="px-4 py-2">{book.availability}</td>
                        <td className="px-4 py-2">{book.isbn}</td>
                        <td className="px-4 py-2">{book.price}</td>
                        <td className="px-4 py-2">{book.inStockQty}</td>
                        <td className="px-4 py-2">
                          <img
                            src={`http://localhost:5127/${book.imageUrl}`}
                            alt="book"
                            className="w-10 h-10 object-cover"
                          />
                        </td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            className="bg-[#5c2314] text-white px-3 py-1 text-sm rounded hover:opacity-90"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({
                                title: book.title || "",
                                tags: book.tags || "",
                                author: book.author || "",
                                genre: book.genre || "",
                                language: book.language || "",
                                isbn: book.isbn || "",
                                description: book.description || "",
                                format: book.format || "Hardcover",
                                price: book.price || "",
                                publisher: book.publisher || "",
                                availability: book.availability || "Available",
                                image: null,
                                createdBy: book.createdBy || "admin",
                                inStockQty: book.inStockQty || 0,
                                reservedQty: book.reservedQty || "",
                                discountPercent: book.discountPercent || "",
                                discountStart:
                                  book.discountStart?.slice(0, 10) || "",
                                discountEnd: book.discountEnd?.slice(0, 10) || "",
                                isOnSale: book.isOnSale || false,
                                isBestseller: book.isBestseller || false,
                                isAwardWinner: book.isAwardWinner || false,
                                isComingSoon: book.isComingSoon || false,
                                isFeatured: book.isFeatured || false,
                                publishDate: book.publishDate?.slice(0, 10) || "",
                                totalSold: book.totalSold || "",
                              });
                              setEditingBookId(book.id);
                              setShowModal(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:opacity-90"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(book.id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            maxPagesToShow={5}
            className="mt-4"
            ariaLabel="Book pagination"
          />
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-[90%] max-w-4xl shadow-lg">
              <h2 className="text-center text-xl font-semibold mb-6">
                {editingBookId ? "Edit Book" : "Add New Book"}
              </h2>
              <form
                onSubmit={handleAddBook}
                className="max-h-[70vh] overflow-y-auto pr-4"
              >
                <div className="grid grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium mb-4">
                      Basic Information
                    </h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter book title"
                      className={`w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Fiction, Thriller"
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      title="Enter tags as comma-separated values"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Enter tags as comma-separated values
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter author name"
                      className={`w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] ${
                        errors.author ? "border-red-500" : "border-gray-300"
                      }`}
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      required
                    />
                    {errors.author && (
                      <p className="text-red-500 text-sm mt-1">{errors.author}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genre
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Mystery, Sci-Fi"
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      value={formData.genre}
                      onChange={(e) =>
                        setFormData({ ...formData, genre: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., English, Spanish"
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      value={formData.language}
                      onChange={(e) =>
                        setFormData({ ...formData, language: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      placeholder="Enter ISBN"
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      value={formData.isbn}
                      onChange={(e) =>
                        setFormData({ ...formData, isbn: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Enter book description"
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300 h-24"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Book Details */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium mb-4">Book Details</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Format <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      value={formData.format}
                      onChange={(e) =>
                        setFormData({ ...formData, format: e.target.value })
                      }
                      required
                    >
                      <option value="Hardcover">Hardcover</option>
                      <option value="Paperback">Paperback</option>
                      <option value="Signed">Signed</option>
                      <option value="Limited">Limited</option>
                      <option value="FirstEdition">First Edition</option>
                      <option value="Collectors">Collector's</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter price"
                      className={`w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      }`}
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      min="0"
                      step="0.01"
                      required
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publisher
                    </label>
                    <input
                      type="text"
                      placeholder="Enter publisher"
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      value={formData.publisher}
                      onChange={(e) =>
                        setFormData({ ...formData, publisher: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      value={formData.availability}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availability: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="Available">Available</option>
                      <option value="Library Only">Library Only</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      value={formData.publishDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publishDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Inventory */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium mb-4">Inventory</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      In Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter stock quantity"
                      className={`w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] ${
                        errors.inStockQty ? "border-red-500" : "border-gray-300"
                      }`}
                      value={formData.inStockQty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          inStockQty: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      required
                    />
                    {errors.inStockQty && (
                      <p className="text-red-500 text-sm mt-1">{errors.inStockQty}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reserved Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="Enter reserved quantity"
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      value={formData.reservedQty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reservedQty: e.target.value,
                        })
                      }
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Sold
                    </label>
                    <input
                      type="number"
                      placeholder="Enter total sold"
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      value={formData.totalSold}
                      onChange={(e) =>
                        setFormData({ ...formData, totalSold: e.target.value })
                      }
                      min="0"
                    />
                  </div>

                  {/* Discount */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium mb-4">Discount</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Percent
                    </label>
                    <input
                      type="number"
                      placeholder="Enter discount %"
                      className={`w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] ${
                        errors.discountPercent ? "border-red-500" : "border-gray-300"
                      }`}
                      value={formData.discountPercent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPercent: e.target.value,
                        })
                      }
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    {errors.discountPercent && (
                      <p className="text-red-500 text-sm mt-1">{errors.discountPercent}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      Enter 0-100 for discount percentage
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      value={formData.discountStart}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountStart: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount End Date
                    </label>
                    <input
                      type="date"
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      value={formData.discountEnd}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountEnd: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium mb-4">Status</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={formData.isOnSale}
                      onChange={(e) =>
                        setFormData({ ...formData, isOnSale: e.target.checked })
                      }
                      className="h-4 w-4 text-[#1b3a57] focus:ring-[#1b3a57] border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">On Sale</label>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isBestseller: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-[#1b3a57] focus:ring-[#1b3a57] border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">Bestseller</label>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={formData.isAwardWinner}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAwardWinner: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-[#1b3a57] focus:ring-[#1b3a57] border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">Award Winner</label>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={formData.isComingSoon}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isComingSoon: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-[#1b3a57] focus:ring-[#1b3a57] border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">Coming Soon</label>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-[#1b3a57] focus:ring-[#1b3a57] border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">Featured</label>
                  </div>

                  {/* Image Upload */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium mb-4">Book Image</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                      }
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="col-span-2 flex justify-end gap-4 mt-6">
                    <button
                      type="submit"
                      className="bg-[#1b3a57] text-white px-6 py-2 rounded hover:bg-[#123146] transition"
                    >
                      {editingBookId ? "Update Book" : "Add Book"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingBookId(null);
                        setErrors({});
                      }}
                      className="bg-[#5c2314] text-white px-6 py-2 rounded hover:bg-[#47190f] transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        {showDetailsModal && selectedBook && (
          <div className="fixed inset-0 bg-gray-900/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-[90%] max-w-4xl shadow-lg">
              <h2 className="text-center text-xl font-semibold mb-6">Book Details</h2>
              <div className="max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <p className="mt-1">{selectedBook.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Author</label>
                    <p className="mt-1">{selectedBook.author}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <p className="mt-1">{selectedBook.tags || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Genre</label>
                    <p className="mt-1">{selectedBook.genre || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <p className="mt-1">{selectedBook.language || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ISBN</label>
                    <p className="mt-1">{selectedBook.isbn || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <p className="mt-1">{selectedBook.description || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Format</label>
                    <p className="mt-1">{selectedBook.format}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <p className="mt-1">{selectedBook.price}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Publisher
                    </label>
                    <p className="mt-1">{selectedBook.publisher || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Availability
                    </label>
                    <p className="mt-1">{selectedBook.availability}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      In Stock Quantity
                    </label>
                    <p className="mt-1">{selectedBook.inStockQty}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reserved Quantity
                    </label>
                    <p className="mt-1">{selectedBook.reservedQty || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Discount Percent
                    </label>
                    <p className="mt-1">{selectedBook.discountPercent || 0}%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Discount Start
                    </label>
                    <p className="mt-1">{selectedBook.discountStart?.slice(0, 10) || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Discount End
                    </label>
                    <p className="mt-1">{selectedBook.discountEnd?.slice(0, 10) || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">On Sale</label>
                    <p className="mt-1">{selectedBook.isOnSale ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bestseller
                    </label>
                    <p className="mt-1">{selectedBook.isBestseller ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Award Winner
                    </label>
                    <p className="mt-1">{selectedBook.isAwardWinner ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Coming Soon
                    </label>
                    <p className="mt-1">{selectedBook.isComingSoon ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Featured</label>
                    <p className="mt-1">{selectedBook.isFeatured ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Publish Date
                    </label>
                    <p className="mt-1">{selectedBook.publishDate?.slice(0, 10) || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <p className="mt-1">{selectedBook.rating || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total Sold
                    </label>
                    <p className="mt-1">{selectedBook.totalSold || 0}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <img
                      src={`http://localhost:5127/${selectedBook.imageUrl}`}
                      alt="book"
                      className="w-20 h-20 object-cover mt-1"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowDetailsModal(false)}
                      className="bg-[#5c2314] text-white px-6 py-2 rounded hover:bg-[#47190f] transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBook;