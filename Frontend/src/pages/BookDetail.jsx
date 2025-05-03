"use client"

import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Heart, Trash2 } from "lucide-react"

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
    image:"/images/book1.png",
    authorImage: "/images/author1.png",
    isbn: "978-0525478812",
    publisher: "Dutton Books",
    publicationDate: "2012-01-10",
    description: "Despite the tumor-shrinking medical miracle that has bought her a few years, Hazel has never been anything but terminal—until she meets Augustus Waters. Together they explore life, love, and what it means to truly live.",
    reviews: [
      { id: 1, name: "BookLover92", comment: "Beautifully written and deeply emotional.", rating: 5, userId: "user1" },
      { id: 2, name: "TeenReader", comment: "Made me cry and laugh—an unforgettable story.", rating: 4, userId: "user2" }
    ],
    authorBio: "John Green is an award-winning author and YouTube content creator. Known for his emotionally resonant novels, he won the Printz Medal and has topped bestseller charts globally. He co-founded the educational YouTube channel CrashCourse."
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
    authorImage: "/images/author2.png",
    isbn: "978-0307949486",
    publisher: "Vintage Crime/Black Lizard",
    publicationDate: "2008-09-16",
    description: "A disgraced journalist and a brilliant hacker team up to uncover dark family secrets in this international thriller set in Sweden. Twisting and suspenseful, it explores corruption, trauma, and resilience.",
    reviews: [
      { id: 1, name: "ThrillerFan88", comment: "Incredible pacing and complex characters.", rating: 5, userId: "user2" },
      { id: 2, name: "MysteryAddict", comment: "A dark and gripping read—Larsson is a master.", rating: 4, userId: "user3" }
    ],
    authorBio: "Stieg Larsson was a Swedish journalist and author best known for his Millennium Trilogy. His investigative background gave his fiction a gritty, real-world edge. He passed away in 2004 before the trilogy's massive success."
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
    authorImage: "/images/author3.png",
    isbn: "978-0441172719",
    publisher: "Ace Books",
    publicationDate: "1965-08-01",
    description: "Set on the desert planet Arrakis, Dune follows Paul Atreides as he navigates political intrigue, ecological danger, and prophetic destiny in a vast interstellar empire dependent on the mysterious spice melange.",
    reviews: [
      { id: 1, name: "SciFiFan", comment: "Best world-building I've read in years", rating: 5, userId: "user3" },
      { id: 2, name: "GalacticReader", comment: "A timeless masterpiece of science fiction.", rating: 5, userId: "user5" }
    ],
    authorBio: "Frank Herbert was an American science fiction writer best known for the Dune series. Blending politics, religion, ecology, and technology, his work has influenced generations of writers and thinkers in the genre."
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
    authorImage: "/author-images/alex-michaelides.jpg",
    isbn: "978-1250301697",
    publisher: "Celadon Books",
    publicationDate: "2019-02-05",
    description: "Alicia Berenson's life seems perfect—until one evening, she shoots her husband five times and never speaks another word. Her refusal to talk or give any kind of explanation turns a domestic tragedy into a mystery that captivates the public. A psychotherapist becomes obsessed with uncovering her motive, leading to a shocking twist.",
    reviews: [
      { id: 1, name: "ThrillerQueen", comment: "The twist blew my mind!", rating: 5, userId: "user4" },
      { id: 2, name: "PageTurnerPro", comment: "A gripping psychological thriller I couldn't put down.", rating: 4, userId: "user7" }
    ],
    authorBio: "Alex Michaelides is a British-Cypriot author and screenwriter. He studied psychotherapy and draws on his background in psychology to craft suspenseful, character-driven thrillers. *The Silent Patient* is his debut novel and a global bestseller."
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
    authorImage: "/author-images/tara-westover.jpg",
    isbn: "978-5678901234",
    publisher: "True Stories Press",
    publicationDate: "2022-05-18",
    description: "A memoir about a woman who leaves her survivalist family and goes on to earn a PhD. This powerful account explores the transformative power of education.",
    reviews: [
      { id: 1, name: "MemoirFan", comment: "Inspiring and heartbreaking", rating: 5, userId: "user5" },
    ],
    authorBio: "Tara Westover is a historian and memoirist. Her journey from isolation to Cambridge University has inspired readers worldwide and sparked conversations about education and self-determination."
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
    authorImage: "/author-images/matt-haig.jpg",
    isbn: "978-6789012345",
    publisher: "Literary Fiction Co",
    publicationDate: "2023-01-30",
    description: "Between life and death there is a library where each book provides a chance to try another life. Nora Seed finds herself in this library, facing the ultimate question: What is the best way to live?",
    reviews: [
      { id: 1, name: "FictionLover", comment: "Made me reflect on my own choices", rating: 4, userId: "user6" },
    ],
    authorBio: "Matt Haig is a British novelist and journalist known for his honest explorations of mental health. His works blend philosophical depth with accessible storytelling."
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
    authorImage: "/author-images/james-clear.jpg",
    isbn: "978-7890123456",
    publisher: "Growth Publishing",
    publicationDate: "2022-07-14",
    description: "Tiny changes, remarkable results - learn how to build good habits and break bad ones. This practical guide reveals how small, consistent improvements can lead to significant transformations.",
    reviews: [
      { id: 1, name: "SelfImprover", comment: "Changed my daily routine completely", rating: 5, userId: "user7" },
    ],
    authorBio: "James Clear is a speaker and writer focused on habits, decision making, and continuous improvement. His work distills complex topics into actionable advice."
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
    authorImage: "/author-images/delia-owens.jpg",
    isbn: "978-8901234567",
    publisher: "Literary Fiction Co",
    publicationDate: "2021-12-05",
    description: "A murder mystery and celebration of nature set in the marshes of North Carolina. Abandoned by her family, Kya raises herself in the wild, becoming a local legend until a shocking crime occurs.",
    reviews: [
      { id: 1, name: "NatureReader", comment: "Beautiful prose and compelling mystery", rating: 5, userId: "user8" },
    ],
    authorBio: "Delia Owens is a wildlife scientist who spent years in Africa before turning to fiction. Her deep connection to nature infuses her writing with vivid descriptions and ecological insights."
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
    authorImage: "/author-images/yuval-harari.jpg",
    isbn: "978-9012345678",
    publisher: "Academic Press",
    publicationDate: "2023-04-22",
    description: "A brief history of humankind, exploring the evolution of our species from insignificant apes to rulers of the world. This provocative work examines the key revolutions that shaped human societies.",
    reviews: [
      { id: 1, name: "HistoryBuff", comment: "Completely changed my perspective", rating: 5, userId: "user9" },
    ],
    authorBio: "Yuval Noah Harari is a historian and professor whose ability to synthesize vast amounts of information into compelling narratives has made him one of the world's most influential public intellectuals."
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
    authorImage: "/author-images/harper-lee.jpg",
    isbn: "978-0061120084",
    publisher: "J.B. Lippincott & Co.",
    publicationDate: "1960-07-11",
    description: "A classic novel of racism and injustice in the American South, seen through the eyes of a young girl. It explores moral growth, empathy, and the fight against prejudice.",
    reviews: [
      { id: 1, name: "Bookworm23", comment: "Powerful and timeless story.", rating: 5, userId: "user23" }
    ],
    authorBio: "Harper Lee was an American novelist widely known for her Pulitzer Prize-winning novel 'To Kill a Mockingbird'. Her work continues to be celebrated for its powerful themes and Southern storytelling."
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
    authorImage: "/author-images/michelle-obama.jpg",
    isbn: "978-1524763138",
    publisher: "Crown Publishing Group",
    publicationDate: "2018-11-13",
    description: "An intimate, powerful, and inspiring memoir by the former First Lady of the United States. Michelle Obama chronicles the experiences that have shaped her—from her childhood to her years in the White House.",
    reviews: [
      { id: 1, name: "InspirationLover", comment: "Truly empowering. A must-read for everyone.", rating: 5, userId: "user34" }
    ],
    authorBio: "Michelle Obama is a lawyer, writer, and former First Lady of the United States. She is known for her advocacy for education, healthy families, and military families, as well as her bestselling memoir 'Becoming'."
  }
