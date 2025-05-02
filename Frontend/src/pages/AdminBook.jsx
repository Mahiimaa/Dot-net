import React, {useEffect, useState} from 'react'
import AdminNav from "../Components/AdminNavbar"
import AdminTop from "../Components/AdminTop"
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
      format: "",
      price: "",
      publisher: "",
      availability: "",
      image: null,
      createdBy: "admin" 
    });
    const [editingBookId, setEditingBookId] = useState(null);

    const fetchBooks = async () => {
        try {
          const res = await axios.get("http://localhost:5127/api/books");
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

      const handleAddBook = async (e) => {
        e.preventDefault();
        const payload = new FormData();
        for (const key in formData) {
          payload.append(key, formData[key]);
        }
      
        try {
          if (editingBookId) {
            await axios.put(`http://localhost:5127/api/books/${editingBookId}`, payload);
          } else {
            await axios.post("http://localhost:5127/api/books", payload);
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
            format: "",
            price: "",
            publisher: "",
            availability: "",
            image: null,
            createdBy: "admin",
          });
        } catch (error) {
          console.error("Failed to add book:", error);
        }
      };

      const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
      
        try {
          await axios.delete(`http://localhost:5127/api/books/${id}`);
          fetchBooks();
        } catch (error) {
          console.error("Failed to delete book:", error);
        }
      };
      
      
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
                        src={`http://localhost:5127/${book.imageUrl}`}
                        alt="book"
                        className="w-10 h-10 object-cover"
                        />
                    </td>
                    <td className="px-4 py-2 space-x-2">
                        <button className="bg-[#5c2314] text-white px-3 py-1 text-sm rounded hover:opacity-90"
                        onClick={() => {
                          setFormData({
                            ...book,
                            image: null,
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
        </div>
        {showModal && (
        <div className="fixed inset-0 bg-gray-900/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-[90%] max-w-4xl shadow-lg relative">
            <h2 className="text-center text-lg font-semibold mb-4">Book Details</h2>
            <form className="grid grid-cols-2 gap-4" onSubmit={handleAddBook}>
              <input type="text" placeholder="Title" className="border p-2 rounded" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}/>
              <select
                className="border p-2 rounded"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                required
              >
                <option value="">Select Tags</option>
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
              </select>
              <input type="text" placeholder="Author" className="border p-2 rounded" 
               value={formData.author}
               onChange={(e) => setFormData({ ...formData, author: e.target.value })}/>
              <input type="text" placeholder="Genre" className="border p-2 rounded"
               value={formData.genre}
               onChange={(e) => setFormData({ ...formData, genre: e.target.value })} />
              <input type="text" placeholder="Language" className="border p-2 rounded"
               value={formData.language}
               onChange={(e) => setFormData({ ...formData, language: e.target.value })} />
              <input type="text" placeholder="ISBN" className="border p-2 rounded" 
               value={formData.isbn}
               onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}/>
              <textarea placeholder="Description" className="border p-2 rounded col-span-2"
               value={formData.description}
               onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
              <input type="text" placeholder="Format" className="border p-2 rounded" 
               value={formData.format}
               onChange={(e) => setFormData({ ...formData, format: e.target.value })}/>
              <input type="text" placeholder="Price" className="border p-2 rounded"
               value={formData.price}
               onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              <input type="text" placeholder="Publisher" className="border p-2 rounded" 
               value={formData.publisher}
               onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}/>
              <input type="text" placeholder="Availability" className="border p-2 rounded" 
               value={formData.availability}
               onChange={(e) => setFormData({ ...formData, availability: e.target.value })}/>
              <input type="file" className="col-span-2 border p-2 rounded"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />

              <div className="col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-[#1b3a57] text-white px-6 py-2 rounded hover:bg-[#123146]"
                >
                  {editingBookId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                  setShowModal(false);
                  setEditingBookId(null); 
                  }}
                  
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