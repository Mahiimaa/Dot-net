import React, {useState, useEffect} from 'react'
import AdminNav from "../Components/AdminNavbar"
import AdminTop from "../Components/AdminTop"

function Discounts() {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [title, setTitle] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [onSale, setOnSale] = useState(false);

    const fetchDiscounts = async () => {
        try {
        const res = await axios.get("http://localhost:5000/api/discounts");
        setDiscounts(res.data);
        } catch (err) {
        console.error("Failed to fetch discounts", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleAddDiscount = async () => {
        try {
        const res = await axios.post("http://localhost:5000/api/discounts", {
            title,
            discountPercent,
            startDate,
            endDate,
            onSale,
        });

        setDiscounts([...discounts, res.data]);
        setShowAddModal(false);
        setTitle("");
        setDiscountPercent("");
        setStartDate("");
        setEndDate("");
        setOnSale(false);
        } catch (err) {
        console.error("Add discount failed:", err);
        }
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
                        <button className="bg-[#5c2314] text-white px-4 py-1 rounded">
                        Update
                        </button>
                        <button className="bg-red-600 text-white px-4 py-1 rounded">
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
        </div>
        </div></div>
  )
}

export default Discounts