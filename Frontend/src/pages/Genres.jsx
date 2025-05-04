import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [booksByGenre, setBooksByGenre] = useState({});
  const [expandedGenreId, setExpandedGenreId] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5127/api/genres")
      .then((res) => res.json())
      .then((data) => {
        setGenres(data);
        setFilteredGenres(data);
      })
      .catch((err) => console.error("Error fetching genres:", err));
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const filtered = genres.filter((genre) =>
      genre.name.toLowerCase().includes(keyword)
    );
    setFilteredGenres(filtered);
  };

  const handleViewBooks = async (genre) => {
    if (expandedGenreId === genre.id) {
      setExpandedGenreId(null);
      return;
    }

    if (!booksByGenre[genre.id]) {
      try {
        const res = await fetch(`http://localhost:5127/api/genres/${encodeURIComponent(genre.name)}/books`);
        const data = await res.json();
        setBooksByGenre((prev) => ({ ...prev, [genre.name]: data }));
      } catch (err) {
        console.error("Error fetching books for genre:", err);
        setBooksByGenre((prev) => ({ ...prev, [genre.name]: [] }));
      }
    }

    setExpandedGenreId(genre.name);
  };

  return (
    <div className="font-sans w-full min-h-screen bg-[#f9f9f9] flex flex-col justify-between">
      <Navbar />

      <div className="max-w-7xl mx-auto py-10 px-4 flex-1">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Browse by Genre</h1>

        {/* Search Input */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search genres..."
            className="border border-gray-300 rounded-full px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        {/* Genre Cards */}
        <div className="flex flex-wrap justify-start gap-6">
          {filteredGenres.length === 0 ? (
            <p className="text-gray-600 text-center w-full">No genres found.</p>
          ) : (
            filteredGenres.map((genre) => (
              <div
                key={genre.name}
                className="bg-white shadow-sm hover:shadow-md transition rounded-xl p-4 w-full sm:w-[280px] md:w-[300px] lg:w-[320px] flex flex-col items-center gap-2"
              >
                <h3 className="text-lg font-semibold text-center">{genre.name}</h3>
                <p className="text-sm text-gray-600 text-center px-2">
                  {genre.description || "Explore top books in this genre"}
                </p>
                <button
                  onClick={() => handleViewBooks(genre)}
                  className="bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm mt-2 hover:bg-emerald-200"
                >
                  {expandedGenreId === genre.id ? "Hide Books" : "View Books"}
                </button>

                {expandedGenreId === genre.name && booksByGenre[genre.name] && (
                  <div className="mt-4 w-full text-left">
                    {booksByGenre[genre.name].length === 0 ? (
                      <p className="text-sm text-gray-500 text-center">No books found.</p>
                    ) : (
                      <ul className="text-sm text-gray-700 space-y-1">
                        {booksByGenre[genre.name].map((book) => (
                          <li
                            key={book.id}
                            onClick={() => navigate(`/books/${book.id}`)}
                            className="bg-gray-50 rounded p-2 cursor-pointer hover:bg-gray-100 transition"
                          >
                            <strong className="text-blue-900 hover:underline">{book.title}</strong>
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
