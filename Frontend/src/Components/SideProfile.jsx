import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import profileImg from "../assets/Profile.jpeg";

const SideProfile = () => {
  const { user } = useContext(AuthContext);

  // Fallback values if user data is not available
  const fullName = user ? `${user.firstName} ${user.lastName}` : "User Name";
  const bio =
    user?.bio ||
    "Book enthusiast with a love for mystery novels and historical fiction.";
  const profileImage = user?.profileImageUrl || profileImg;
  const membershipDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div className="w-1/4 bg-white p-4 rounded-xl shadow mt-4">
      <img
        src={profileImage}
        alt="Profile"
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
        onError={(e) => (e.target.src = profileImg)}
      />
      <h2 className="text-center font-semibold text-lg">{fullName}</h2>
      <p className="text-center text-sm text-gray-500">
        Member since {membershipDate}
      </p>
      <p className="mt-2 text-center text-gray-600 text-sm">{bio}</p>
    </div>
  );
};

export default SideProfile;
