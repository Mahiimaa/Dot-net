import React from 'react'
import { FiLogOut } from 'react-icons/fi';

function AdminTop() {
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/login'; 
  };

  return (
    <div className="bg-gray-200 h-14 flex items-center px-6 border-b border-gray-300 w-full">
      <div className=" flex justify-between items-center w-[98%]">
        <p className='text-md font-medium'>Welcome, Admin!</p>
       
      <button className='bg-[#07375c] hover:bg-[#5c2314] p-2 px-4 text-white border rounded-md gap-2 flex items-center'
      onClick={handleLogout}
      >
         <FiLogOut className="" size={18}/>
         Logout
      </button>
      </div>
    </div>
  )
}

export default AdminTop