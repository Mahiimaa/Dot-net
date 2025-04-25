import React, {useState, useEffect} from 'react'
import AdminNav from "../Components/AdminNavbar"
import AdminTop from "../Components/AdminTop"

function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [editId, setEditId] = useState(null);
    const [editMessage, setEditMessage] = useState("");
    const [editType, setEditType] = useState("");
    const [editStartDate, setEditStartDate] = useState("");
    const [editEndDate, setEditEndDate] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);


    const fetchAnnouncements = async () => {
        try {
        const res = await axios.get("http://localhost:5000/api/announcements");
        setAnnouncements(res.data);
        } catch (err) {
        console.error("Fetch failed:", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleAddAnnouncement = async () => {
        try {
        const res = await axios.post("http://localhost:5000/api/announcements", {
            message,
            type,
            startDate,
            endDate,
        });
        setAnnouncements([...announcements, res.data]);
        setShowAddModal(false);
        setMessage("");
        setType("");
        setStartDate("");
        setEndDate("");
        } catch (err) {
        console.error("Add announcement failed:", err);
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setEditMessage(item.message);
        setEditType(item.type);
        setEditStartDate(item.startDate?.slice(0, 10));
        setEditEndDate(item.endDate?.slice(0, 10));
        setShowEditModal(true);
      };

      const handleUpdateAnnouncement = async () => {
        try {
          await axios.put(`http://localhost:5000/api/announcements/${editId}`, {
            message: editMessage,
            type: editType,
            startDate: editStartDate,
            endDate: editEndDate,
          });
          fetchAnnouncements(); 
          setShowEditModal(false);
        } catch (err) {
          console.error("Update announcement failed:", err);
        }
      };
      
  return (
    <div className="h-screen flex ">
        <AdminNav />
        <div className='flex-1 flex flex-col'>
        <AdminTop />
        <div className="p-6">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-center text-lg font-semibold mb-4">Announcements</h2>

        <button
            onClick={() => setShowAddModal(true)}
            className="mb-4 bg-[#1b3a57] text-white px-4 py-2 rounded"
        >
            Add New Announcement
        </button>
        </div>
        <div className="overflow-auto">
            <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-black text-white text-sm">
                <tr>
                <th className="px-4 py-2 text-left">Message</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Start Date</th>
                <th className="px-4 py-2 text-left">End Date</th>
                <th className="px-4 py-2 text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                <tr>
                    <td colSpan="5" className="text-center py-6">
                    Loading...
                    </td>
                </tr>
                ) : announcements.length === 0 ? (
                <tr>
                    <td colSpan="5" className="text-center py-6">
                    No announcements found.
                    </td>
                </tr>
                ) : (
                announcements.map((item) => (
                    <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{item.message}</td>
                    <td className="px-4 py-2">{item.type}</td>
                    <td className="px-4 py-2">{item.startDate?.slice(0, 10)}</td>
                    <td className="px-4 py-2">{item.endDate?.slice(0, 10)}</td>
                    <td className="px-4 py-2 space-y-1">
                        <button className="bg-[#5c2314] text-white px-4 py-1 rounded">
                        Update
                        </button>
                        <br />
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
                Add New Announcements
                </h2>

                <form className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block font-medium">Message</label>
                    <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border p-2 rounded h-24"
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

                <div className="col-span-2">
                    <label className="block font-medium">Type</label>
                    <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border p-2 rounded"
                    >
                    <option value="">Select Type</option>
                    <option value="Info">Info</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Reminder">Reminder</option>
                    </select>
                </div>

                <div className="col-span-2 flex justify-center gap-4 mt-4">
                    <button
                    type="button"
                    onClick={handleAddAnnouncement}
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
                Edit Announcement
            </h2>

            <form className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                <label className="block font-medium">Message</label>
                <textarea
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    className="w-full border p-2 rounded h-24"
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

                <div className="col-span-2">
                <label className="block font-medium">Type</label>
                <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full border p-2 rounded"
                >
                    <option value="">Select Type</option>
                    <option value="Info">Info</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Reminder">Reminder</option>
                </select>
                </div>

                <div className="col-span-2 flex justify-center gap-4 mt-4">
                <button
                    type="button"
                    onClick={handleUpdateAnnouncement}
                    className="bg-[#5c2314] text-white px-6 py-2 rounded"
                >
                    Update
                </button>
                <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
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
        </div>
        </div>
  )
}

export default Announcements