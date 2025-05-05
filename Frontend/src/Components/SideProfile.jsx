import React from "react";
import profileImg from "../assets/Profile.jpeg";

const SideProfile = () => {
  return (
    <div className="w-1/4 bg-white p-4 rounded-xl shadow">
      <img
        src={profileImg}
        alt="Profile"
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
      />
      <h2 className="text-center font-semibold text-lg">Prinsha Shresthaa</h2>
      <p className="text-center text-sm text-gray-500">Member since April 3, 2012</p>
      <p className="mt-2 text-center text-gray-600 text-sm">
        Book enthusiast with a love for mystery novels and historical fiction.
      </p>
    </div>
  );
};

export default SideProfile;
