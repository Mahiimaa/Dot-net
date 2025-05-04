"use client"

import { useState } from "react"
import { Star, Search, ShoppingCart, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { Link } from "react-router-dom"

const dummyBooks = [
  {
    id: 1,
    title: "The Fault in Our Stars",
    author: "John Green",
    price: 999,
    originalPrice: 1299,
    onSale: true,
    rating: 4.5,
    genre: "Young Adult",
    image: "/images/book1.png",
    description: "A poignant and witty novel about two teenagers who meet at a cancer support group and fall in love, exploring life, loss, and the beauty of living fully."
  },
  {
    id: 2,
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    price: 899,
    originalPrice: 1199,
    onSale: true,
    rating: 4.4,
    genre: "Mystery",
    image: "/images/book2.png",
    description: "A suspenseful mystery following a journalist and a brilliant hacker as they investigate a wealthy family's dark past in Sweden."
  },
  {
    id: 3,
    title: "Dune",
    author: "Frank Herbert",
    price: 1100,
    originalPrice: 1100,
    onSale: false,
    rating: 4.8,
    genre: "Sci-Fi",
    image: "/images/book3.png",
    description: "Set in a distant future where interstellar empires vie for control of a desert planet, Dune tells the story of Paul Atreides as he navigates politics, prophecy, and survival on the harsh world of Arrakis."
  },
  {
    id: 4,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 935,
    originalPrice: 1100,
    onSale: true,
    rating: 4.7,
    genre: "Thriller",
    image: "/images/book4.png",
    description: "A bestselling psychological thriller about a woman who kills her husband and refuses to speak, and the psychotherapist determined to uncover her motive."
  },
  {
    id: 5,
    title: "Educated",
    author: "Tara Westover",
    price: 1100,
    originalPrice: 1100,
    onSale: false,
    rating: 4.9,
    genre: "Memoir",
    image: "/images/book5.png",
    description: "A memoir about a woman who leaves her survivalist family and goes on to earn a PhD."
  },
  {
    id: 6,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 935,
    originalPrice: 1100,
    onSale: true,
    rating: 4.2,
    genre: "Fiction",
    image: "/images/book6.png",
    description: "Between life and death there is a library where each book provides a chance to try another life."
  },
  {
    id: 7,
    title: "Atomic Habits",
    author: "James Clear",
    price: 1100,
    originalPrice: 1100,
    onSale: false,
    rating: 4.8,
    genre: "Self-Help",
    image: "/images/book7.png",
    description: "Tiny changes, remarkable results - learn how to build good habits and break bad ones."
  },
  {
    id: 8,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    price: 935,
    originalPrice: 1100,
    onSale: true,
    rating: 4.6,
    genre: "Fiction",
    image: "/images/book8.png",
    description: "A murder mystery and celebration of nature set in the marshes of North Carolina."
  },
  {
    id: 9,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    price: 1100,
    originalPrice: 1100,
    onSale: false,
    rating: 4.7,
    genre: "History",
    image: "/images/book9.png",
    description: "A brief history of humankind, exploring the evolution of our species."
  },
  {
    id: 10,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 935,
    originalPrice: 1100,
    onSale: true,
    rating: 4.5,
    genre: "Fiction",
    image: "/images/book10.png",
    description: "A shepherd boy's journey to discover a worldly treasure turns into a discovery of himself."
  },
  {
    id: 11,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 950,
    originalPrice: 1200,
    onSale: true,
    rating: 4.8,
    genre: "Fiction",
    image: "/images/book11.png",
    description: "A classic novel of racism and injustice in the American South, seen through the eyes of a young girl."
  },
  {
    id: 12,
    title: "Becoming",
    author: "Michelle Obama",
    price: 935,
    originalPrice: 1100,
    onSale: true,
    rating: 4.8,
    genre: "Memoir",
    image: "/images/book12.png",
    description: "An intimate, powerful, and inspiring memoir by the former First Lady of the United States."
  },
  {
    id: 13,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 1100,
    originalPrice: 1100,
    onSale: false,
    rating: 4.9,
    genre: "Fantasy",
    image: "/images/book13.png",
    description: "The adventure of Bilbo Baggins, a hobbit who embarks on an unexpected journey."
  },
  {
    id: 14,
    title: "Normal People",
    author: "Sally Rooney",
    price: 935,
    originalPrice: 1100,
    onSale: true,
    rating: 4.3,
    genre: "Fiction",
    image: "/images/book14.png",
    description: "The story of mutual fascination, friendship and love between two very different people."
  },
  {
    id: 15,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 1100,
    originalPrice: 1100,
    onSale: false,
    rating: 4.7,
    genre: "Finance",
    image: "/images/book15.png",
    description: "Timeless lessons on wealth, greed, and happiness through short stories."
  }
];

function BookCatalog() {
  const [books] = useState(dummyBooks)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedSort, setSelectedSort] = useState("Default")

  const genres = ["All", ...new Set(books.map(book => book.genre))];

  const filteredBooks = books
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedGenre === "All" || book.genre === selectedGenre),
    )
    .sort((a, b) => {
      if (selectedSort === "Price Low-High") return a.price - b.price
      if (selectedSort === "Price High-Low") return b.price - a.price
      if (selectedSort === "Rating High-Low") return b.rating - a.rating
      return 0
    })

  const booksPerPage = 6
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const currentBooks = filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="bg-[#f7f0e9] min-h-screen font-serif">
      <div className="text-center py-6 max-w-5xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl italic font-bold text-black">Explore Our Extensive Book Collection</h1>
        <p className="mt-4 text-gray-700 text-lg max-w-3xl mx-auto">
          Discover a vast array of books across various genres, from captivating novels to insightful non-fiction.
          Browse our curated selection and find your next literary adventure.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search by title or author"
              className="w-full py-3 px-5 rounded-lg border border-gray-300 bg-white text-lg"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
            <button className="absolute right-0 top-0 h-full w-14 bg-black text-white flex items-center justify-center rounded-r-lg">
              <Search className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg py-2.5 pl-4 pr-10 text-lg"
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value)
                setCurrentPage(1)
              }}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg py-2.5 pl-4 pr-10 text-lg"
              onChange={(e) => setSelectedSort(e.target.value)}
              value={selectedSort}
            >
              <option value="Default">Sort By</option>
              <option value="Price Low-High">Price: Low to High</option>
              <option value="Price High-Low">Price: High to Low</option>
              <option value="Rating High-Low">Rating: High to Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 pb-10">
        {currentBooks.map((book) => (
          <div key={book.id} className="relative bg-white rounded-2xl border border-gray-200 p-6 h-full flex flex-col">
            {book.onSale && (
              <span className="absolute top-4 left-4 bg-green-500 text-white text-base px-3 py-1 rounded-full">
                On Sale
              </span>
            )}

            <button
              className="absolute top-4 right-4 bg-[#4a7c59] rounded-full p-2.5 shadow-sm hover:bg-[#3a6246] cursor-pointer"
              title="Add to cart"
            >
              <ShoppingCart className="w-6 h-6 text-white" />
            </button>

            <div className="flex justify-center mb-6 flex-grow">
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/book-covers/default.jpg";
                  }}
                />
              </div>
            </div>

            <div className="text-center mt-auto">
              <h3 className="text-xl font-semibold text-center mb-3">{book.title}</h3>
              <p className="text-gray-600 mb-2">by {book.author}</p>

              <div className="flex justify-center mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${i <= book.rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill={i <= book.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>

              <div className="text-lg mb-3">
                {book.onSale ? (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-gray-500 line-through">Rs. {book.originalPrice}</span>
                    <span className="text-black font-bold">Rs. {book.price}</span>
                  </div>
                ) : (
                  <span className="text-black font-bold">Rs. {book.price}</span>
                )}
              </div>

              <p className="text-base text-gray-600 mb-4">{book.genre}</p>

              <Link
                to={`/bookDetail/${book.id}`}
                className="inline-block text-base bg-[#0f3c59] text-white py-2.5 px-8 rounded-full hover:bg-[#0d334c] transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pb-10">
          <nav className="flex items-center gap-4">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0f3c59] text-white disabled:opacity-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-12 h-12 rounded-full text-lg flex items-center justify-center ${
                  page === currentPage ? "bg-[#0f3c59] text-white" : "bg-white border border-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0f3c59] text-white disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}

export default BookCatalog