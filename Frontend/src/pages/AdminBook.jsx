import React, {useEffect, useState} from 'react'
import AdminNav from "../Components/AdminNavbar"
import AdminTop from "../Components/AdminTop"

function AdminBook() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchBooks = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/books");
          setBooks(res.data);
        } catch (error) {
          console.error("Failed to fetch books:", error);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchBooks();
      }, []);
  return (
    <div className="h-screen flex ">
        <AdminNav />
        <div className='flex-1 flex flex-col'>
        <AdminTop />
        <div className="p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Books</h2>
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
                <th className="px-4 py-2 text-left">Images</th>
                <th className="px-4 py-2 text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                <tr>
                    <td colSpan="13" className="text-center py-6">
                    Loading books...
                    </td>
                </tr>
                ) : books.length === 0 ? (
                <tr>
                    <td colSpan="13" className="text-center py-6">
                    No books available.
                    </td>
                </tr>
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
                    <td className="px-4 py-2">
                        <img
                        src={book.imageUrl || "https://via.placeholder.com/50"}
                        alt="book"
                        className="w-10 h-10 object-cover"
                        />
                    </td>
                    <td className="px-4 py-2 space-x-2">
                        <button className="bg-[#5c2314] text-white px-3 py-1 text-sm rounded hover:opacity-90">
                        Edit
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:opacity-90">
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
        </div>
        {showModal && (
        <div className="fixed inset-0 bg-gray-900/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-[90%] max-w-4xl shadow-lg relative">
            <h2 className="text-center text-lg font-semibold mb-4">Add a New Book</h2>
            <form className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Title" className="border p-2 rounded" />
              <select className="border p-2 rounded">
                <option value="">Select Tags</option>
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
              </select>
              <input type="text" placeholder="Author" className="border p-2 rounded" />
              <input type="text" placeholder="Genre" className="border p-2 rounded" />
              <input type="text" placeholder="Language" className="border p-2 rounded" />
              <input type="text" placeholder="ISBN" className="border p-2 rounded" />
              <textarea placeholder="Description" className="border p-2 rounded col-span-2"></textarea>
              <input type="text" placeholder="Format" className="border p-2 rounded" />
              <input type="text" placeholder="Price" className="border p-2 rounded" />
              <input type="text" placeholder="Publisher" className="border p-2 rounded" />
              <input type="text" placeholder="Availability" className="border p-2 rounded" />
              <input type="file" className="col-span-2 border p-2 rounded" />

              <div className="col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-[#1b3a57] text-white px-6 py-2 rounded hover:bg-[#123146]"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-[#5c2314] text-white px-6 py-2 rounded hover:bg-[#47190f]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBook