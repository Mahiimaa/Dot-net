import React, { useState, useEffect } from "react";
import AdminNav from "../Components/AdminNavbar";
import AdminTop from "../Components/AdminTop";
import axios from "axios";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    type: "Info",
    startDate: "",
    endDate: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({
      message: "",
      type: "Info",
      startDate: "",
      endDate: "",
    });
    setError("");
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5127/api/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setError("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = async () => {
    if (!formData.message || !formData.startDate || !formData.endDate) {
      setError("Please fill all required fields.");
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("End date must be after start date.");
      return;
    }
    try {
      await axios.post("http://localhost:5127/api/announcements", {
        message: formData.message,
        type: formData.type,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      fetchAnnouncements();
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error("Failed to add announcement:", err);
      setError("Failed to add announcement.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      message: item.message,
      type: item.type,
      startDate: item.startDate?.slice(0, 10),
      endDate: item.endDate?.slice(0, 10),
    });
    setShowEditModal(true);
  };

  const handleUpdateAnnouncement = async () => {
    if (!formData.message || !formData.startDate || !formData.endDate) {
      setError("Please fill all required fields.");
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("End date must be after start date.");
      return;
    }
    try {
      await axios.put(`http://localhost:5127/api/announcements/${editId}`, {
        message: formData.message,
        type: formData.type,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      fetchAnnouncements();
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      console.error("Failed to update announcement:", err);
      setError("Failed to update announcement.");
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      await axios.delete(`http://localhost:5127/api/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) {
      console.error("Failed to delete announcement:", err);
      setError("Failed to delete announcement.");
    }
  };

  return (
    <div className="h-screen flex">
      <AdminNav />
      <div className="flex-1 flex flex-col">
        <AdminTop />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Announcements</h2>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="bg-[#1b3a57] text-white px-4 py-2 rounded hover:bg-[#123146] transition"
            >
              Add New Announcement
            </button>
          </div>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="overflow-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-black text-white text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Message</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Start Date</th>
                  <th className="px-4 py-2 text-left">End Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : announcements.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      No announcements found.
                    </td>
                  </tr>
                ) : (
                  announcements.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-2">{item.message}</td>
                      <td className="px-4 py-2">{item.type}</td>
                      <td className="px-4 py-2">
                        {item.startDate?.slice(0, 10)}
                      </td>
                      <td className="px-4 py-2">
                        {item.endDate?.slice(0, 10)}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(item.startDate) <= new Date() &&
                        new Date(item.endDate) >= new Date() ? (
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="text-gray-500">Inactive</span>
                        )}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          className="bg-[#5c2314] text-white px-4 py-1 rounded hover:bg-[#47190f]"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                          onClick={() => handleDeleteAnnouncement(item.id)}
                        >
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
              <div className="bg-white rounded-md p-6 w-[90%] max-w-2xl shadow-lg">
                <h2 className="text-center text-lg font-semibold mb-4">
                  Add New Announcement
                </h2>
                {error && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block font-medium">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full border p-2 rounded h-24"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-medium">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    >
                      <option value="Info">Info</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Reminder">Reminder</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      onClick={handleAddAnnouncement}
                      className="bg-[#1b3a57] text-white px-6 py-2 rounded hover:bg-[#123146]"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showEditModal && (
            <div className="fixed inset-0 bg-gray-800/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-md p-6 w-[90%] max-w-2xl shadow-lg">
                <h2 className="text-center text-lg font-semibold mb-4">
                  Edit Announcement
                </h2>
                {error && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block font-medium">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full border p-2 rounded h-24"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-medium">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    >
                      <option value="Info">Info</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Reminder">Reminder</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      onClick={handleUpdateAnnouncement}
                      className="bg-[#1b3a57] text-white px-6 py-2 rounded hover:bg-[#123146]"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        resetForm();
                      }}
                      className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Announcements;
