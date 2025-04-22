import React, {useState, useEffect} from 'react'
import AdminNav from "../Components/AdminNavbar"
import AdminTop from "../Components/AdminTop"

function Inventory() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [updatedStock, setUpdatedStock] = useState("");
    const [updatedReserved, setUpdatedReserved] = useState("");

  const fetchInventory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/inventory");
      setInventory(res.data); 
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setUpdatedStock(item.inStockQty);
    setUpdatedReserved(item.reservedQty);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/inventory/${selectedItem.id}`, {
        inStockQty: updatedStock,
        reservedQty: updatedReserved,
      });

      setInventory((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, inStockQty: updatedStock, reservedQty: updatedReserved }
            : item
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  return (
    <div className="h-screen flex ">
        <AdminNav />
        <div className='flex-1 flex flex-col'>
        <AdminTop />
        <div className="p-6">
        <h2 className="text-center text-lg font-semibold mb-4">Inventory</h2>

        <div className="overflow-auto">
            <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-black text-white text-sm">
                <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">ISBN</th>
                <th className="px-4 py-2 text-left">In Stock Quantity</th>
                <th className="px-4 py-2 text-left">Reserved</th>
                <th className="px-4 py-2 text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                <tr>
                    <td colSpan="5" className="text-center py-6">Loading...</td>
                </tr>
                ) : inventory.length === 0 ? (
                <tr>
                    <td colSpan="5" className="text-center py-6">No records found.</td>
                </tr>
                ) : (
                inventory.map((item) => (
                    <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">{item.isbn}</td>
                    <td className="px-4 py-2">{item.inStockQty}</td>
                    <td className="px-4 py-2">{item.reservedQty}</td>
                    <td className="px-4 py-2">
                        <button className="bg-[#5c2314] text-white px-4 py-1 rounded hover:opacity-90"
                        onClick={() => openModal(item)}>
                        Update
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
            <div className="fixed inset-0 bg-gray-800/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-[90%] max-w-xl border">
                <h2 className="text-center text-lg font-semibold mb-4">Update Inventory</h2>
                <form className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                    type="text"
                    value={selectedItem.title}
                    disabled
                    className="w-full border rounded p-2 bg-gray-200"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">ISBN</label>
                    <input
                    type="text"
                    value={selectedItem.isbn}
                    disabled
                    className="w-full border rounded p-2 bg-gray-200"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">In Stock Quantity</label>
                    <input
                    type="number"
                    value={updatedStock}
                    onChange={(e) => setUpdatedStock(e.target.value)}
                    className="w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Reserved</label>
                    <input
                    type="number"
                    value={updatedReserved}
                    onChange={(e) => setUpdatedReserved(e.target.value)}
                    className="w-full border rounded p-2"
                    />
                </div>
                <div className="col-span-2 flex justify-center mt-4 gap-4">
                    <button
                    type="button"
                    onClick={handleUpdate}
                    className="bg-[#5c2314] text-white px-6 py-2 rounded hover:opacity-90"
                    >
                    Update
                    </button>
                    <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:opacity-90"
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

export default Inventory