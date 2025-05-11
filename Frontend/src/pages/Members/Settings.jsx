import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MemNavbar from "../../Components/MemNavbar";
import SideProfile from "../../Components/SideProfile";
import { IoClose } from "react-icons/io5";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import Navbar from "../Layout/Navbar";

const Settings = () => {
  const { user, isAuthenticated, updateUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showBioBox, setShowBioBox] = useState(false);
  const [tempBio, setTempBio] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    let isMounted = true;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await api.get("/Auth/me");
        if (isMounted) {
          setFormData((prev) => ({
            ...prev,
            firstName: response.data.firstName || "",
            lastName: response.data.lastName || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            bio: response.data.bio || "",
          }));
          updateUser?.({
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            role: response.data.role,
            membershipId: response.data.membershipId,
            phone: response.data.phone,
            bio: response.data.bio,
            profileImageUrl: response.data.profileImageUrl,
            createdAt: response.data.createdAt
          });
        }
      } catch (err) {
        const errorMessage =
          err.response?.status === 401
            ? "Session expired. Please log in again."
            : err.response?.data?.error || err.message || "Failed to load profile";
        setError(errorMessage);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, navigate]); // ✅ FIXED: Removed updateUser

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    const { firstName, lastName, email, phone, bio } = formData;

    if (!firstName || !lastName || !email) {
      alert("Please fill in all required fields (First Name, Last Name, Email).");
      return;
    }

    if (!updateUser) {
      setError("Authentication context error: updateUser is not available");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.put("/Auth/profile", { firstName, lastName, email, phone, bio });
      updateUser({
        ...user,
        firstName,
        lastName,
        email,
        phone,
        bio
      });
      alert("Profile information updated!");
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "Session expired. Please log in again."
          : err.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      alert(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.put("/Auth/password", { currentPassword, newPassword });
      alert("Password updated! Please log in again.");
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "Session expired. Please log in again."
          : err.response?.data?.message || "Failed to update password";
      setError(errorMessage);
      alert(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBioSave = async () => {
    if (!tempBio.trim()) {
      alert("Bio cannot be empty.");
      return;
    }

    if (!updateUser) {
      setError("Authentication context error: updateUser is not available");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.put("/Auth/profile", { ...formData, bio: tempBio });
      setFormData({ ...formData, bio: tempBio });
      updateUser({ ...user, bio: tempBio });
      setShowBioBox(false);
      alert("Bio saved!");
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "Session expired. Please log in again."
          : err.response?.data?.message || "Failed to save bio";
      setError(errorMessage);
      alert(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { name: "Account Overview", path: "/account" },
    { name: "Orders", path: "/order" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Reviews", path: "/reviews" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
      <div className="flex gap-6 mt-8">
        <SideProfile />

        <div className="w-3/4 relative">
          <div className="flex gap-6 border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                className={`pb-2 border-b-2 ${
                  location.pathname === tab.path
                    ? "border-brown-500 text-brown-700 font-medium"
                    : "text-gray-500"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>

          {loading ? (
            <p className="text-gray-500">Loading profile...</p>
          ) : error ? (
            <p className="text-red-500 mb-4">{error}</p>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <button
                  onClick={() => {
                    setTempBio(formData.bio);
                    setShowBioBox(true);
                  }}
                  className="bg-blue-200 text-blue-800 px-4 py-1 rounded"
                >
                  Add Bio
                </button>
              </div>

              {showBioBox && (
                <div className="absolute top-20 right-0 w-80 bg-white p-4 rounded-lg shadow-lg border z-10">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-700">Describe Yourself</h3>
                    <button onClick={() => setShowBioBox(false)}>
                      <IoClose className="text-xl text-gray-600 hover:text-gray-800" />
                    </button>
                  </div>
                  <textarea
                    rows="3"
                    className="w-full border rounded p-2 mb-2"
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                  />
                  <button
                    onClick={handleBioSave}
                    disabled={loading}
                    className={`bg-blue-900 text-white px-4 py-1 rounded ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Save
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name:</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name:</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full border rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </div>

                <button
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className={`bg-blue-900 text-white px-4 py-2 rounded w-max ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Save Changes
                </button>

                <h2 className="text-lg font-semibold mt-6">Change Password</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password:</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">New Password:</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    />
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>

                <button
                  onClick={handleUpdatePassword}
                  disabled={loading}
                  className={`bg-blue-900 text-white px-4 py-2 rounded w-max ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Update Password
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Settings;