,
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
  authorImage: "/author-images/jrr-tolkien.jpg",
  isbn: "978-0547928227",
  publisher: "George Allen & Unwin",
  publicationDate: "1937-09-21",
  description: "The adventure of Bilbo Baggins, a hobbit who embarks on an unexpected journey through Middle-earth, encountering trolls, elves, dragons, and discovering courage within himself.",
  reviews: [
    { id: 1, name: "FantasyFan88", comment: "A magical and timeless adventure!", rating: 5, userId: "user88" }
  ],
  authorBio: "J.R.R. Tolkien was a British author, philologist, and academic best known for his high fantasy works 'The Hobbit' and 'The Lord of the Rings'. His richly developed world of Middle-earth remains one of the most influential fantasy settings of all time."
}
,
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
  authorImage: "/author-images/sally-rooney.jpg",
  isbn: "978-0571334650",
  publisher: "Faber & Faber",
  publicationDate: "2018-08-28",
  description: "The story of mutual fascination, friendship, and love between two very different people, Marianne and Connell, as they weave in and out of each other's lives from school into adulthood.",
  reviews: [
    { id: 1, name: "LitLover91", comment: "Raw, emotional, and beautifully written.", rating: 4, userId: "user91" }
  ],
  authorBio: "Sally Rooney is an Irish author known for her insightful portrayals of modern relationships and emotional intimacy. 'Normal People' solidified her place as a voice of a generation."
}
,
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
  authorImage:  "/images/author15.png",
  isbn: "978-0857197689",
  publisher: "Harriman House",
  publicationDate: "2020-09-08",
  description: "Timeless lessons on wealth, greed, and happiness told through 19 short stories that explore the strange ways people think about money and how to make better financial decisions.",
  reviews: [
    { id: 1, name: "MoneyMindset", comment: "Practical wisdom wrapped in engaging stories. A must-read!", rating: 5, userId: "user56" }
  ],
  authorBio: "Morgan Housel is a partner at Collaborative Fund and a former columnist at The Motley Fool and The Wall Street Journal. His writing focuses on behavioral finance and long-term thinking."
}


  
];

