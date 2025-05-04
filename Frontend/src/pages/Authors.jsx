import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [booksByAuthor, setBooksByAuthor] = useState({});
  const [expandedAuthorName, setExpandedAuthorName] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate(); 

  useEffect(() => {
    fetch("http://localhost:5127/api/authors")
      .then((res) => res.json())
      .then((data) => {
        setAuthors(data);
        setFilteredAuthors(data);
      })
      .catch((err) => console.error("Error fetching authors:", err));
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const filtered = authors.filter((author) =>
      author.name.toLowerCase().includes(keyword)
    );
    setFilteredAuthors(filtered);
  };

  const handleViewBooks = async (authorName) => {
    if (expandedAuthorName === authorName) {
      setExpandedAuthorName(null);
      return;
    }

    if (booksByAuthor[authorName]) {
      setExpandedAuthorName(authorName);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5127/api/authors/${encodeURIComponent(authorName)}/books`);
      const data = await res.json();
      setBooksByAuthor((prev) => ({ ...prev, [authorName]: data }));
      setExpandedAuthorName(authorName);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  return (
    <div className="font-sans w-full min-h-screen bg-[#f9f9f9] flex flex-col justify-between">
      <Navbar />

      <div className="max-w-7xl mx-auto py-10 px-4 flex-1">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">Meet Our Authors</h1>
        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search authors..."
            className="border border-gray-300 rounded-full px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <div className="flex flex-wrap gap-6 justify-start">
          {filteredAuthors.length === 0 ? (
            <p className="text-gray-500">No authors found.</p>
          ) : (
            filteredAuthors.map((author, index) => (
              <div
                key={index}
                className="bg-white shadow-sm hover:shadow-md transition rounded-xl p-4 w-full sm:w-[280px] md:w-[300px] lg:w-[320px] flex flex-col items-center gap-2"
              >
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                  {author.name?.[0]?.toUpperCase() || "?"}
                </div>

                <h3 className="text-lg font-semibold text-center">{author.name}</h3>
                <p className="text-sm text-gray-600 text-center px-2">
                  {author.specialty || "Genre not specified"}
                </p>
                <button
                  onClick={() => handleViewBooks(author.name)}
                  className="bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm mt-2 hover:bg-emerald-200"
                >
                  {expandedAuthorName === author.name ? "Hide Books" : "View Books"}
                </button>

                {expandedAuthorName === author.name && booksByAuthor[author.name] && (
                  <div className="mt-4 w-full text-left">
                    {booksByAuthor[author.name].length === 0 ? (
                      <p className="text-sm text-gray-500 text-center">No books found.</p>
                    ) : (
                      <ul className="text-sm text-gray-700 space-y-1">
                        {booksByAuthor[author.name].map((book) => (
                          <li
                            key={book.id}
                            onClick={() => navigate(`/books/${book.id}`)} 
                            className="bg-gray-50 rounded p-2 cursor-pointer hover:bg-gray-100 transition"
                          >
                            <strong className="text-blue-900 hover:underline">{book.title}</strong>
                            <p className="text-xs text-gray-500">
                              Published: {book.publishDate?.split("T")[0]}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
