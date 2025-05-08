import React, { useEffect, useState } from 'react';
import AdminNav from "../Components/AdminNavbar";
import AdminTop from "../Components/AdminTop";
import axios from "axios";

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
        publishDate: "",
        totalSold: ""
    });
    const [editingBookId, setEditingBookId] = useState(null);
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;

    const fetchBooks = async () => {
        try {
            const res = await axios.get("http://localhost:5127/api/books");
            setBooks(res.data.books);
        } catch (error) {
            console.error("Failed to fetch books:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = "Title is required";
        if (!formData.author) newErrors.author = "Author is required";
        if (!formData.price) newErrors.price = "Price is required";
        if (!formData.inStockQty && formData.inStockQty !== 0) newErrors.inStockQty = "In Stock Quantity is required";
        if (formData.discountPercent && (formData.discountPercent < 0 || formData.discountPercent > 100)) {
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
            if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
                payload.append(key, formData[key]);
            }
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (editingBookId) {
                await axios.put(`http://localhost:5127/api/books/${editingBookId}`, payload, config);
            } else {
                await axios.post("http://localhost:5127/api/books", payload, config);
            }
            setShowModal(false);
            fetchBooks();
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
                publishDate: "",
                totalSold: ""
            });
            setErrors({});
        } catch (error) {
            console.error("Failed to add/update book:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5127/api/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBooks();
        } catch (error) {
            console.error("Failed to delete book:", error);
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    // Handle page change
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="h-screen flex">
            <AdminNav />
            <div className='flex-1 flex flex-col'>
                <AdminTop />
                <div className="p-6">
                    <div className="flex flex-col justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Books</h2>
                        <div className="flex items-center gap-4 justify-between w-full mb-4">
                            <input
                                type="text"
                                placeholder="Search by title, author, or ISBN"
                                className="border p-2 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset to first page on search
                                }}
                            />
                        <button className="bg-[#1b3a57] text-white px-4 py-2 rounded hover:bg-[#0d2a40] transition" onClick={() => setShowModal(true)}>
                            Add New Book
                        </button>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full table-auto border border-gray-300">
                            <thead className="bg-black text-white text-sm">
                                <tr>
                                    <th className="px-4 py-2 text-left">Title</th>
                                    <th className="px-4 py-2 text-left">Tags</th>
                                    <th className="px-4 py-2 text-left">Author</th>
                                    <th className="px-4 py-2 text-left">Genre</th>
                                    <th className="px-4 py-2 text-left">Language</th>
                                    <th className="px-4 py-2 text-left">ISBN</th>
                                    <th className="px-4 py-2 text-left">Description</th>
                                    <th className="px-4 py-2 text-left">Format</th>
                                    <th className="px-4 py-2 text-left">Price</th>
                                    <th className="px-4 py-2 text-left">Publisher</th>
                                    <th className="px-4 py-2 text-left">Availability</th>
                                    <th className="px-4 py-2 text-left">In Stock</th>
                                    <th className="px-4 py-2 text-left">Reserved</th>
                                    <th className="px-4 py-2 text-left">Discount (%)</th>
                                    <th className="px-4 py-2 text-left">On Sale</th>
                                    <th className="px-4 py-2 text-left">Bestseller</th>
                                    <th className="px-4 py-2 text-left">Award Winner</th>
                                    <th className="px-4 py-2 text-left">Coming Soon</th>
                                    <th className="px-4 py-2 text-left">Publish Date</th>
                                    <th className="px-4 py-2 text-left">Rating</th>
                                    <th className="px-4 py-2 text-left">Total Sold</th>
                                    <th className="px-4 py-2 text-left">Images</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="23" className="text-center py-6">Loading books...</td></tr>
                                ) : books.length === 0 ? (
                                    <tr><td colSpan="23" className="text-center py-6">No books available.</td></tr>
                                ) : (
                                    books.map((book) => (
                                        <tr key={book.id} className="border-t">
                                            <td className="px-4 py-2">{book.title}</td>
                                            <td className="px-4 py-2">{book.tags}</td>
                                            <td className="px-4 py-2">{book.author}</td>
                                            <td className="px-4 py-2">{book.genre}</td>
                                            <td className="px-4 py-2">{book.language}</td>
                                            <td className="px-4 py-2">{book.isbn}</td>
                                            <td className="px-4 py-2">{book.description}</td>
                                            <td className="px-4 py-2">{book.format}</td>
                                            <td className="px-4 py-2">{book.price}</td>
                                            <td className="px-4 py-2">{book.publisher}</td>
                                            <td className="px-4 py-2">{book.availability}</td>
                                            <td className="px-4 py-2">{book.inStockQty}</td>
                                            <td className="px-4 py-2">{book.reservedQty || 0}</td>
                                            <td className="px-4 py-2">{book.discountPercent || 0}%</td>
                                            <td className="px-4 py-2">{book.isOnSale ? "Yes" : "No"}</td>
                                            <td className="px-4 py-2">{book.isBestseller ? "Yes" : "No"}</td>
                                            <td className="px-4 py-2">{book.isAwardWinner ? "Yes" : "No"}</td>
                                            <td className="px-4 py-2">{book.isComingSoon ? "Yes" : "No"}</td>
                                            <td className="px-4 py-2">{book.publishDate?.slice(0, 10)}</td>
                                            <td className="px-4 py-2">{book.rating}</td>
                                            <td className="px-4 py-2">{book.totalSold || 0}</td>
                                            <td className="px-4 py-2">
                                                <img src={`http://localhost:5127/${book.imageUrl}`} alt="book" className="w-10 h-10 object-cover" />
                                            </td>
                                            <td className="px-4 py-2 space-x-2">
                                                <button className="bg-[#5c2314] text-white px-3 py-1 text-sm rounded hover:opacity-90"
                                                    onClick={() => {
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
                                                            discountStart: book.discountStart?.slice(0, 10) || "",
                                                            discountEnd: book.discountEnd?.slice(0, 10) || "",
                                                            isOnSale: book.isOnSale || false,
                                                            isBestseller: book.isBestseller || false,
                                                            isAwardWinner: book.isAwardWinner || false,
                                                            isComingSoon: book.isComingSoon || false,
                                                            publishDate: book.publishDate?.slice(0, 10) || "",
                                                            totalSold: book.totalSold || ""
                                                        });
                                                        setEditingBookId(book.id);
                                                        setShowModal(true);
                                                    }}>
                                                    Edit
                                                </button>
                                                <button className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:opacity-90"
                                                    onClick={() => handleDelete(book.id)}>
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
                {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-4 gap-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-[#1b3a57] text-white rounded disabled:bg-gray-300 hover:bg-[#0d2a40]"
                            >
                                Previous
                            </button>
                            <span className="text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-[#1b3a57] text-white rounded disabled:bg-gray-300 hover:bg-[#0d2a40]"
                            >
                                Next
                            </button>
                        </div>
                    )}
                    </div>
                {showModal && (
                    <div className="fixed inset-0 bg-gray-900/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-md p-6 w-[90%] max-w-4xl shadow-lg">
                            <h2 className="text-center text-xl font-semibold mb-6">{editingBookId ? "Edit Book" : "Add New Book"}</h2>
                            <form onSubmit={handleAddBook} className="max-h-[70vh] overflow-y-auto pr-4">
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Basic Information */}
                                    <div className="col-span-2">
                                        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Book Title <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Enter book title"
                                            className={`w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Fiction, Thriller"
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            title="Enter tags as comma-separated values"
                                        />
                                        <p className="text-gray-500 text-xs mt-1">Enter tags as comma-separated values</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Author Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Enter author name"
                                            className={`w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] ${errors.author ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            required
                                        />
                                        {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Mystery, Sci-Fi"
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            value={formData.genre}
                                            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., English, Spanish"
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            value={formData.language}
                                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                                        <input
                                            type="text"
                                            placeholder="Enter ISBN"
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            value={formData.isbn}
                                            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            placeholder="Enter book description"
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300 h-24"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    {/* Book Details */}
                                    <div className="col-span-2">
                                        <h3 className="text-lg font-medium mb-4">Book Details</h3>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Format <span className="text-red-500">*</span></label>
                                        <select
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            value={formData.format}
                                            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Enter price"
                                            className={`w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                                        <input
                                            type="text"
                                            placeholder="Enter publisher"
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            value={formData.publisher}
                                            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Availability <span className="text-red-500">*</span></label>
                                        <select
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            value={formData.availability}
                                            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                            required
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Library Only">Library Only</option>
                                            <option value="Out of Stock">Out of Stock</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                                        <input
                                            type="date"
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            value={formData.publishDate}
                                            onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                                        />
                                    </div>

                                    {/* Inventory */}
                                    <div className="col-span-2">
                                        <h3 className="text-lg font-medium mb-4">Inventory</h3>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">In Stock Quantity <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Enter stock quantity"
                                            className={`w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] ${errors.inStockQty ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.inStockQty}
                                            onChange={(e) => setFormData({ ...formData, inStockQty: parseInt(e.target.value) || 0 })}
                                            min="0"
                                            required
                                        />
                                        {errors.inStockQty && <p className="text-red-500 text-sm mt-1">{errors.inStockQty}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reserved Quantity</label>
                                        <input
                                            type="number"
                                            placeholder="Enter reserved quantity"
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            value={formData.reservedQty}
                                            onChange={(e) => setFormData({ ...formData, reservedQty: e.target.value })}
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Sold</label>
                                        <input
                                            type="number"
                                            placeholder="Enter total sold"
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            value={formData.totalSold}
                                            onChange={(e) => setFormData({ ...formData, totalSold: e.target.value })}
                                            min="0"
                                        />
                                    </div>

                                    {/* Discount */}
                                    <div className="col-span-2">
                                        <h3 className="text-lg font-medium mb-4">Discount</h3>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percent</label>
                                        <input
                                            type="number"
                                            placeholder="Enter discount %"
                                            className={`w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] ${errors.discountPercent ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.discountPercent}
                                            onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                                            min="0"
                                            max="100"
                                            step="0.01"
                                        />
                                        {errors.discountPercent && <p className="text-red-500 text-sm mt-1">{errors.discountPercent}</p>}
                                        <p className="text-gray-500 text-xs mt-1">Enter 0-100 for discount percentage</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Start Date</label>
                                        <input
                                            type="date"
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            value={formData.discountStart}
                                            onChange={(e) => setFormData({ ...formData, discountStart: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount End Date</label>
                                        <input
                                            type="date"
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            value={formData.discountEnd}
                                            onChange={(e) => setFormData({ ...formData, discountEnd: e.target.value })}
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
                                            onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                                            className="h-4 w-4 text-[#1b3a57] focus:ring-[#1b3a57] border-gray-300 rounded"
                                        />
                                        <label className="text-sm font-medium text-gray-700">On Sale</label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={formData.isBestseller}
                                            onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                                            className="h-4 w-4 text-[#1b3a57] focus:ring-[#1b3a57] border-gray-300 rounded"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Bestseller</label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={formData.isAwardWinner}
                                            onChange={(e) => setFormData({ ...formData, isAwardWinner: e.target.checked })}
                                            className="h-4 w-4 text-[#1b3a57] focus:ring-[#1b3a57] border-gray-300 rounded"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Award Winner</label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={formData.isComingSoon}
                                            onChange={(e) => setFormData({ ...formData, isComingSoon: e.target.checked })}
                                            className="h-4 w-4 text-[#1b3a57] focus:ring-[#1b3a57] border-gray-300 rounded"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Coming Soon</label>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="col-span-2">
                                        <h3 className="text-lg font-medium mb-4">Book Image</h3>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                                        <input
                                            type="file"
                                            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
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
            </div>
        </div>
    );
}

export default AdminBook;