function BookDetail() {
  const { id } = useParams()
  const bookId = parseInt(id)
  const [book, setBook] = useState(dummyBooks.find((b) => b.id === bookId))
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(0)
  const [reviews, setReviews] = useState(book?.reviews || [])
  const [activeTab, setActiveTab] = useState("Book Details")
  const [wishlisted, setWishlisted] = useState(false)
  const [currentUser, setCurrentUser] = useState({ id: "currentUser", name: "You" })

  // Load saved data from localStorage
  useEffect(() => {
    const savedReviews = localStorage.getItem(`bookReviews_${bookId}`)
    const savedWishlist = localStorage.getItem('wishlist') || '[]'
    const wishlist = JSON.parse(savedWishlist)

    if (savedReviews) setReviews(JSON.parse(savedReviews))
    if (wishlist.includes(bookId)) setWishlisted(true)
  }, [bookId])

  // Update book reviews
  useEffect(() => {
    if (book) {
      const updatedBook = { ...book, reviews }
      setBook(updatedBook)
      localStorage.setItem(`bookReviews_${bookId}`, JSON.stringify(reviews))
      
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        updatedBook.rating = parseFloat(avgRating.toFixed(1))
        updatedBook.ratingCount = reviews.length
      }
    }
  }, [reviews, book, bookId])

  const handleAddComment = () => {
    if (comment.trim()) {
      const newReview = {
        id: Date.now(),
        name: currentUser.name,
        comment,
        rating,
        userId: currentUser.id
      }
      setReviews([...reviews, newReview])
      setComment("")
      setRating(0)
    }
  }

  const handleDeleteReview = (reviewId) => {
    setReviews(reviews.filter(review => review.id !== reviewId))
  }

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    const updatedWishlist = wishlisted 
      ? wishlist.filter(id => id !== bookId)
      : [...wishlist, bookId]
    
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
    setWishlisted(!wishlisted)
  }

  const renderStars = (rating, interactive = false, setRatingFn = null) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`text-xl ${star <= rating ? "text-yellow-500" : "text-gray-300"} ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive ? () => setRatingFn(star) : null}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  if (!book) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-xl">Book not found</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Book Cover Section */}
          <div className="w-full lg:w-2/5">
            <div className="bg-gray-100 w-full h-96 flex items-center justify-center mb-6 rounded-lg shadow-md overflow-hidden">
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
            
            <div className="space-y-4">
              <button 
                className="w-full flex items-center justify-center gap-2 bg-[#4a7c59] text-white py-3 rounded-lg hover:bg-[#3a6246] transition-colors"
                onClick={toggleWishlist}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-white" : ""}`} />
                {wishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold mb-2">Format</h3>
                <select className="w-full border border-gray-300 p-2 rounded-lg">
                  <option>Hardcover</option>
                  <option>Paperback</option>
                  <option>eBook</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-[#4a7c59] text-white py-3 rounded-lg hover:bg-[#3a6246] transition-colors">
                  Add To Cart
                </button>
                <button className="flex-1 bg-[#0f3c59] text-white py-3 rounded-lg hover:bg-[#0d334c] transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Book Details Section */}
          <div className="w-full lg:w-3/5">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-4">By {book.author}</p>
            
            <div className="flex items-center mb-4">
              {renderStars(book.rating)}
              <span className="ml-2 text-gray-600">({reviews.length} customer review{reviews.length !== 1 ? 's' : ''})</span>
            </div>

            <div className="mb-6">
              {book.onSale ? (
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">Rs. {book.price}</span>
                  <span className="line-through text-gray-500">Rs. {book.originalPrice}</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">Rs. {book.price}</span>
              )}
            </div>

            <p className="text-gray-700 mb-8 text-lg leading-relaxed">{book.description}</p>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                <button
                  className={`py-3 px-1 font-medium text-sm ${activeTab === "Book Details" ? "text-[#4a7c59] border-b-2 border-[#4a7c59]" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("Book Details")}
                >
                  Book Details
                </button>
                <button
                  className={`py-3 px-1 font-medium text-sm ${activeTab === "About the Author" ? "text-[#4a7c59] border-b-2 border-[#4a7c59]" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("About the Author")}
                >
                  About the Author
                </button>
                <button
                  className={`py-3 px-1 font-medium text-sm ${activeTab === "Reviews" ? "text-[#4a7c59] border-b-2 border-[#4a7c59]" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("Reviews")}
                >
                  Reviews ({reviews.length})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === "Book Details" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <h4 className="font-medium text-gray-500">ISBN</h4>
                    <p>{book.isbn}</p>
                  </div>
                  <div className="col-span-1">
                    <h4 className="font-medium text-gray-500">Genre</h4>
                    <p>{book.genre}</p>
                  </div>
                  <div className="col-span-1">
                    <h4 className="font-medium text-gray-500">Publisher</h4>
                    <p>{book.publisher}</p>
                  </div>
                  <div className="col-span-1">
                    <h4 className="font-medium text-gray-500">Publication Date</h4>
                    <p>{book.publicationDate}</p>
                  </div>
                </div>
              )}

              {activeTab === "About the Author" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-full sm:w-1/3">
                      <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                        <img 
                          src={book.authorImage} 
                          alt={book.author}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/author-images/default.jpg";
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-2/3">
                      <h3 className="text-2xl font-bold mb-4">{book.author}</h3>
                      <p className="text-gray-700 leading-relaxed">{book.authorBio}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Reviews" && (
                <div>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">Average Rating</h3>
                    <div className="flex items-center gap-4">
                      {renderStars(book.rating)}
                      <span className="text-gray-600">{book.rating.toFixed(1)} out of 5</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{reviews.length} {reviews.length === 1 ? 'rating' : 'ratings'}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Share your thoughts</h3>
                    <div className="mb-4">
                      <p className="text-gray-700 mb-2">Your rating</p>
                      {renderStars(rating, true, setRating)}
                    </div>
                    <textarea
                      className="w-full border border-gray-300 p-3 rounded-lg mb-3"
                      rows="4"
                      placeholder="Write your review..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      className="bg-[#4a7c59] text-white px-6 py-2 rounded-lg hover:bg-[#3a6246] transition-colors"
                      onClick={handleAddComment}
                    >
                      Submit Review
                    </button>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{review.name}</p>
                            {review.userId === currentUser.id && (
                              <button 
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-gray-400 hover:text-red-500"
                                title="Delete review"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail