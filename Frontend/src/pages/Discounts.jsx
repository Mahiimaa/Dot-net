import React, {useState, useEffect} from 'react'
import AdminNav from "../Components/AdminNavbar"
import AdminTop from "../Components/AdminTop"
import axios from "axios"
import { Check, X } from "lucide-react";


function Discounts() {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [title, setTitle] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [onSale, setOnSale] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDiscountPercent, setEditDiscountPercent] = useState("");
    const [editStartDate, setEditStartDate] = useState("");
    const [editEndDate, setEditEndDate] = useState("");
    const [editOnSale, setEditOnSale] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [books, setBooks] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [editSelectedBooks, setEditSelectedBooks] = useState([]);


    const fetchDiscounts = async () => {
        try {
        const res = await axios.get("http://localhost:5127/api/discounts");
        setDiscounts(res.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
        } catch (err) {
        console.error("Failed to fetch discounts", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
        fetchBooks();
    }, []);

    const handleAddDiscount = async () => {
        try {
        const res = await axios.post("http://localhost:5127/api/discounts", {
            title,
            discountPercent : parseFloat(discountPercent),
            startDate: startDate ? new Date(startDate).toISOString() : null,
            endDate: endDate ? new Date(endDate).toISOString() : null,
            onSale,
            bookIds: selectedBooks.map(Number)
        });

        setDiscounts([...discounts, res.data]);
        setShowAddModal(false);
        setTitle("");
        setDiscountPercent("");
        setStartDate("");
        setEndDate("");
        setOnSale(false);
        setEditSelectedBooks([]);
        } catch (err) {
        console.error("Add discount failed:", err);
        }
    };

    const openEditModal = (discount) => {
        setEditingDiscount(discount);
        setEditSelectedBooks(discount.bookIds || []);
        setEditTitle(discount.title);
        setEditDiscountPercent(discount.discountPercent);
        setEditStartDate(discount.startDate?.slice(0, 10));
        setEditEndDate(discount.endDate?.slice(0, 10));
        setEditOnSale(discount.onSale);
        setShowAddModal(false);
        setShowEditModal(true);
      };

      const handleUpdateDiscount = async () => {
        try {
          const res = await axios.put(`http://localhost:5127/api/discounts/${editingDiscount.id}`, {
            title: editTitle,
            discountPercent: parseFloat(editDiscountPercent),
            startDate: editStartDate ? new Date(editStartDate).toISOString() : null,
            endDate: editEndDate ? new Date(editEndDate).toISOString() : null,
            onSale: editOnSale,
            bookIds: editSelectedBooks.map(Number),
          });
      
          const updatedDiscount = res.data;
          const updatedList = discounts.map((d) =>
            d.id === updatedDiscount.id ? updatedDiscount : d
          );
          setDiscounts(updatedList);
          setShowEditModal(false);
          setEditingDiscount(null);
        } catch (err) {
          console.error("Update discount failed:", err);
        }
      };
      
      const fetchBooks = async () => {
        try {
          const res = await axios.get("http://localhost:5127/api/books");
          setBooks(res.data);
        } catch (err) {
          console.error("Failed to fetch books:", err);
        }
      };
      
      const handleDeleteDiscount = async (id) => {
        if (!window.confirm("Are you sure you want to delete this discount?")) return;
      
        try {
          await axios.delete(`http://localhost:5127/api/discounts/${id}`);
          setDiscounts(discounts.filter((d) => d.id !== id));
        } catch (err) {
          console.error("Delete discount failed:", err);
        }
      };

      const resetEditForm = () => {
        setEditingDiscount(null);
        setEditTitle("");
        setEditDiscountPercent("");
        setEditStartDate("");
        setEditEndDate("");
        setEditOnSale(false);
        setEditSelectedBooks([]);
        setShowEditModal(false);
      };
      
      
  return (
    <div className="h-screen w-screen flex overflow-hidden">
        <AdminNav />
        <div className='flex-1 flex flex-col'>
        <AdminTop />
        <div className="p-6">
        <div className="flex justify-between items-center mb-4">
        <h2 className=" text-lg font-semibold mb-4">Discount & Sales</h2>
        <button
            onClick={() => setShowAddModal(true)}
            className="mb-4 bg-[#1b3a57] text-white px-4 py-2 rounded"
        >
            Add New Discount
        </button>
        </div>
        <div className="overflow-auto">
            <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-black text-white text-sm">
                <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Discount (%)</th>
                <th className="px-4 py-2 text-left">Start Date</th>
                <th className="px-4 py-2 text-left">End Date</th>
                <th className="px-4 py-2 text-left">On Sale</th>
                <th className="px-4 py-2 text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                <tr>
                    <td colSpan="6" className="text-center py-6">Loading...</td>
                </tr>
                ) : discounts.length === 0 ? (
                <tr>
                    <td colSpan="6" className="text-center py-6">No discounts found.</td>
                </tr>
                ) : (
                discounts.map((d) => (
                    <tr key={d.id} className="border-t">
                    <td className="px-4 py-2">{d.title}</td>
                    <td className="px-4 py-2">{d.discountPercent}%</td>
                    <td className="px-4 py-2">{d.startDate?.slice(0, 10)}</td>
                    <td className="px-4 py-2">{d.endDate?.slice(0, 10)}</td>
                    <td className="px-4 py-2">
                        {d.onSale ? (
                        <Check className="text-green-600 w-5 h-5" />
                        ) : (
                        <X className="text-red-600 w-5 h-5" />
                        )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                        <button onClick={() => openEditModal(d)}
                        className="bg-[#5c2314] text-white px-4 py-1 rounded">
                        Update
                        </button>
                        <button className="bg-red-600 text-white px-4 py-1 rounded"
                        onClick={() => handleDeleteDiscount(d.id)}>
                        Delete
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
        {showAddModal && (
            <div className="fixed inset-0 bg-gray-800/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-[90%] max-w-2xl border">
                <h2 className="text-center text-lg font-semibold mb-4">
                Add New Discount & Sales
                </h2>

                <form className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium">Title</label>
                    <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Discount (%)</label>
                    <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Start Date</label>
                    <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">End Date</label>
                    <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border p-2 rounded"
                    />
                </div>

                <div className="col-span-2 flex items-center gap-2 mt-2">
                    <input
                    type="checkbox"
                    checked={onSale}
                    onChange={(e) => setOnSale(e.target.checked)}
                    />
                    <label>On Sale</label>
                </div>
                <div className="col-span-2">
                <label className="block font-medium">Applicable Books</label>
                <select
                    multiple
                    className="w-full border p-2 rounded"
                    value={selectedBooks}
                    onChange={(e) =>
                    setSelectedBooks(Array.from(e.target.selectedOptions, (o) => o.value))
                    }
                >
                    {books.map((b) => (
                    <option key={b.id} value={b.id}>
                        {b.title}
                    </option>
                    ))}
                </select>
                </div>

                <div className="col-span-2 flex justify-center gap-4 mt-4">
                    <button
                    type="button"
                    onClick={handleAddDiscount}
                    className="bg-[#5c2314] text-white px-6 py-2 rounded"
                    >
                    Add
                    </button>
                    <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded"
                    >
                    Cancel
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        {showEditModal && (
        <div className="fixed inset-0 bg-gray-800/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-[90%] max-w-2xl border">
            <h2 className="text-center text-lg font-semibold mb-4">
                Edit Discount
            </h2>

            <form className="grid grid-cols-2 gap-4">
                <div>
                <label className="block font-medium">Title</label>
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                </div>

                <div>
                <label className="block font-medium">Discount (%)</label>
                <input
                    type="number"
                    value={editDiscountPercent}
                    onChange={(e) => setEditDiscountPercent(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                </div>

                <div>
                <label className="block font-medium">Start Date</label>
                <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                </div>

                <div>
                <label className="block font-medium">End Date</label>
                <input
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                </div>  
                {editStartDate && editEndDate &&
                (new Date(editStartDate) <= new Date() && new Date(editEndDate) >= new Date() ? (
                    <span className="text-green-600">Active</span>
                ) : (
                    <span className="text-gray-500">Inactive</span>
                ))
                }
                <div className="col-span-2 flex items-center gap-2 mt-2">
                <input
                    type="checkbox"
                    checked={editOnSale}
                    onChange={(e) => setEditOnSale(e.target.checked)}
                />
                <label>On Sale</label>
                </div>
                <div className="col-span-2">
                    <label className="block font-medium">Applicable Books</label>
                    <select
                        multiple
                        className="w-full border p-2 rounded"
                        value={editSelectedBooks}
                        onChange={(e) =>
                        setEditSelectedBooks(Array.from(e.target.selectedOptions, (o) => o.value))
                        }
                    >
                        {books.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.title}
                        </option>
                        ))}
                    </select>
                    </div>
                <div className="col-span-2 flex justify-center gap-4 mt-4">
                <button
                    type="button"
                    onClick={handleUpdateDiscount}
                    className="bg-[#5c2314] text-white px-6 py-2 rounded"
                >
                    Update
                </button>
                <button
                    type="button"
                    onClick={resetEditForm}
                    className="bg-gray-600 text-white px-6 py-2 rounded"
                >
                    Cancel
                </button>
                </div>
            </form>
            </div>
        </div>
        )}

        </div>
        </div></div>
  )
}

export default Discounts