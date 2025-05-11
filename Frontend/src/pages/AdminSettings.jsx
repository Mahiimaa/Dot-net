import React, { useEffect, useState } from "react";
import AdminNav from "../Components/AdminNavbar";
import AdminTop from "../Components/AdminTop";
import axios from "axios";

function AdminSettings() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const userResponse = await axios.get(
        "http://localhost:5127/Auth/me",
        config
      );
      const userRole = userResponse.data.role;
      setCurrentUserRole(userRole);

      if (userRole !== "Admin") {
        setError("Only admins can access this page.");
        setLoading(false);
        return;
      }

      const usersResponse = await axios.get(
        "http://localhost:5127/api/users",
        config
      );
      const usersData = usersResponse.data?.users || usersResponse.data || [];
      setUsers(usersData);
      setFilteredUsers(usersData);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load data", err);
      setError(
        `Failed to load data: ${err.response?.data?.error || err.message}`
      );
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const assignStaffRole = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5127/Auth/assign-staff/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      alert("Staff role assigned successfully!");
    } catch (err) {
      console.error("Failed to assign staff role:", err);
      alert(
        `Failed to assign staff role: ${
          err.response?.data?.error || err.message
        }`
      );
    }
  };

  const removeStaffRole = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5127/Auth/remove-staff/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      alert("Staff role removed successfully! User is now a normal user.");
    } catch (err) {
      console.error("Failed to remove staff role:", err);
      alert(
        `Failed to remove staff role: ${
          err.response?.data?.error || err.message
        }`
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="h-screen flex ">
      <AdminNav />
      <div className="flex-1 flex flex-col">
        <AdminTop />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Assign Staff Role</h2>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search by name or email..."
                  className="w-full max-w-md border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-[#1b3a57]"
                />
              </div>
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold mb-4">Users</h3>
                {filteredUsers.length === 0 ? (
                  <p className="text-gray-500">No users found.</p>
                ) : (
                  <div className="overflow-auto">
                    <table className="w-full text-sm border">
                      <thead className="bg-gray-200 text-left">
                        <tr>
                          <th className="px-4 py-2">User ID</th>
                          <th className="px-4 py-2">Name</th>
                          <th className="px-4 py-2">Email</th>
                          <th className="px-4 py-2">Role</th>
                          <th className="px-4 py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="border-t">
                            <td className="px-4 py-2">{u.id}</td>
                            <td className="px-4 py-2">
                              {u.firstName} {u.lastName}
                            </td>
                            <td className="px-4 py-2">{u.email}</td>
                            <td className="px-4 py-2">{u.role}</td>
                            <td className="px-4 py-2">
                              {u.role !== "Admin" && u.role !== "Staff" && (
                                <button
                                  onClick={() => assignStaffRole(u.id)}
                                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                                >
                                  Assign Staff Role
                                </button>
                              )}
                              {u.role === "Staff" && (
                                <button
                                  onClick={() => removeStaffRole(u.id)}
                                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                                >
                                  Remove Staff Role
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
