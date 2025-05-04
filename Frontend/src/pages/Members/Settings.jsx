// // import React, { useState } from "react";
// // import MemNavbar from "../../Components/MemNavbar";
// // import SideProfile from "../../Components/SideProfile";
// // import { Link, useLocation } from "react-router-dom";

// // const Settings = () => {
// //   const location = useLocation();

// //   const [formData, setFormData] = useState({
// //     firstName: "",
// //     lastName: "",
// //     email: "",
// //     phone: "",
// //     bio: "",
// //     currentPassword: "",
// //     newPassword: "",
// //     confirmPassword: "",
// //   });

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSaveChanges = () => {
// //     // TODO: Make API call here to save profile info
// //     alert("Profile information updated!");
// //   };

// //   const handleUpdatePassword = () => {
// //     // TODO: Make API call here to update password
// //     if (formData.newPassword !== formData.confirmPassword) {
// //       alert("Passwords do not match!");
// //       return;
// //     }
// //     alert("Password updated!");
// //   };

// //   const tabs = [
// //     { name: "Account Overview", path: "/account" },
// //     { name: "Orders", path: "/order" },
// //     { name: "Wishlist", path: "/wishlist" },
// //     { name: "Reviews", path: "/review" },
// //     { name: "Settings", path: "/setting" },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <MemNavbar />

// //       <div className="flex gap-8">
// //         <SideProfile />

// //         <div className="w-3/4">
// //           {/* Tabs */}
// //           <div className="flex gap-6 border-b border-gray-200 mb-6">
// //             {tabs.map((tab) => (
// //               <Link
// //                 key={tab.name}
// //                 to={tab.path}
// //                 className={`pb-2 border-b-2 ${
// //                   location.pathname === tab.path
// //                     ? "border-brown-500 text-brown-700 font-medium"
// //                     : "text-gray-500"
// //                 }`}
// //               >
// //                 {tab.name}
// //               </Link>
// //             ))}
// //           </div>

// //           <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

// //           {/* Add Bio */}
// //           <div className="mb-4">
// //             <button className="bg-blue-200 text-blue-800 px-4 py-1 rounded mb-2">
// //               Add Bio
// //             </button>
// //             <textarea
// //               name="bio"
// //               value={formData.bio}
// //               onChange={handleChange}
// //               className="w-full border rounded p-2"
// //               rows="2"
// //             ></textarea>
// //           </div>

// //           {/* Form */}
// //           <div className="flex flex-col gap-4">
// //             <div>
// //               <label>First Name:</label>
// //               <input
// //                 name="firstName"
// //                 value={formData.firstName}
// //                 onChange={handleChange}
// //                 className="w-full border rounded p-2"
// //               />
// //             </div>

// //             <div>
// //               <label>Last Name:</label>
// //               <input
// //                 name="lastName"
// //                 value={formData.lastName}
// //                 onChange={handleChange}
// //                 className="w-full border rounded p-2"
// //               />
// //             </div>

// //             <div>
// //               <label>Email:</label>
// //               <input
// //                 name="email"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 className="w-full border rounded p-2"
// //               />
// //             </div>

// //             <div>
// //               <label>Phone Number:</label>
// //               <input
// //                 name="phone"
// //                 value={formData.phone}
// //                 onChange={handleChange}
// //                 className="w-full border rounded p-2"
// //               />
// //             </div>

// //             <button
// //               onClick={handleSaveChanges}
// //               className="bg-blue-400 text-white px-4 py-2 rounded w-max"
// //             >
// //               Save Changes
// //             </button>

// //             <div>
// //               <label>Current Password:</label>
// //               <input
// //                 type="password"
// //                 name="currentPassword"
// //                 value={formData.currentPassword}
// //                 onChange={handleChange}
// //                 className="w-full border rounded p-2"
// //               />
// //             </div>

// //             <div className="flex gap-4">
// //               <div className="w-1/2">
// //                 <label>New Password:</label>
// //                 <input
// //                   type="password"
// //                   name="newPassword"
// //                   value={formData.newPassword}
// //                   onChange={handleChange}
// //                   className="w-full border rounded p-2"
// //                 />
// //               </div>

// //               <div className="w-1/2">
// //                 <label>Confirm Password:</label>
// //                 <input
// //                   type="password"
// //                   name="confirmPassword"
// //                   value={formData.confirmPassword}
// //                   onChange={handleChange}
// //                   className="w-full border rounded p-2"
// //                 />
// //               </div>
// //             </div>

// //             <button
// //               onClick={handleUpdatePassword}
// //               className="bg-blue-400 text-white px-4 py-2 rounded w-max"
// //             >
// //               Update Password
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Settings;

// import React, { useState } from "react";
// import MemNavbar from "../../Components/MemNavbar";
// import SideProfile from "../../Components/SideProfile";
// import { Link, useLocation } from "react-router-dom";
// import { IoClose } from "react-icons/io5";

// const Settings = () => {
//   const location = useLocation();

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     bio: "",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [showBioBox, setShowBioBox] = useState(false);
//   const [tempBio, setTempBio] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSaveChanges = () => {
//     alert("Profile information updated!");
//   };

//   const handleUpdatePassword = () => {
//     if (formData.newPassword !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }
//     alert("Password updated!");
//   };

//   const handleBioSave = () => {
//     setFormData({ ...formData, bio: tempBio });
//     setShowBioBox(false);
//   };

//   const tabs = [
//     { name: "Account Overview", path: "/account" },
//     { name: "Orders", path: "/order" },
//     { name: "Wishlist", path: "/wishlist" },
//     { name: "Reviews", path: "/review" },
//     { name: "Settings", path: "/setting" },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <MemNavbar />

//       <div className="flex gap-8">
//         <SideProfile />

//         <div className="w-3/4 relative">
//           {/* Tabs */}
//           <div className="flex gap-6 border-b border-gray-200 mb-6">
//             {tabs.map((tab) => (
//               <Link
//                 key={tab.name}
//                 to={tab.path}
//                 className={`pb-2 border-b-2 ${
//                   location.pathname === tab.path
//                     ? "border-brown-500 text-brown-700 font-medium"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {tab.name}
//               </Link>
//             ))}
//           </div>

//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Personal Information</h2>
//             <button
//               onClick={() => {
//                 setTempBio(formData.bio);
//                 setShowBioBox(true);
//               }}
//               className="bg-blue-200 text-blue-800 px-4 py-1 rounded"
//             >
//               Add Bio
//             </button>
//           </div>

//           {/* Bio Popup Box */}
//           {showBioBox && (
//             <div className="absolute top-20 right-0 w-80 bg-white p-4 rounded-lg shadow-lg border z-10">
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="font-medium text-gray-700">Describe Yourself</h3>
//                 <button onClick={() => setShowBioBox(false)}>
//                   <IoClose className="text-xl text-gray-600 hover:text-gray-800" />
//                 </button>
//               </div>
//               <textarea
//                 rows="3"
//                 className="w-full border rounded p-2 mb-2"
//                 value={tempBio}
//                 onChange={(e) => setTempBio(e.target.value)}
//               />
//               <button
//                 onClick={handleBioSave}
//                 className="bg-blue-500 text-white px-4 py-1 rounded"
//               >
//                 Save
//               </button>
//             </div>
//           )}

//           {/* Form */}
//           <div className="flex flex-col gap-4">
//             <div>
//               <label>First Name:</label>
//               <input
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//               />
//             </div>

//             <div>
//               <label>Last Name:</label>
//               <input
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//               />
//             </div>

//             <div>
//               <label>Email:</label>
//               <input
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//               />
//             </div>

//             <div>
//               <label>Phone Number:</label>
//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//               />
//             </div>

//             <div>
//               <label>Bio:</label>
//               <textarea
//                 name="bio"
//                 value={formData.bio}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//                 rows="2"
//               ></textarea>
//             </div>

//             <button
//               onClick={handleSaveChanges}
//               className="bg-blue-400 text-white px-4 py-2 rounded w-max"
//             >
//               Save Changes
//             </button>

//             <div>
//               <label>Current Password:</label>
//               <input
//                 type="password"
//                 name="currentPassword"
//                 value={formData.currentPassword}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//               />
//             </div>

//             <div className="flex gap-4">
//               <div className="w-1/2">
//                 <label>New Password:</label>
//                 <input
//                   type="password"
//                   name="newPassword"
//                   value={formData.newPassword}
//                   onChange={handleChange}
//                   className="w-full border rounded p-2"
//                 />
//               </div>

//               <div className="w-1/2">
//                 <label>Confirm Password:</label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="w-full border rounded p-2"
//                 />
//               </div>
//             </div>

//             <button
//               onClick={handleUpdatePassword}
//               className="bg-blue-400 text-white px-4 py-2 rounded w-max"
//             >
//               Update Password
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

import React, { useState } from "react";
import MemNavbar from "../../Components/MemNavbar";
import SideProfile from "../../Components/SideProfile";
import { Link, useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const Settings = () => {
  const location = useLocation();

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    const { firstName, lastName, email, phone } = formData;

    if (!firstName || !lastName || !email || !phone) {
      alert("Please fill in all personal information fields.");
      return;
    }

    alert("Profile information updated!");
  };

  const handleUpdatePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Password updated!");
  };

  const handleBioSave = () => {
    if (!tempBio.trim()) {
      alert("Bio cannot be empty.");
      return;
    }

    setFormData({ ...formData, bio: tempBio });
    setShowBioBox(false);
    alert("Bio saved!");
  };

  const tabs = [
    { name: "Account Overview", path: "/account" },
    { name: "Orders", path: "/order" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Reviews", path: "/review" },
    { name: "Settings", path: "/setting" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <MemNavbar />

      <div className="flex gap-8">
        <SideProfile />

        <div className="w-3/4 relative">
          {/* Tabs */}
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

          {/* Bio Popup Box */}
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
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-4">
            <div>
              <label>First Name:</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label>Last Name:</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label>Email:</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label>Phone Number:</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <button
              onClick={handleSaveChanges}
              className="bg-blue-400 text-white px-4 py-2 rounded w-max"
            >
              Save Changes
            </button>

            <div>
              <label>Current Password:</label>
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
                <label>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="w-1/2">
                <label>Confirm Password:</label>
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
              className="bg-blue-400 text-white px-4 py-2 rounded w-max"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
