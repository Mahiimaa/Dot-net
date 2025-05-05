import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching books data from backend
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => {
        setBooks(res.data); // Mapping the response data to state
      })
      .catch(() => {
        setError("Failed to load books"); // Error handling
      });
  }, []);

  return (
    <div className="px-6 py-12">
      <div className="w-full mt-12 mb-8">
        <h1 className="text-left font-extrabold text-[#ac8966] text-2xl md:text-3xl ml-5">
          Our <span className="text-[#ac8966]">Books</span>
        </h1>
      </div>

      {error ? (
        <p className="text-red-500 text-center">{error}</p> // Display error if there is one
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
          {books.map((book, index) => (
            <div
              className="relative border rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              key={book.id} // Use book's unique id as key
            >
              <img
                src={`http://localhost:5000/${book.imageUrl}`} // Use 'imageUrl' for the image source
                alt={book.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3> {/* Title */}
                <p className="text-sm text-gray-500">by {book.author}</p> {/* Author */}
                <p className="text-xl font-bold text-black mt-2">₹{book.price}</p> {/* Price */}
                <Link
                  to={`/books/${book.id}`} // Link to individual book page using 'id'
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  See More
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-[70px]">
          <p className="text-gray-600 text-lg">No books are available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default BookList;
